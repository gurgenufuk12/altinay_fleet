import React from "react";

interface Props {
  children?: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  className: string;
  disabled?: boolean;
  id?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<Props> = ({
  children,
  onClick,
  title,
  className,
  disabled,
  id,
  type = "button",
}) => {
  return (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
      id={id}
      type={type}
    >
      <div className="flex flex-row justify-center gap-2">
        {title}
        {children}
      </div>
    </button>
  );
};

export default Button;
