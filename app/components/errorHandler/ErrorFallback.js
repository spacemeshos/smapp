// @flow
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  max-height: 100vh;
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #c00;
  background-color: '#FFF';
  box-sizing: border-box;
`;

const Inner = styled.div``;

type Props = {
  componentStack: string,
  error: Error
};

const toErrorString = (error: Error, componentStack: string): string => {
  return `${error.toString()}\n\nThis is located at:${componentStack}`;
};

const ErrorFallback = ({ componentStack, error }: Props) => (
  <Wrapper>
    <Inner>{toErrorString(error, componentStack)}</Inner>
  </Wrapper>
);

export default ErrorFallback;
