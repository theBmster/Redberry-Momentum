import axiosInstance from '@/axios/config';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const APIContext = createContext();

const Alert = ({ message, onClose }) => {
    return (
        <motion.div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-[10px] border border-purple px-4 py-3 flex items-center"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="text-gray-dark font-firaGo font-semibold text-lg">{message}</div>
        </motion.div>
    );
};

export const APIProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);
    const [statuses, setStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [comments, setComments] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [alerts, setAlerts] = useState([]);

    const showAlert = useCallback((message, duration = 3000) => {
        const id = Date.now();
        setAlerts(prev => [...prev, { id, message }]);

        setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== id));
        }, duration);

        return id;
    }, []);

    const closeAlert = useCallback((id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statuses, priorities, departments, tasks, employees] = await Promise.all([
                axiosInstance.get('/statuses'),
                axiosInstance.get('/priorities'),
                axiosInstance.get('/departments'),
                axiosInstance.get('/tasks'),
                axiosInstance.get('/employees')
            ]);

            setStatuses(statuses.data);
            setPriorities(priorities.data);
            setDepartments(departments.data);
            setTasks(tasks.data);
            setEmployees(employees.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            showAlert('მონაცემების ჩატვირთვა ვერ მოხერხდა', 5000);
            console.error('Error fetching data:', error);
        }
    };
    const fetchTask = async (id) => {
        try {
            const response = await axiosInstance.get(`/tasks/${id}`);
            return response.data;
        } catch (error) {
            setLoading(false);
            showAlert('მონაცემების ჩატვირთვა ვერ მოხერხდა', 5000);
            console.error('Error fetching task data:', error);
            return null;
        }
    }
    const fetchComments = async (id) => {
        try {
            const response = await axiosInstance.get(`/tasks/${id}/comments`);
            return response.data;

        } catch (error) {
            setLoading(false);
            showAlert('მონაცემების ჩატვირთვა ვერ მოხერხდა', 5000);
            console.error('Error fetching task data:', error);
            return null;
        }
    }
    const addComment = async (id, text, employeeId) => {
        try {
            await axiosInstance.post(`/tasks/${id}/comments`, {
                'text': text,
                'partner_id': employeeId
            });

        } catch (error) {
            setLoading(false);
            showAlert('კომენტარის შენახვა ვერ მოხერხდა', 5000);
            return null;
        }
    }
    const updateTaskStatus = async (id, statusId) => {
        try {
            await axiosInstance.put(`/tasks/${id}`, {
                'status_id': statusId
            })
        } catch (error) {
            showAlert('სტატუსის შეცვლა ვერ მოხერხდა')
        }
    }
    const createEmployee = async (formData) => {
        try {
            const formDataToSend = new FormData();

            formDataToSend.append('name', formData.name);
            formDataToSend.append('surname', formData.surname);
            formDataToSend.append('department_id', formData.department_id);

            if (formData.avatar && formData.avatar instanceof File) {
                formDataToSend.append('avatar', formData.avatar);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            const res = await axiosInstance.post('/employees', formDataToSend, config);

            if (res.status === 201 && res.data) {
                setEmployees(prev => [...prev, res.data]);
                showAlert('თანამშრომელი წარმატებით შეიქმნა', 3000);
            }

            return { status: res.status, message: 'თანამშრომელი წარმატებით შეიქმნა' };
        } catch (error) {
            const status = error.response?.status || 500;
            let message = 'გთხოვთ სცადოთ მოგვიანებით';

            switch (status) {
                case 401:
                    message = '401 - თქვენ არ გაქვთ უფლება :(';
                    break;
                case 422:
                    message = 'გადაამოწმეთ ინფორმაცია და სცადეთ თავიდან';
                    break;
            }

            showAlert(message, 5000);
        }
    };
    const createTask = async (formData) => {
        try {
            const response = await axiosInstance.post('/tasks', formData);
            showAlert('დავალება წარმატებით შეიქმნა', 3000);
            return response.data;
        } catch (error) {
            console.error('Task creation error:', error);
            showAlert('დავალება ვერ შეიქმნა', 3000);
            throw error; // Re-throw so the component can handle it
        }
    }
    const apiValues = {
        statuses,
        priorities,
        departments,
        tasks,
        employees,
        loading,
        fetchData,
        fetchTask,
        addComment,
        fetchComments,
        createEmployee,
        updateTaskStatus,
        showAlert,
        createTask
    };

    return (
        <APIContext.Provider value={apiValues}>
            {children}
            <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
                <AnimatePresence>
                    {alerts.map(alert => (
                        <div key={alert.id} className="pointer-events-auto">
                            <Alert
                                message={alert.message}
                                onClose={() => closeAlert(alert.id)}
                            />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </APIContext.Provider>
    );
};

export const useAPI = () => {
    const context = useContext(APIContext);
    if (!context) {
        throw new Error('useAPI must be used within an APIProvider');
    }
    return context;
};