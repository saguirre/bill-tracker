import { forwardRef } from 'react';
import { ChangeHandler } from 'react-hook-form';
import classNames from 'classnames';

export interface FormInputProps {
  id?: string;
  type?: string;
  name: string;
  readOnly?: boolean;
  value?: string;
  htmlFor?: string;
  labelText?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: ChangeHandler | ((event: React.ChangeEvent<HTMLInputElement>) => void);
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
  lang?: string;
}

export const FormInput: React.FC<FormInputProps> = forwardRef<HTMLInputElement, FormInputProps>(
  ({ labelText, htmlFor, errors, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1 w-full">
        <label htmlFor={htmlFor} className="flex flex-row items-center text-sm font-semibold">
          {labelText}
          {props.required && <span className="block text-sm align-super text-secondary">*</span>}
        </label>
        <input
          ref={ref}
          {...props}
          className={classNames(
            props.className || 'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary',
            'input border-base-content input-primary focus:border-none',
            props.readOnly ? 'cursor-default focus:ring-base-content focus:ring-1' : ''
          )}
          readOnly={props.readOnly}
        />
        {errors && errors[props?.name] && (
          <span className="!mt-1 pl-1 text-sm text-error">{errors[props?.name]?.message}</span>
        )}
      </div>
    );
  }
);
