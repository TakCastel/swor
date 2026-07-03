import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'era-yellow';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'bg-white text-black hover:bg-zinc-200 shadow-lg',
            secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
            outline: 'bg-transparent border border-white/20 text-white hover:bg-white/5',
            ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5',
            danger: 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white',
            'era-yellow': 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20',
        };

        const sizes = {
            sm: 'h-9 px-4 text-xs',
            md: 'h-11 px-6 text-sm',
            lg: 'h-12 px-8 text-base',
            icon: 'h-10 w-10 flex items-center justify-center',
        };

        return (
            <button
                className={cn(
                    'inline-flex items-center justify-center rounded-full font-bold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50 gap-2',
                    variants[variant],
                    sizes[size],
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = 'Button';

export { Button };
