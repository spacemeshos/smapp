import styled from 'styled-components';
import { smColors } from '../vars';

interface ErrorMessageProps {
  align: 'left' | 'right';
  oneLine: boolean;
}

const ErrorMessage = styled.span<ErrorMessageProps>`
  display: block;
  text-transform: uppercase;
  font-size: 14px;
  line-height: 18px;
  color: ${smColors.red};
  display: -webkit-box;
  overflow: hidden;
  text-align: ${({ align }) => align};
  ${({ oneLine }) =>
    oneLine && `-webkit-line-clamp: 1; -webkit-box-orient: vertical;`}
`;

ErrorMessage.defaultProps = {
  align: 'left',
  oneLine: true,
};

export default ErrorMessage;
