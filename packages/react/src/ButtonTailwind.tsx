import { forwardRef } from 'react';

export interface ButtonProps extends React.ComponentProps<'button'> {
  /** If button is in disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
}

const TailwindButton = forwardRef<HTMLButtonElement, ButtonProps>(({ disabled, loading, ...rest }, ref) => {
  return (
    <button
      className={`
      renato1010-bg-primary-500 hover:renato1010-bg-primary-700
      active:renato1010-bg-primary-800 renato1010-text-neutral-white
      renato1010-py-8 renato1010-px-[20px] renato1010-rounded-large
        `}
      {...rest}
      ref={ref}
      disabled={disabled || loading}
    />
  );
});

TailwindButton.displayName = 'ButtonTailwind';

export { TailwindButton };
