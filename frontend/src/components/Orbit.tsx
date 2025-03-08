import { twMerge } from 'tailwind-merge';
import { HTMLAttributes } from 'react';

export const Orbit = (props: HTMLAttributes<HTMLDivElement>) => {
    return ( 
        <div className={twMerge(
            "size-[200px] border border-gray-200/30 rounded-full", props.className)}>

        </div>

    )
};