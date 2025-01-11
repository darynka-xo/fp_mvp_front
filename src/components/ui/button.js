import React from "react";

const Button = React.forwardRef(
    ({ className = "", variant = "default", size = "default", ...props }, ref) => {
        const baseStyles =
            "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors " +
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
            "disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

        // Hardcode #acdc04 for default variant
        const variants = {
            default:
                "bg-[#acdc04] text-black hover:bg-[#acdc04]/90",
            outline:
                "border border-[#acdc04] text-[#acdc04] hover:bg-[#acdc04]/10 hover:text-black",
            ghost:
                "hover:bg-[#acdc04]/10 hover:text-[#acdc04]",
        };

        const sizes = {
            default: "h-10 py-2 px-4",
            sm: "h-9 px-3 rounded-md",
            lg: "h-11 px-8 rounded-md",
            icon: "h-10 w-10",
        };

        return (
            <button
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                ref={ref}
                {...props}
            />
        );
    }
);

export { Button };