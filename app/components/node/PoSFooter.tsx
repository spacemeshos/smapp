import { shell } from 'electron';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Link, Button } from '../../basicComponents';

const Footer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 25px;
`;

type Props = {
  action: () => void;
  isDisabled: boolean;
  isLastMode?: boolean;
};

class PoSFooter extends PureComponent<Props> {
  render() {
    const { action, isDisabled, isLastMode } = this.props;
    return (
      <Footer>
        <Link onClick={this.navigateToExplanation} text="POST SETUP GUIDE" />
        <Button onClick={action} text={isLastMode ? 'CREATE DATA' : 'NEXT'} isDisabled={isDisabled} />
      </Footer>
    );
  }

  navigateToExplanation = () => shell.openExternal('https://testnet.spacemesh.io/#/guide/setup');
}

export default PoSFooter;
