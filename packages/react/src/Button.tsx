import { forwardRef } from 'react';
import styled from 'styled-components';
import { tokens } from '@renato1010/foundation';

type ButtonProps = JSX.IntrinsicElements['button'] & {
  /** Color based on the color props */
  color: keyof typeof tokens.colors;
  /** if button is in disabled state */
  disabled?: boolean;
  /** loading state */
  loading?: boolean;
};

const ButtonStyled = styled.button<ButtonProps>`
  /* Static styles */
  all: unset;
  cursor: pointer;
  padding: 8px 20px;
  &:disabled {
    opacity: 40%;
  }
  /* Inherit from design tokens */
  transition: ${tokens.animations.default.value};
  color: ${tokens.colors.neutral.white.value};
  border-radius: ${tokens.radius.large.value};
  background-color: ${(props) => tokens.colors[props.color][500].value};
  &:hover {
    background-color: ${(props) => tokens.colors[props.color][700].value};
  }
  &:active {
    background-color: ${(props) => tokens.colors[props.color][800].value};
  }
`;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled, loading, color = 'primary', ...rest }, ref) => {
    return <ButtonStyled {...rest} ref={ref} color={color} disabled={disabled || loading} />;
  }
);

Button.displayName = 'Button';

export { Button };
