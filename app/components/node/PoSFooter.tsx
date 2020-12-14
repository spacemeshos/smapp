import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Link, Button } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';

const Footer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 25px;
`;

const ButtonWrap = styled.div`
  display: flex;
  width: 250px;
  justify-content: flex-end;
  flex-direction: row;
`;

type Props = {
  action: () => void;
  isDisabled: boolean;
  isLastMode?: boolean;
  isFirstMode?: boolean;
  skipAction: () => void;
};

class PoSFooter extends PureComponent<Props> {
  render() {
    const { action, isDisabled, isLastMode, isFirstMode, skipAction } = this.props;
    return (
      <Footer>
        <Link onClick={this.navigateToExplanation} text="POST SETUP GUIDE" />
        <ButtonWrap>
          {isFirstMode && <Button isPrimary={false} onClick={skipAction} text={'SKIP'} />}
          <Button style={{ marginLeft: '20px' }} onClick={action} text={isLastMode ? 'CREATE DATA' : 'NEXT'} isDisabled={isDisabled} />
        </ButtonWrap>
      </Footer>
    );
  }

  navigateToExplanation = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/guide/setup' });
}

export default PoSFooter;
