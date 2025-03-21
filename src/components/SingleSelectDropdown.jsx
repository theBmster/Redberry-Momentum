import CheckSquare from "@/assets/icons/CheckSquare";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const SingleSelectDropdown = ({ options, isOpen, onClose, onSelect, selectedOption }) => {
    const [selected, setSelected] = useState(selectedOption || null);

    useEffect(() => {
        if (selectedOption) {
            setSelected(selectedOption);
        }
    }, [selectedOption]);

    useEffect(() => {
        if (!isOpen && !selectedOption) {
            setSelected(null);
        }
    }, [isOpen, selectedOption]);

    const handleSelect = (option) => {
        if (selected && selected.id === option.id) {
            setSelected(null);
        } else {
            setSelected(option);
        }
    };

    const handleSubmit = () => {
        onSelect(selected);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="relative w-[688px] border-[1px] select-none border-purple bg-white z-50 rounded-[10px] mt-2.5 overflow-hidden"
                >
                    <div className="p-6 pt-10 flex flex-col">
                        <div className="flex flex-col flex-wrap gap-5">
                            {options && options.map(option => (
                                <motion.div
                                    key={option.id}
                                    className="flex items-center gap-[15px] cursor-pointer"
                                    onClick={() => handleSelect(option)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center gap-[15px]">
                                        <CheckSquare isChecked={selected && selected.id === option.id} />
                                        {option.avatar && (
                                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                                <img
                                                    src={option.avatar}
                                                    alt={`${option.name} ${option.surname || ''}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <span className="text-base">
                                            {option.name} {option.surname || ''}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                            {options.length == 0 && (
                                <h1 className="font-firaGo text-lg text-center font-bold">შექმენით თანამშრომელი</h1>
                            )}
                        </div>
                        <motion.button
                            className={`self-end w-[155px] h-[35px] text-white rounded-[20px] mt-6 ${selected ? 'bg-purple hover:bg-purple-light' : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            onClick={handleSubmit}
                            whileHover={selected ? { scale: 1.05 } : {}}
                            whileTap={selected ? { scale: 0.95 } : {}}
                            disabled={!selected}
                        >
                            არჩევა
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SingleSelectDropdown;