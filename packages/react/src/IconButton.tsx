import { forwardRef } from 'react';

type IconButtonProps = JSX.IntrinsicElements['button'] & {
  /** if button is in disabled state */
  disabled?: boolean;
  /** loading state */
  loading?: boolean;
  /** Aria title should be mandatory for icon buttons */
  'aria-label'?: string;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ disabled, loading, children, ...rest }, ref) => {
    return (
      <button ref={ref} {...rest} disabled={disabled || loading}>
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'Button';

export { IconButton };
