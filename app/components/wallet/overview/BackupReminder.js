// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { shieldIconGreen, shieldIconWhite, arrowRightWhite } from '/assets/images';
import { smColors } from '/vars';

// $FlowStyledIssue
const Wrapper = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
  background-color: ${({ hasBackup }) => (hasBackup ? smColors.white : smColors.red)};
  cursor: pointer;
`;

const ShieldIcon = styled.img`
  width: 23px;
  height: 28px;
  margin-right: 15px;
  cursor: inherit;
`;

// $FlowStyledIssue
const Text = styled.div`
  font-size: 15px;
  line-height: 20px;
  font-weight: ${({ hasBackup }) => (hasBackup ? 'normal' : 'bold')};
  color: ${({ hasBackup }) => (hasBackup ? smColors.darkGray : smColors.white)};
  cursor: inherit;
`;

const ArrowRight = styled.img`
  width: 19px;
  height: 18px;
  margin-left: auto;
`;

type Props = {
  hasBackup: boolean,
  style: Object
};

class BackupReminder extends PureComponent<Props> {
  render() {
    const { hasBackup, style } = this.props;
    return (
      <Wrapper hasBackup={hasBackup} style={style}>
        <ShieldIcon src={hasBackup ? shieldIconGreen : shieldIconWhite} />
        <Text hasBackup={hasBackup}>{this.getText()}</Text>
        {!hasBackup && <ArrowRight src={arrowRightWhite} />}
      </Wrapper>
    );
  }

  getText = () => {
    const { hasBackup } = this.props;
    return hasBackup ? 'You have successfully backed up your wallet.' : 'Need to backup your wallet';
  };
}

export default BackupReminder;
