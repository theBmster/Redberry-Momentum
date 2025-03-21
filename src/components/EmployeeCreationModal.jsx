import React, { useState, useCallback, useEffect } from "react";
import Button from "@/components/Button";
import { motion, AnimatePresence } from "framer-motion";
import FormInputField from "./InputField";
import { useAPI } from "@/contexts/APIProvider";
import CustomSelect from "./CustomSelector";
import XIconRound from '@/assets/img/XIconRound.svg';
import photoUploadIcon from '@/assets/img/photoUpload.svg';

const EmployeeCreationModal = ({ isOpen = false, onClose }) => {
    const { departments, createEmployee } = useAPI();
    const [errors, setErrors] = useState({
        avatar: '',
        department: ''
    })
    const [imagePreview, setImagePreview] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        avatar: '',
        department_id: null
    });

    const handleOutsideClick = (e) => {
        if (e.target.className.includes('modal-overlay')) {
            handleClose();
        }
    };

    const handleInputChange = useCallback((value, isValid, fieldName) => {
        if (isValid) {
            setFormData(prevData => ({
                ...prevData,
                [fieldName]: value
            }));
        }
    }, []);

    const handleDepartmentChange = useCallback((departmentId) => {
        setFormData(prevData => ({
            ...prevData,
            department_id: departmentId
        }));

        if (departmentId) {
            setErrors(prev => ({ ...prev, department: '' }));
        }
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, avatar: 'გთხოვთ ატვირთოთ მხოლოდ სურათი' }));
                e.target.value = '';
                return;
            }
            if (file.size > 1 * 1000 * 600) {
                setErrors(prev => ({ ...prev, avatar: 'სურათის ზომა არ უნდა აღემატებოდეს 600KB-ს' }));
                return;
            }
            setFormData(prev => ({ ...prev, avatar: file }));
            setImagePreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, avatar: '' }));
        }
    };

    const removeAvatar = () => {
        setFormData(prev => ({ ...prev, avatar: null }));
        setImagePreview(null);
    };
    const handleClose = () => {
        setFormData({
            name: '',
            surname: '',
            avatar: '',
            department_id: null
        });
        setErrors({
            avatar: '',
            department: ''
        })
        setImagePreview(null);
        onClose();
    };

    const handleSubmit = async () => {
        setErrors({
            avatar: '',
            department: ''
        });

        let isValid = true;

        if (!formData.avatar) {
            setErrors(prev => ({ ...prev, avatar: 'ავატარი სავალდებულოა' }));
            isValid = false;
        }

        if (!formData.department_id) {
            setErrors(prev => ({ ...prev, department: 'დეპარტამენტი სავალდებულოა' }));
            isValid = false;
        }

        if (isValid) {
            const res = await createEmployee(formData);
            if (res.status === 201) {
                handleClose();
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay select-none fixed inset-0 flex justify-center items-start pt-20 bg-black/30 backdrop-blur-sm z-50"
                    onClick={handleOutsideClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="bg-white h-[770px] gap-[37px] w-[915px] rounded-[10px] shadow-lg px-[50px] pt-[40px] pb-[60px]"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                            duration: 0.4
                        }}
                    >
                        <div className="w-full flex items-center justify-end">
                            <img src={XIconRound} alt="close icon" className="cursor-pointer" onClick={handleClose} />
                        </div>
                        {/* content */}
                        <div className="w-full h-full flex flex-col items-center gap-[45px]">
                            <h1 className="font-firaGO font-semibold text-[32px] text-ourBlack">თანამშრომლის დამატება</h1>
                            {/* form */}
                            <div className="flex w-full gap-[45px]">
                                <FormInputField
                                    onChange={(value, isValid) => handleInputChange(value, isValid, 'name')}
                                    debounceTime={200}
                                />
                                <FormInputField
                                    label="გვარი"
                                    onChange={(value, isValid) => handleInputChange(value, isValid, 'surname')}
                                    debounceTime={200}
                                />
                            </div>
                            <div className="w-full bg-white">
                                <label className="font-firaGO font-semibold text-[14px] text-gray-dark block">

                                    ავატარი*
                                </label>

                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="image-upload"
                                    accept="image/*"
                                />
                                <div className="border-[1px] border-dashed mt-[5px] border-gray rounded-[8px] p-0 flex items-center justify-center h-[120px]">
                                    {!imagePreview ? (
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer h-full w-full flex flex-col justify-center items-center font-firaGO font-normal text-sm"
                                        >
                                            <img src={photoUploadIcon} alt="upload photo icon" />
                                            ატვირთე ფოტო
                                        </label>
                                    ) : (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Uploaded preview" className="max-w-[88px] max-h-[88px] object-cover rounded-full" />
                                            <button
                                                onClick={removeAvatar}
                                                className="absolute -bottom-1 -right-1 cursor-pointer border-[0.3px] border-gray-light bg-white rounded-full"
                                                type="button"
                                            >
                                                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.75 9.5H8.91667H18.25" stroke="#6C757D" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M17.0837 9.49984V17.6665C17.0837 17.9759 16.9607 18.2727 16.7419 18.4915C16.5232 18.7103 16.2264 18.8332 15.917 18.8332H10.0837C9.77424 18.8332 9.47749 18.7103 9.2587 18.4915C9.03991 18.2727 8.91699 17.9759 8.91699 17.6665V9.49984M10.667 9.49984V8.33317C10.667 8.02375 10.7899 7.72701 11.0087 7.50821C11.2275 7.28942 11.5242 7.1665 11.8337 7.1665H14.167C14.4764 7.1665 14.7732 7.28942 14.9919 7.50821C15.2107 7.72701 15.3337 8.02375 15.3337 8.33317V9.49984" stroke="#6C757D" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M11.833 12.4165V15.9165" stroke="#6C757D" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M14.167 12.4165V15.9165" stroke="#6C757D" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {errors.avatar && (
                                    <span className="font-firaGO text-sm text-red">{errors.avatar}</span>
                                )}
                            </div>
                            <div className="w-1/2 self-start">
                                <CustomSelect
                                    options={departments || []}
                                    label="დეპარტამენტი"
                                    value={formData.department_id}
                                    onSelect={handleDepartmentChange}
                                />
                                {errors.department && (
                                    <span className="font-firaGO text-sm text-red">{errors.department}</span>
                                )}
                            </div>
                            <div className="flex self-end gap-[22px]">
                                <Button text='გაუქმება' solid={false} onClick={handleClose} />
                                <Button text='დაამატე თანამშრომელი' onClick={handleSubmit} />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EmployeeCreationModal;