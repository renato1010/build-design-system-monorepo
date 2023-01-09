import { forwardRef } from 'react';

type ButtonProps = JSX.IntrinsicElements['button'] & {
  /** if button is in disabled state */
  disabled?: boolean;
  /** loading state */
  loading?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ disabled, loading, ...rest }, ref) => {
  return <button ref={ref} {...rest} disabled={disabled || loading} />;
});

Button.displayName = 'Button';

export { Button };
