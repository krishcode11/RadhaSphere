import clsx from "clsx";
import { forwardRef } from "react";

const Button = forwardRef(({ id, title, rightIcon, leftIcon, containerClass, onClick, disabled }, ref) => {
  return (
    <button
      id={id}
      ref={ref}
      className={clsx(
        "group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-violet-50 px-7 py-3 text-black",
        containerClass,
        disabled && "opacity-70 cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {leftIcon}

      <span className="relative inline-flex overflow-hidden font-general text-xs uppercase">
        <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
          {title}
        </div>
        <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
          {title}
        </div>
      </span>

      {rightIcon}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
