import styled from 'styled-components';
import { smColors } from '../vars';

export default styled.span`
  display: block;
  text-transform: uppercase;
  font-size: 14px;
  line-height: 18px;
  color: ${smColors.red};
  display: -webkit-box;
  overflow: hidden;
  ${({ oneLine = true }: { oneLine: boolean }) => oneLine && `-webkit-line-clamp: 1; -webkit-box-orient: vertical;`}
`;
