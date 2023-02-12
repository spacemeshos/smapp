import styled from 'styled-components';

export default styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme: { color } }) => color.primary};
  flex: 0.2;
  margin-bottom: 1em;
`;
