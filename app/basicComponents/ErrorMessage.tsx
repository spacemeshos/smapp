import styled from 'styled-components';
import { smColors } from '../vars';

interface ErrorMessageProps {
  align?: 'left' | 'right';
  compact?: boolean;
}

const ErrorMessage = styled.span<ErrorMessageProps>`
  display: block;
  text-transform: uppercase;
  font-size: 14px;
  line-height: 18px;
  color: ${smColors.red};
  display: -webkit-box;
  overflow: hidden;
  text-align: ${({ align }) => align || 'left'};
  ${({ compact }) =>
    compact && '-webkit-line-clamp: 2; -webkit-box-orient: vertical;'}
`;

ErrorMessage.defaultProps = {
  align: 'left',
  compact: false,
};

export default ErrorMessage;
