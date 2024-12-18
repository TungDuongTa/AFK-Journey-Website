import React from "react";

interface ButtonProps {
  title: string;
  id?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  containerClass?: string;
  href?: string;
}

export default function Button({
  title,
  id,
  rightIcon,
  leftIcon,
  containerClass = "",
  href,
}: ButtonProps) {
  const commonClasses = `group relative z-10 w-fit cursor-pointer overflow-hidden rounded-xl px-6 py-3 text-black ${containerClass}  transition-all duration-300`;

  if (href) {
    // Render as anchor if href is provided
    return (
      <a id={id} href={href} className={commonClasses} target="_blank">
        {leftIcon}
        <span className="relative inline-flex overflow-hidden font-general text-xs  ">
          <div>{title}</div>
        </span>
        {rightIcon}
      </a>
    );
  }

  // Render as button otherwise
  return (
    <button id={id} className={commonClasses}>
      {leftIcon}
      <span className="relative inline-flex overflow-hidden font-general text-xs">
        <div>{title}</div>
      </span>
      {rightIcon}
    </button>
  );
}
