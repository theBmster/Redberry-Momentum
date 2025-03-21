import { useAPI } from "@/contexts/APIProvider";
import Header from "@/components/Header";
import { motion } from 'framer-motion';
import FilterBar from "@/components/FilterBar";
import TaskRow from "@/components/TaskRow";
import { useFilter } from "@/contexts/FilterProvider";
import Button from "@/components/Button";
import Loadingbar from "@/components/Loadingbar";
import { useEffect } from "react";

const TaskPage = () => {
    const { statuses, departments, priorities, loading, fetchData } = useAPI();
    const { filteredTasks, hasFilters, clearAllFilters } = useFilter();
    useEffect(() => {
        fetchData()
    }, [])
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.4
            }
        }
    };

    if (loading) {
        return (
            <div className="select-none bg-white min-h-screen">
                <Header />
                <Loadingbar />
            </div>
        );
    }

    return (
        <div className="select-none bg-white min-h-screen">
            <Header />
            <section className="w-full mx-[120px]">
                <motion.h1
                    className="font-firaGO select-none font-bold text-[34px] text-ourBlack mt-[40px] mb-[52px]"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    დავალებების გვერდი
                </motion.h1>
                <FilterBar />
                <motion.div
                    className="flex gap-[54px]"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {statuses.map((status, index) => (
                        <motion.div key={status.id} variants={itemVariants}>
                            <TaskRow status={status} />
                        </motion.div>
                    ))}
                </motion.div>
            </section>
            {filteredTasks.length == 0 && !loading && (
                <motion.div
                    className="w-full h-full flex flex-col gap-4 mt-20 items-center justify-center"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-2xl font-fredokaOne font-bold"> დავალებება ვერ მოიძებნა </h1>
                    {hasFilters && (
                        <Button text='ფილტრების გასუფთავება' solid={false} onClick={() => clearAllFilters()} />
                    )}
                </motion.div>
            )}
        </div>
    );
}

export default TaskPage;