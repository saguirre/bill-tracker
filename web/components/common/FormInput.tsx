import { forwardRef } from 'react';
import { ChangeHandler } from 'react-hook-form';
import classNames from 'classnames';

export interface FormInputProps {
  id?: string;
  type?: string;
  name: string;
  value?: string;
  htmlFor?: string;
  labelText?: string;
  placeholder?: string;
  onChange?: ChangeHandler;
  onBlur?: ChangeHandler;
  min?: string | number;
  max?: string | number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  errors?: any;
}

export const FormInput: React.FC<FormInputProps> = forwardRef<HTMLInputElement, FormInputProps>(
  ({ labelText, htmlFor, errors, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-black">
          {labelText}
        </label>
        <input
          ref={ref}
          {...props}
          className={classNames(
            props.className || 'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary',
            'appearance-none block w-full px-3 py-2 border border-light-gray rounded-md shadow-sm placeholder-gray placeholder:text-sm disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />
        {errors && errors[props?.name] && <span className="text-sm text-red mt-2">{errors[props?.name]?.message}</span>}
      </div>
    );
  }
);
