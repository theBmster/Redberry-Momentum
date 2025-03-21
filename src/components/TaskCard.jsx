import React from 'react';
import { useNavigate } from 'react-router-dom';
import Priority from './Priority';
import Department from './Departments';
import { formatDate } from '@/hooks/formatDate';
import commentIcon from '@/assets/img/Comments.svg';

const TaskCard = ({ task, color }) => {
    const navigate = useNavigate()
    return (
        <div onClick={() => navigate(`/task/${task.id}`, {
            state: {
                taskId: task.id
            }
        })} className={`flex h-full cursor-pointer hover:shadow-xl transition-all duration-200 delay-75 bg-white select-none flex-col rounded-2xl font-firaGO border-[1px] p-5 w-full gap-[28px]`} style={{ borderColor: color }}>

            <div className="flex justify-between items-center">
                <div className='flex gap-2.5'>
                    <Priority priority={task.priority} color={color} />
                    <Department department={task.department} />
                </div>
                <span className="text-xs text-ourBlack">{formatDate(task.due_date)}</span>
            </div>

            <div className='flex flex-col gap-3'>
                <h3 className="font-bold text-[15px] text-ourBlack">{task.name}</h3>
                <p className="text-sm font-normal text-ourBlack-light">
                    {task.description && (task.description.length > 100 ? `${task.description.substring(0, 100)}...` : task.description)}
                </p>
            </div>

            <div className='flex items-center justify-between'>
                <div>
                    <img src={task.employee.avatar} className='rounded-full w-[31px] h-[31px]' alt="avatar" />
                </div>
                <div className='flex gap-1'>
                    <img src={commentIcon} alt="coment icon" />
                    <span className='text-ourBlack text-sm font-normal'>{task.total_comments}</span>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;