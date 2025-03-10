import { HTMLAttributes } from "react";
import { cva } from "cva"

export type ButtonProps = {
    variant?: "primary" | "secondary" | "tertiary";
    block?: boolean;
}
    & HTMLAttributes<HTMLButtonElement>

const classes = cva("text-xs tracking-widest uppercase font-bold h-10 px-6 rounded-full", {
    variants: {
        block: {
            true: "w-full",
        },

        variant: {
            primary: 'px-8 py-2 bg-gradient-to-b from-secondary to-accent text-white focus:ring-2 focus:ring-blue-400 hover:shadow-lg transition duration-200',
            secondary: 'border border-secondary text-gray-950 dark:text-gray-200 hover:shadow-lg transition duration-200',
            tertiary: "",
        },

    },

    defaultVariants: {
        variant: "primary",
        block: false,
    },
});

export const Button = (props: ButtonProps) => {
    const { className = "", children, ...otherProps } = props
    return (
        <button className={classes({...otherProps, className})}>{children}

        </button>
        


    );
};