import React from 'react';
import styled, { css } from 'styled-components';

// Props
type Props = {
  disabled?: boolean;
  color?: 'primary' | 'secondary';
  transparent?: 'primary' | 'secondary';
  block?: boolean;
  tag?: React.ElementType;
  innerRef?: React.Ref<HTMLElement>;
  [key: string]: any;
};

// Component logic
function AbstractButton(props: Props) {
  function onClick(e: any) {
    if (props.disabled) {
      e.preventDefault();
      return;
    }

    if (props.onClick) {
      return props.onClick(e);
    }
  }

  let {
    color,
    transparent,
    block,
    tag: Tag = 'button',
    innerRef,
    ...attrs
  } = props;

  if (attrs.href && Tag === 'button') {
    Tag = 'a';
  }

  return (
    <Tag
      type={Tag === 'button' && attrs.onClick ? 'button' : undefined}
      {...attrs}
      ref={innerRef}
      onClick={onClick}
    />
  );
}
// Extending => A new component based on AbstractButton
const Button = styled(AbstractButton)<Props>`
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 6px 24px;
  font-size: 1rem;
  border-radius: 2px;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out;

  
/* For Disable */
${({ disabled }) => {
  if (disabled) {
    return css`
      &:disabled,
      && {
        pointer-events: none;
        opacity: 0.65;
      }
    `;
  }
}}

  /* For Block */
  ${props => {
    if (props.block) {
      return css`
        & {
          display: block;
          width: 100%;
        }
      `;
    }
  }}

    /* For Color */
    ${({ color }) => {
      if (color === 'primary') {
        return css`
          & {
            color: #fff;
            background-color: #2d62ed;
            border-color: #2d62ed;
          }

          &:hover {
            color: #fff;
            background-color: #578bfa;
            border-color: #578bfa;
          }

          &:focus {
            color: #fff;
            background-color: #578bfa;
            border-color: #578bfa;
          }

          &:active {
            color: #fff;
            background-color: #1c47c7;
            border-color: #1c47c7;
          }

          /*
      &:active:focus {
        box-shadow: 0 0 0 0.25rem rgba(49, 132, 253, 0.5);
      }
      
      &:disabled {
        color: #fff;
        background-color: #0d6efd;
        border-color: #0d6efd;
      }*/
        `;
      } else if (color === 'secondary') {
        return css`
          & {
            color: #fff;
            background-color: #272b2f;
            border-color: #272b2f;
          }

          &:hover {
            color: #fff;
            background-color: #37393b;
            border-color: #37393b;
          }

          &:focus {
            color: #fff;
            background-color: #37393b;
            border-color: #37393b;
          }

          &:active {
            color: #fff;
            background-color: #060708;
            border-color: #060708;
          }
        `;
      }
    }}
   /* Transparent */
  ${props => {
    if (props.transparent === 'primary') {
      return css`
        & {
          color: #2d62ed;
          background-color: transparent;
          border-color: transparent;
        }

        &:hover {
          color: #578bfa;
          background-color: transparent;
          border-color: transparent;
        }
      `;
    } else if (props.transparent === 'secondary') {
      return css``;
    }
  }}
`;

export default Button;
