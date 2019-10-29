import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { CorneredWrapper } from '/basicComponents';
import { smColors } from '/vars';

const Wrapper = styled(CorneredWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  padding: 20px;
  background-color: ${smColors.lightGray};
`;

const Header = styled.div`
  font-size: 32px;
  line-height: 40px;
  color: ${smColors.realBlack};
`;

const SubHeader = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
`;

type Props = {
  children: any,
  width: number,
  height: number,
  header: string,
  subHeader?: string
};

class CorneredContainer extends PureComponent<Props> {
  render() {
    const { children, width, height, header, subHeader } = this.props;
    return (
      <Wrapper width={width} height={height}>
        <Header>{header}</Header>
        {subHeader && (
          <SubHeader>
            --
            <br />
            {subHeader}
          </SubHeader>
        )}
        {children}
      </Wrapper>
    );
  }
}

export default CorneredContainer;
