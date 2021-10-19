import styled from 'styled-components';
import { smColors } from '../vars';

export default styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
  flex: 0.2;
`;
