import React, { useState, useEffect, useRef } from 'react';
import Check from '@/assets/icons/Check';

const FormInputField = ({
    label = "სახელი",
    initialValue = "",
    minLength = 2,
    maxLength = 255,
    required = true,
    onChange,
    debounceTime = 100,
    allowSpaces = false  // New property to control space handling
}) => {
    const [value, setValue] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState(initialValue);
    const isFirstRender = useRef(true);

    const isValid = debouncedValue.length >= minLength &&
        debouncedValue.length <= maxLength &&
        (!required || debouncedValue.trim() !== '');

    const handleInputChange = (e) => {
        const inputValue = e.target.value;

        if (allowSpaces) {
            // If spaces are allowed, use the input value directly
            setValue(inputValue);
        } else {
            // If spaces are not allowed, apply the regex to remove non-letter characters
            const trimmedValue = inputValue.trim();
            const charactersOnly = trimmedValue.replace(/[^\p{L}]/gu, '');
            setValue(charactersOnly);
        }
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, debounceTime);

        return () => {
            clearTimeout(handler);
        };
    }, [value, debounceTime]);

    useEffect(() => {
        if (isFirstRender.current) {
            return;
        }

        if (onChange) {
            onChange(debouncedValue, isValid);
        }
    }, [debouncedValue, isValid]);

    return (
        <div className='w-full'>
            <div className='mb-1'>
                {label && (
                    <label className="font-firaGO font-semibold text-[14px] text-gray-dark block">
                        {label}
                        {required && <span>*</span>}
                    </label>
                )}
            </div>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                className={`bg-white w-full h-[42px] outline-0 p-2.5 border-[1px] rounded-md mb-1.5 ${debouncedValue && !isValid ? 'border-red' : 'border-gray'}`}
            />
            <div>
                <div className="flex items-center gap-0.5">
                    <Check color={debouncedValue === "" ? "#6C757D" : (isValid ? "#08A508" : "#FA4D4D")} />
                    <span className={`font-firaGo text-xs ${debouncedValue === '' ? 'text-gray-light' : (isValid ? 'text-green' : 'text-red')}`}>მინიმუმ {minLength} სიმბოლო</span>
                </div>
                <div className="flex items-center gap-0.5">
                    <Check color={debouncedValue === "" ? "#6C757D" : (isValid ? "#08A508" : "#FA4D4D")} />
                    <span className={`font-firaGo text-xs ${debouncedValue === '' ? 'text-gray-light' : (isValid ? 'text-green' : 'text-red')}`}>მაქსიმუმ {maxLength} სიმბოლო</span>
                </div>
            </div>
        </div>
    );
};

export default FormInputField;