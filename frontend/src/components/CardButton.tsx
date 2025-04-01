"use client";

import { ButtonHTMLAttributes } from "react";
import { cva } from "cva";

export type ButtonProps = {
    variant?: "primary" | "secondary" | "disabled";
    block?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const classes = cva("text-xs tracking-widest uppercase font-bold h-10 px-6 rounded-xl", {
    variants: {
        block: {
            true: "w-full",
        },
        variant: {
            primary:
                "px-8 py-2 bg-gradient-to-b from-secondary to-accent text-white focus:ring-2 focus:ring-blue-400 hover:shadow-lg transition duration-200",
            secondary:
                "border border-secondary text-gray-950 dark:text-gray-200 hover:shadow-lg transition duration-200",
            disabled: "bg-gray-500 text-gray-300 cursor-not-allowed",
        },
    },
    defaultVariants: {
        variant: "primary",
        block: false,
    },
});

export const CardButton = (props: ButtonProps) => {
    const { className = "", children, ...otherProps } = props;
    return (
        <button
            className={classes({ variant: otherProps.variant, block: otherProps.block, className })}
            {...otherProps}
        >
            {children}
        </button>
    );
};