import React from "react"
import { cn } from "../../lib/utils"
import { Loader2 } from "lucide-react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger"
    size?: "sm" | "md" | "lg"
    loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none gap-2",
                    {
                        "bg-indigo-600 text-white hover:bg-indigo-500": variant === "primary",
                        "bg-slate-700 text-slate-100 hover:bg-slate-600": variant === "secondary",
                        "text-slate-400 hover:text-slate-100 hover:bg-slate-800": variant === "ghost",
                        "bg-red-600 text-white hover:bg-red-500": variant === "danger",
                        "h-8 px-3 text-sm": size === "sm",
                        "h-10 px-4 py-2": size === "md",
                        "h-12 px-6 text-lg": size === "lg",
                    },
                    className
                )}
                {...props}
            >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"
