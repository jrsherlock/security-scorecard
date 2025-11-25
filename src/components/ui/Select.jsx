import React from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

export const Select = ({ className, value, onChange, options, label, ...props }) => {
    return (
        <div className="relative">
            {label && <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>}
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    className={cn(
                        "w-full appearance-none bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer",
                        className
                    )}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
        </div>
    );
};
