import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';

export const EditableText = ({
    value,
    onChange,
    className,
    placeholder = "Enter title...",
    tag: Tag = 'div'
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef(null);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleBlur = () => {
        setIsEditing(false);
        if (tempValue.trim() !== '') {
            onChange(tempValue);
        } else {
            setTempValue(value); // Revert if empty
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleBlur();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setTempValue(value);
        }
    };

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={cn(
                    "bg-slate-800 text-slate-100 border border-blue-500 rounded px-1 outline-none w-full min-w-[100px]",
                    className
                )}
                placeholder={placeholder}
            />
        );
    }

    return (
        <Tag
            onClick={() => setIsEditing(true)}
            className={cn(
                "cursor-pointer hover:bg-slate-800/50 hover:ring-1 hover:ring-slate-700 rounded px-1 -mx-1 transition-all truncate",
                className
            )}
            title="Click to edit"
        >
            {value}
        </Tag>
    );
};
