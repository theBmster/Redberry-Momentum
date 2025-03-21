import DropdownIcon from '@/assets/icons/DropdownIcon';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomSelector = ({
    label = '',
    required = true,
    options = [],
    onSelect,
    placeholder = "აირჩიე",
    addOption = null,
    onAddOption = null,
    value = null,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const selectedOption = options.length > 0 && value !== null
        ? options.find(option => option.id === value) || null
        : null;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        if (onSelect && typeof onSelect === 'function') {
            onSelect(option.id);
        }
        setIsOpen(false);
    };

    // Dropdown animation variants
    const dropdownVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: {
                type: "tween",
                duration: 0.2
            }
        },
        visible: {
            opacity: 1,
            height: "auto",
            transition: {
                type: "tween",
                duration: 0.3
            }
        }
    };

    return (
        <div className="relative w-full" ref={selectRef}>
            {label && (
                <label className="font-firaGO font-semibold text-[14px] text-gray-dark mb-2 block">
                    {label}
                    {required && <span>*</span>}
                </label>
            )}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 text-left border ${isOpen ? 'rounded-t-md border-purple border-b-0' : 'rounded-md border-gray'
                    } bg-white focus:outline-none focus:border-purple ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                    } flex items-center justify-between`}
                disabled={disabled}
            >
                <span className="font-firaGO text-sm font-normal leading-[16.8px] h-full text-[#021526]">
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <span className="pointer-events-none">
                    <DropdownIcon isOpen={isOpen} color={isOpen ? '#8338EC' : '#343A40'} />
                </span>
            </button>

            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                        className="absolute z-10 w-full overflow-hidden border border-purple border-t-0 rounded-b-md bg-white shadow-lg"
                    >
                        <div className="max-h-60 overflow-auto">
                            <ul>
                                {addOption && (
                                    <motion.li
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="px-4 py-3 gap-2 text-sm text-gray-700 border-b border-gray-200 cursor-pointer hover:bg-gray-100 flex items-center"
                                        onClick={() => {
                                            if (onAddOption && typeof onAddOption === 'function') {
                                                onAddOption();
                                            }
                                            setIsOpen(false);
                                        }}
                                    >
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="#2D3648" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M11 7V15" stroke="#2D3648" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M7 11H15" stroke="#2D3648" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {addOption}
                                    </motion.li>
                                )}
                                {Array.isArray(options) && options.length > 0 ? (
                                    options.map((option, index) => (
                                        <motion.li
                                            key={option.id}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + index * 0.03 }}
                                            className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSelect(option)}
                                        >

                                            {option.name}
                                        </motion.li>
                                    ))
                                ) : (
                                    <motion.li
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="px-4 py-3 text-sm text-gray-500"
                                    >
                                        არ არის ვარიანტები
                                    </motion.li>
                                )}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomSelector;