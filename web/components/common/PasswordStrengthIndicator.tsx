import classNames from 'classnames';
interface PasswordStrengthIndicatorProps {
  passwordStrength: number;
  errors: any;
}
export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ passwordStrength, errors }) => {
  return (
    <div className="w-full mt-3 flex flex-col items-center justify-center">
      <progress
        className={classNames('progress w-56', {
          'progress-error': passwordStrength <= 25,
          'progress-warning': passwordStrength > 25 && passwordStrength < 100,
          'progress-success': passwordStrength === 100,
        })}
        value={passwordStrength}
        max="100"
      ></progress>
      <div className="w-full flex items-center justify-center">
        {passwordStrength <= 25 && (
          <>
            {errors.password && <span className="text-sm text-center text-error mt-1">{errors.password.message}</span>}
          </>
        )}
        {passwordStrength > 25 && passwordStrength < 100 && (
          <>
            {errors.password && (
              <span className="text-sm text-center text-warning mt-1">{errors.password.message}</span>
            )}
          </>
        )}
        {passwordStrength === 100 && <span className="text-sm text-center text-success mt-1">Password is strong</span>}
      </div>
    </div>
  );
};
