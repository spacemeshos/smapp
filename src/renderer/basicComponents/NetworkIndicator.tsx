import styled from 'styled-components';

type Props = {
  color: string;
};

const NetworkIndicator = styled.div`
  width: 10px;
  height: 10px;
  margin-right: 5px;
  border-radius: 50%;
  background-color: ${({ color }: Props) => color};
`;

export default NetworkIndicator;
