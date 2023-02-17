import React from 'react';
import styled from 'styled-components';

type Props = {
  secondary?: boolean;
  onClick: (value: string) => void;
  children?: JSX.Element;
  hideCopyIcon?: boolean;
  value: string;
};

const Wrapper = styled.div`
  display: flex;
`;

const CopyIcon = styled.img.attrs<{ secondary?: boolean }>(
  ({ theme: { icons }, secondary }) => ({
    src: secondary ? icons.copySecondary : icons.copy,
  })
)<{ secondary?: boolean }>`
  align-self: center;
  width: 16px;
  height: 15px;
  margin: 0 3px;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
  &:active {
    transform: translate3d(2px, 2px, 0);
  }
`;

const CopyButton = ({
  secondary,
  children,
  hideCopyIcon,
  value,
  onClick,
}: Props) => {
  let t: NodeJS.Timeout | number = 0;
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();

    await navigator.clipboard.writeText(value);
    onClick(value);
    t && clearTimeout(t as NodeJS.Timeout);
    t = setTimeout(() => onClick(''), 3000);
  };

  return (
    <Wrapper onClick={handleCopy}>
      {children}
      {!hideCopyIcon && <CopyIcon secondary={secondary} />}
    </Wrapper>
  );
};

export default CopyButton;
