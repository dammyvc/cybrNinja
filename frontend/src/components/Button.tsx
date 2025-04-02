import { HTMLAttributes } from "react";
import { cva } from "class-variance-authority";

export type ButtonProps = {
    variant?: "primary" | "secondary" | "destructive";
    block?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

const classes = cva("text-xs tracking-widest uppercase font-bold h-10 px-6 rounded-full", {
    variants: {
        block: {
            true: "w-full",
        },
        variant: {
            primary: 'px-8 py-2 bg-gradient-to-b from-secondary to-accent text-white focus:ring-2 focus:ring-blue-400 hover:shadow-lg transition duration-200',
            secondary: 'border border-secondary text-gray-950 dark:text-gray-200 hover:shadow-lg transition duration-200',
            destructive: "bg-red-500 hover:bg-red-600 text-white",
        },
    },
    defaultVariants: {
        variant: "primary",
        block: false,
    },
});

export const Button = (props: ButtonProps) => {
    const { variant, block, className = "", children, ...otherProps } = props;
    return (
        <button
            className={classes({ variant, block, className })}
            {...otherProps} 
        >
            {children}
        </button>
    );
};