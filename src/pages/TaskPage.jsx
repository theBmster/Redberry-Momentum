import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import FormInputField from "@/components/InputField";
import CustomSelect from "@/components/CustomSelector";
import { useAPI } from "@/contexts/APIProvider";
import Button from "@/components/Button";
import { useModal } from "@/contexts/ModalProvider";
import Check from "@/assets/icons/Check";

const TaskPage = () => {
    const navigate = useNavigate();
    const [departmentEmployees, setDepartmentEmployees] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isTextAreaValid, setIsTextAreaValid] = useState(false);
    const { openModal } = useModal();
    const { priorities, statuses, departments, getEmployeesByDepartment, createTask, employees, showAlert } = useAPI();

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        due_date: getTomorrowDate(),
        status_id: 1,
        priority_id: 0,
        department_id: null,
        employee_id: null
    });

    useEffect(() => {
        const newFormData = { ...formData };

        if (statuses.length > 0) {
            newFormData.status_id = statuses[0].id;
        }

        if (priorities.length > 0) {
            const mediumPriority = priorities.find(p => p.name === "საშუალო");
            newFormData.priority_id = mediumPriority ? mediumPriority.id : priorities[1]?.id;
        }

        setFormData(newFormData);
    }, [statuses, priorities]);

    useEffect(() => {
        if (formData.department_id && employees.length > 0) {
            const filtered = employees.filter(employee =>
                employee.department && employee.department.id === parseInt(formData.department_id));
            setDepartmentEmployees(filtered);
        } else {
            setDepartmentEmployees([]);
        }

        setFormData(prev => ({
            ...prev,
            employee_id: null
        }));
    }, [formData.department_id, employees]);

    const handleTextFieldChange = (field) => (value, isValid) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        setFormErrors(prev => ({
            ...prev,
            [field]: !isValid
        }));

        validateForm();
    };

    const handleSelectChange = (field) => (value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        setFormErrors(prev => ({
            ...prev,
            [field]: !value
        }));

        validateForm();
    };

    const handleDateChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            due_date: value
        }));

        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        setFormErrors(prev => ({
            ...prev,
            due_date: selectedDate < today
        }));

        validateForm();
    };

    const validateForm = () => {
        const errors = {
            name: !formData.name || formData.name.length < 3 || formData.name.length > 255,
            description: formData.description.length > 0 && (
                (formData.description.trim().split(/\s+/).length < 4 && formData.description.length > 0) ||
                formData.description.length > 255
            ),
            due_date: !formData.due_date || new Date(formData.due_date) < new Date().setHours(0, 0, 0, 0),
            priority_id: !formData.priority_id,
            status_id: !formData.status_id,
            department_id: !formData.department_id,
            employee_id: formData.department_id && !formData.employee_id
        };

        setFormErrors(errors);
        const valid = !Object.values(errors).some(error => error);
        setIsFormValid(valid);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validateForm();

        if (!isValid) {
            showValidationAlerts();
            return;
        }

        try {
            await createTask(formData);
            localStorage.removeItem('taskCreationForm');
            showAlert('დავალება წარმატებით შეიქმნა!', 3000);
            navigate('/');
        } catch (error) {
            showAlert('დავალების შექმნა ვერ მოხერხდა. გთხოვთ, სცადოთ ხელახლა.', 5000);
        }
    };

    const showValidationAlerts = () => {
        if (formErrors.name) {
            showAlert('სათაური უნდა შეიცავდეს მინიმუმ 3 და მაქსიმუმ 255 სიმბოლოს', 3000);
            return;
        }

        if (formErrors.description) {
            showAlert('აღწერა უნდა შეიცავდეს მინიმუმ 4 სიტყვას და მაქსიმუმ 255 სიმბოლოს', 3000);
            return;
        }

        if (formErrors.due_date) {
            showAlert('გთხოვთ, აირჩიოთ მომავალი თარიღი დედლაინისთვის', 3000);
            return;
        }

        if (formErrors.department_id) {
            showAlert('გთხოვთ, აირჩიოთ დეპარტამენტი', 3000);
            return;
        }

        if (formErrors.employee_id) {
            showAlert('გთხოვთ, აირჩიოთ პასუხისმგებელი თანამშრომელი', 3000);
            return;
        }
    };

    const handleAddEmployee = () => {
        openModal();
    };

    useEffect(() => {
        localStorage.setItem('taskCreationForm', JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        const savedForm = localStorage.getItem('taskCreationForm');
        if (savedForm) {
            try {
                const parsedForm = JSON.parse(savedForm);
                setFormData(parsedForm);
            } catch (error) {
                showAlert('შენახული ფორმის მონაცემების წაკითხვა ვერ მოხერხდა', 3000);
            }
        }
    }, []);

    return (
        <div className="h-screen w-screen bg-white select-none">
            <Header />
            <section className="mx-[120px]">
                <motion.h1
                    className="font-firaGO select-none font-bold text-[34px] text-ourBlack mt-[40px] mb-[25px]"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    შექმენი ახალი დავალება
                </motion.h1>
                <form onSubmit={handleSubmit}>
                    <div className="bg-[#FBF9FFA6] border-[0.3px] h-min border-[#DDD2FF] rounded-sm px-[55px] py-[55px] flex flex-col">
                        <div className="flex mb-[145px] gap-[160px]">
                            <div className="flex flex-col gap-[55px] w-[550px]">
                                <FormInputField
                                    label="სათაური"
                                    initialValue={formData.name}
                                    onChange={handleTextFieldChange("name")}
                                    minLength={3}
                                    maxLength={255}
                                    allowSpaces={true}
                                />
                                <div className='w-full'>
                                    <div className='mb-1'>
                                        <label className="font-firaGO font-semibold text-[14px] text-gray-dark block">
                                            აღწერა
                                        </label>
                                    </div>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
                                            const isValid = (wordCount >= 4 || value.length === 0) && value.length <= 255;
                                            setIsTextAreaValid(isValid);

                                            handleTextFieldChange("description")(value, isValid);
                                        }}
                                        className={`bg-white w-full resize-none min-h-[84px] outline-0 p-2.5 border-[1px] rounded-md mb-1.5 ${formData.description && formErrors.description ? 'border-red' : 'border-gray'
                                            }`}
                                    />

                                    <div className="text-xs mt-1">
                                        <div className="flex items-center gap-0.5">
                                            <Check color={formData.description === "" ? "#6C757D" : (isTextAreaValid ? "#08A508" : "#FA4D4D")} />

                                            <span className={
                                                formData.description === "" ? "text-gray-dark" :
                                                    (formData.description.trim().split(/\s+/).length >= 4 || formData.description.length === 0 ? "text-green-500" : "text-red")
                                            }>
                                                მინიმუმ 4 სიტყვა
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-0.5">
                                            <Check color={formData.description === "" ? "#6C757D" : (isTextAreaValid ? "#08A508" : "#FA4D4D")} />

                                            <span className={
                                                formData.description === "" ? "text-gray-dark" :
                                                    (isTextAreaValid ? "text-green-500" : "text-red")
                                            }>
                                                მაქსიმუმ 255 სიმბოლო
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-8">
                                    <CustomSelect
                                        label="პრიორიტეტი"
                                        options={priorities}
                                        value={formData.priority_id}
                                        onSelect={handleSelectChange("priority_id")}
                                    />
                                    <CustomSelect
                                        label="სტატუსი"
                                        options={statuses}
                                        value={formData.status_id}
                                        onSelect={handleSelectChange("status_id")}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-[100px] w-[550px]">
                                <CustomSelect
                                    label="დეპარტამენტი"
                                    options={departments}
                                    value={formData.department_id}
                                    onSelect={handleSelectChange("department_id")}
                                />
                                <CustomSelect
                                    label="პასუხისმგებელი თანამსრომელი"
                                    options={departmentEmployees}
                                    value={formData.employee_id}
                                    onSelect={handleSelectChange("employee_id")}
                                    disabled={!formData.department_id}
                                    addOption="ახალი თანამშრომლის დამატება"
                                    onAddOption={handleAddEmployee}
                                />
                                <div className="flex flex-col pt-6">
                                    <label className="font-firaGO font-semibold text-[14px] text-gray-dark mb-2 block">
                                        დედლაინი<span>*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.due_date}
                                        onChange={handleDateChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className={`bg-white w-full h-[42px] outline-0 p-2.5 border-[1px] rounded-md ${formErrors.due_date ? 'border-red' : 'border-gray'
                                            }`}
                                    />
                                    {formErrors.due_date && (
                                        <p className="text-red text-xs mt-1">წარსული თარიღი არ არის დაშვებული</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="w-[208px] self-end mr-[200px]">
                            <Button
                                text='დავალების შექმნა'
                                type="submit"
                                disabled={!isFormValid}
                                onClick={handleSubmit}
                            />
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default TaskPage;