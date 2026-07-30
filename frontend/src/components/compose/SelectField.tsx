import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement>;

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`
          border-none
          text-sm
          text-gray-900
          outline-none
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
    );
  },
);

SelectField.displayName = "SelectField";

export default SelectField;
