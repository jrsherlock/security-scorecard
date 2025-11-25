import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ className, children, ...props }) => {
    return (
        <div
            className={cn(
                "bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ className, children, ...props }) => {
    return (
        <div className={cn("p-6 pb-3", className)} {...props}>
            {children}
        </div>
    );
};

export const CardTitle = ({ className, children, ...props }) => {
    return (
        <h3 className={cn("text-lg font-semibold text-slate-100", className)} {...props}>
            {children}
        </h3>
    );
};

export const CardContent = ({ className, children, ...props }) => {
    return (
        <div className={cn("p-6 pt-3", className)} {...props}>
            {children}
        </div>
    );
};
