import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export const Tooltip = ({ children, content, className }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="cursor-help"
            >
                {children}
            </div>
            {isVisible && (
                <div
                    className={cn(
                        "absolute z-50 px-3 py-2 text-sm font-normal text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg",
                        "bottom-full left-1/2 -translate-x-1/2 mb-2 w-64",
                        "before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2",
                        "before:border-4 before:border-transparent before:border-t-white dark:before:border-t-slate-800",
                        className
                    )}
                >
                    {content}
                </div>
            )}
        </div>
    );
};
