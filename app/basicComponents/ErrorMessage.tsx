import styled from 'styled-components';
import { smColors } from '../vars';

export default styled.span<{ align: 'left' | 'right'; oneLine: boolean }>`
  display: block;
  text-transform: uppercase;
  font-size: 14px;
  line-height: 18px;
  color: ${smColors.red};
  display: -webkit-box;
  overflow: hidden;
  text-align: ${({ align = 'left' }) => align};
  ${({ oneLine = true }) => oneLine && `-webkit-line-clamp: 1; -webkit-box-orient: vertical;`}
`;
