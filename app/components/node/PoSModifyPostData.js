// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Tooltip, Button } from '/basicComponents';
import { tooltip } from '/assets/images';
import { smColors } from '/vars';

// const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-around;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  &:first-child {
    margin-bottom: 10px;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

const Text = styled.div`
  font-size: 15px;
  line-height: 17px;
  color: ${smColors.black};
`;

const TooltipIcon = styled.img`
  width: 13px;
  height: 13px;
`;

const CustomTooltip = styled(Tooltip)`
  top: -2px;
  left: -3px;
  width: 200px;
  background-color: ${smColors.disabledGray};
  border: 1px solid ${smColors.realBlack};
`;

const TooltipWrapper = styled.div`
  position: relative;
  margin-left: 5px;
  &:hover ${CustomTooltip} {
    display: block;
  }
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin: 0 5px;
  font-size: 15px;
  line-height: 17px;
  color: ${smColors.black};
`;

type Props = {
  modify: () => void,
  deleteData: () => void
};

class PoSModifyPostData extends PureComponent<Props> {
  render() {
    const { modify, deleteData } = this.props;
    return (
      <>
        <Wrapper>
          <Row>
            <Text>Change your PoS data</Text>
            <TooltipWrapper>
              <TooltipIcon src={tooltip} />
              <CustomTooltip text="Some text" />
            </TooltipWrapper>
            <Dots>.....................................................</Dots>
            <Button onClick={modify} text="MODIFY POS" isPrimary={false} />
          </Row>
          <Row>
            <Text>Stop smeshing and delete PoS data</Text>
            <TooltipWrapper>
              <TooltipIcon src={tooltip} />
              <CustomTooltip text="Some text" />
            </TooltipWrapper>
            <Dots>.....................................................</Dots>
            <Button onClick={deleteData} text="DELETE DATA" isPrimary={false} />
          </Row>
        </Wrapper>
      </>
    );
  }
}

export default PoSModifyPostData;
