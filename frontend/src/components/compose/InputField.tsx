import { forwardRef} from "react";
import type { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement>;

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          text-sm
          text-gray-900
          placeholder:text-gray-400
          outline-none
          ${className}
        `}
        {...props}
      />
    );
  },
);

InputField.displayName = "InputField";

export default InputField;
