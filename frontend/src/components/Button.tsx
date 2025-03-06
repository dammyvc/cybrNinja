"use client";

import * as React from "react";

interface ButtonProps {
    text: string;
    onClick?: () => void;
    className?: string; 
}

export default function Button({
    text,
    onClick,
    className = "",
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2 rounded-full text-sm font-medium tracking-widest transform hover:scale-105 hover:bg-secondary transition-colors duration-200 ${className}`}
        >
            {text}
        </button>
    );
}
