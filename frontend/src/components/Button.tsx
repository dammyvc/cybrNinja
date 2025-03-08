import { HTMLAttributes } from "react";
import { cva } from "cva"

export type ButtonProps = {
    variant?: "primary" | "secondary" | "tertiary"; 
    block?: boolean;} 
    & HTMLAttributes<HTMLButtonElement>

const classes = cva("text-xs tracking-widest uppercase font-bold h-10 px-6 rounded-lg", {
    variants: {
        block: {
            true: "w-full",
        },
        
        variant: {
            primary: 'bg-primary hover:bg-secondary',
            secondary: '',
            tertiary: "border border-secondary text-gray-200 hover:bg-accent hover:border-none",
        },

    },

    defaultVariants: {
        variant: "primary",
        block: false,
    },
});

export const Button = (props: ButtonProps) => {
    const {className = "", children, ...otherProps} = props
    return (
        <button className={classes({...otherProps, className})}>{children}

        </button>
    );
};