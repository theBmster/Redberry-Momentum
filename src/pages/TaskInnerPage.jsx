import { useAPI } from "@/contexts/APIProvider";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loadingbar from "@/components/Loadingbar";
import Priority from "@/components/Priority";
import Department from "@/components/Departments";
import CustomSelect from "@/components/CustomSelector";
import { formatToGeorgianDate } from "@/hooks/formatToGEDate";

import pieChartIcon from "@/assets/img/pie-chart.svg";
import personIcon from "@/assets/img/person.svg";
import calendarIcon from "@/assets/img/calendar.svg";

const TaskInnerPage = () => {
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const location = useLocation();
    const { showAlert, fetchTask, statuses, fetchComments, addComment, updateTaskStatus } = useAPI();
    const navigate = useNavigate();

    useEffect(() => {
        const loadTask = async () => {
            try {
                const taskId = location.state.taskId;
                const taskData = await fetchTask(taskId);
                const commentsData = await fetchComments(taskId);
                if (taskData) {
                    setTask(taskData);
                    setComments(commentsData);
                } else {
                    showAlert('მსგავსი დავალება არ არსებობს', 3000);
                    navigate('*');
                }
            } catch (error) {
                console.error("Error loading task:", error);
                showAlert('დავალების ჩატვირთვა ვერ მოხერხდა', 3000);
                navigate('*');
            } finally {
                setLoading(false);
            }
        };

        loadTask();
    }, [location.pathname, fetchTask, navigate, showAlert]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            await addComment(task.id, commentText, task.employee.id);
            const commentsData = await fetchComments(task.id);
            setComments(commentsData);
            setCommentText('');
        } catch (error) {
            console.error("Error adding comment:", error);
            showAlert('კომენტარის დამატება ვერ მოხერხდა', 3000);
        }
    };
    const handleStatusChange = async (statusId) => {
        try {
            await updateTaskStatus(task.id, statusId);
            const updatedTask = {
                ...task,
                status: statuses.find(status => status.id === statusId) || task.status
            };
            setTask(updatedTask);
            showAlert('სტატუსი წარმატებით განახლდა', 1500);
        } catch (error) {
            console.error("Error updating task status:", error);
            showAlert('სტატუსის განახლება ვერ მოხერხდა', 3000);
        }
    };
    const handleReply = async (parentId) => {
        console.log("Reply to comment:", parentId);
        //idk how to implement this xD
    };

    if (loading) {
        return <Loadingbar />;
    }

    if (!task) {
        return null;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div
            className="bg-white min-h-screen overflow-auto w-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Header />
            <motion.section
                className="mx-[120px] mt-[40px] flex flex-wrap"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="w-1/2"
                    variants={itemVariants}
                >
                    <motion.div
                        className="flex flex-col gap-7"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="flex flex-col gap-[12px] py-2.5"
                            variants={itemVariants}
                        >
                            <div className="flex gap-[18px] items-center">
                                <Priority priority={task.priority} />
                                <Department department={task.department} />
                            </div>
                            <h1
                                className="font-firaGO select-none font-bold text-[34px] text-ourBlack"
                            >
                                {task.name}
                            </h1>
                        </motion.div>
                        <motion.p
                            className="font-firaGO font-normal text-[18px] text-ourBlack"
                            variants={itemVariants}
                        >
                            {task.description}
                        </motion.p>
                    </motion.div>
                    <motion.div
                        className="mt-[63px]"
                        variants={itemVariants}
                    >
                        <h1 className="mb-[18px] font-firaGO text-2xl font-medium text-[#2A2A2A]">დავალების დეტალები</h1>
                        <div className="w-[493px] grid grid-cols-2 gap-8">
                            <div className="flex gap-1.5 items-center">
                                <img src={pieChartIcon} alt="pie chart icon" className="w-[24px] h-[24px]" />
                                <span className="font-firaGO text-base font-normal text-gray-idk">სტატუსი</span>
                            </div>
                            <CustomSelect
                                options={statuses}
                                placeholder={task.status.name}
                                onSelect={handleStatusChange}
                                value={task.status.id}
                            />
                            <div className="flex gap-1.5 items-center">
                                <img src={personIcon} alt="pie chart icon" className="w-[24px] h-[24px] mb-1" />
                                <span className="font-firaGO text-base font-normal text-gray-idk">თანამშრომელი</span>
                            </div>
                            <div className="flex gap-3 items-center">
                                <img src={task.employee.avatar} className="w-8 h-8 rounded-full" />
                                <div className="flex flex-col">
                                    <span className="font-firaGO font-light text-xs text-gray-idk">{task.employee.department.name}</span>
                                    <span className="font-firaGO font-normal text-sm text-ourBlack-gray">{task.employee.name + ' ' + task.employee.surname}</span>
                                </div>
                            </div>
                            <div className="flex gap-1.5 items-center">
                                <img src={calendarIcon} alt="pie chart icon" className="w-[24px] h-[24px]" />
                                <span className="font-firaGO text-base font-normal text-gray-idk">დავალების ვადა</span>
                            </div>
                            <div className="flex gap-1.5 items-center">
                                <span className="font-firaGO font-normal text-sm text-ourBlack-gray">{formatToGeorgianDate(task.due_date)}</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
                <motion.div
                    className="w-1/2 mt-[40px] bg-[#F8F3FEA6] border-[0.3px] border-[#DDD2FF] rounded-[10px] px-11 py-10 flex flex-col"
                    variants={itemVariants}
                >
                    <motion.div
                        className="w-full mb-6"
                        variants={itemVariants}
                    >
                        <form onSubmit={handleSubmitComment} className="relative">
                            <textarea
                                placeholder="დაწერე კომენტარი"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="w-full px-4 py-6 rounded-lg border border-[#ADB5BD] min-h-[135px] h-auto bg-white font-firaGO text-sm focus:outline-none focus:border-purple-500 resize-none"
                            />
                            <motion.button
                                type="submit"
                                className="absolute right-3 bottom-3 bg-purple-600 text-white font-firaGO text-sm px-6 py-2 rounded-full hover:bg-purple-700 transition"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                დაკომენტარება
                            </motion.button>
                        </form>
                    </motion.div>

                    <motion.div
                        className="flex items-center mb-6"
                        variants={itemVariants}
                    >
                        <h2 className="font-firaGO text-lg font-medium">კომენტარები</h2>
                        <div className="ml-2 bg-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                            {comments.length}
                        </div>
                    </motion.div>

                    <motion.div
                        className="space-y-6 overflow-y-auto max-h-[500px] pr-2"
                        variants={containerVariants}
                    >
                        {comments.map((comment, index) => (
                            <motion.div
                                key={comment.id}
                                className="mb-6"
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-start mb-2">
                                    <img
                                        src={comment.author_avatar}
                                        alt={comment.author_nickname}
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div className="flex flex-col w-full">
                                        <h3 className="font-firaGO font-medium text-base text-ourBlack">
                                            {comment.author_nickname}
                                        </h3>
                                        <p className="font-firaGO text-sm text-ourBlack-gray mt-1 mb-2">
                                            {comment.text}
                                        </p>
                                        <motion.button
                                            onClick={() => handleReply(comment.id)}
                                            className="text-purple-600 font-firaGO text-xs flex items-center w-fit"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                                />
                                            </svg>
                                            უპასუხე
                                        </motion.button>
                                    </div>
                                </div>

                                {comment.sub_comments && comment.sub_comments.length > 0 && (
                                    <motion.div
                                        className="ml-12 space-y-4"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                    >
                                        {comment.sub_comments.map((subComment, subIndex) => (
                                            <motion.div
                                                key={subComment.id}
                                                className="flex items-start"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: subIndex * 0.1 }}
                                            >
                                                <img
                                                    src={subComment.author_avatar}
                                                    alt={subComment.author_nickname}
                                                    className="w-8 h-8 rounded-full mr-3"
                                                />
                                                <div className="flex flex-col">
                                                    <h3 className="font-firaGO font-medium text-sm text-ourBlack">
                                                        {subComment.author_nickname}
                                                    </h3>
                                                    <p className="font-firaGO text-sm text-ourBlack-gray mt-1">
                                                        {subComment.text}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.section>
        </motion.div>
    );
};

export default TaskInnerPage;