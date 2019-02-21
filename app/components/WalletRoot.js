// @flow
import React, { Component } from 'react';
import SideMenu from './baseComponents/SideMenu/SideMenu';
import { Link } from 'react-router-dom';
import Fonts from '../vars/fonts';
import type { SideMenuEntry, LoadingEntry } from './baseComponents/SideMenu/SideMenu';
import SmButton from './baseComponents/SmButton/SmButton';
import SendReceiveButton from './baseComponents/SendReceiveButton/SendReceiveButton';
import SmInput from './baseComponents/SmInput/SmInput';
import SmRadioButtons from './baseComponents/SmRadioButtons/SmRadioButtons';
import type { RadioEntry } from './baseComponents/SmRadioButtons/SmRadioButtons';
import SmDropdown from './baseComponents/SmDropdown/SmDropdown';
import type { DropdownEntry } from './baseComponents/SmDropdown/SmDropdown';

type HomeProps = {};
type HomeState = {
  message: string,
  fullNodeLoading: boolean,
  disableButtons: boolean
};

export default class WalletRoot extends Component<HomeProps, HomeState> {
  props: HomeProps;

  state: HomeState = {
    message: '',
    fullNodeLoading: true,
    disableButtons: false
  };

  render() {
    const { message, fullNodeLoading, disableButtons } = this.state;
    const styles = {
      container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      mainContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        heighy: '100%'
      },
      content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignContent: 'space-between',
        width: '100%',
        ...Fonts.font1
      },
      row: {
        paddingTop: 16,
        minHeight: 54,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'space-around'
      }
    };

    const radioButtons: RadioEntry[] = [
      {
        id: 1,
        label: '1.0 GB'
      },
      {
        id: 2,
        label: '2.0 GB'
      }
    ];

    const dropdownList1: DropdownEntry[] = [
      {
        id: 1,
        label: 'When I was 17'
      },
      {
        id: 2,
        label: 'It was a very good year'
      },
      {
        id: 3,
        label: 'It was a very good year For small town girls',
        disabled: true
      },
      {
        id: 4,
        label: 'And soft summer nights'
      },
      {
        id: 5,
        label: "We'd hide from the light"
      },
      {
        id: 6,
        label: 'Under the village green'
      },
      {
        id: 7,
        label: 'When I was 17'
      }
    ];

    const dropdownList2: DropdownEntry[] = [
      {
        id: 1,
        label: 'At last my love has come along'
      },
      {
        id: 2,
        label: 'My lonely days are over'
      },
      {
        id: 3,
        label: 'and life is like a song'
      },
      {
        id: 4,
        label: 'Oh, yeah yeah... ',
        disabled: true
      },
      {
        id: 5,
        label: 'At last, the skies above are blue'
      }
    ];

    const loadingEntry: LoadingEntry = { id: 1, isLoading: fullNodeLoading };

    return (
      <div style={styles.container}>
        <SideMenu onPress={this.handleSideMenuPress} loadingEntry={loadingEntry} />
        <div style={styles.mainContent}>
          <div style={styles.content}>
            <div style={styles.row}>
              <span>{message}</span>
            </div>
            <div style={styles.row}>
              <SmInput onChangeText={this.handleChangeText} disabled={disableButtons} />
              <SmRadioButtons data={radioButtons} onPress={this.handleRadioSelect} disabled={disableButtons} />
              <SmDropdown disabled={disableButtons} data={dropdownList1} onPress={(e: DropdownEntry) => this.handleDropdownSelection(e)} />
              <SmDropdown disabled={disableButtons} data={dropdownList2} onPress={(e: DropdownEntry) => this.handleDropdownSelection(e)} />
            </div>
            <div style={styles.row}>
              <SendReceiveButton disabled={disableButtons} title="Send coins" onPress={() => this.handleSendReceiveButtonPress('send')} />
              <SendReceiveButton disabled={disableButtons} title="Receive coins" onPress={() => this.handleSendReceiveButtonPress('receive')} />
            </div>
            <div style={styles.row}>
              <SmButton title="Toggle Node Loading" theme="green" disabled={disableButtons} onPress={() => this.handleButtonPress('toggleNodeLoading')} />
              <SmButton title="test" theme="green" disabled={disableButtons} onPress={() => this.handleButtonPress('green')} />
              <SmButton title="test" theme="orange" disabled={disableButtons} onPress={() => this.handleButtonPress('orange')} />
              <SmButton title={disableButtons ? 'enable' : 'disable'} theme="green" onPress={() => this.handleButtonPress(disableButtons ? 'enable' : 'disable')} />
            </div>
            <div style={styles.row}>
              <Link to="/">Back</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        fullNodeLoading: false
      });
    }, 6000);
  }

  handleSideMenuPress = (selection: SideMenuEntry) => {
    this.setState({
      message: `Selected[ ${selection.id} ]: ${selection.label}`
    });
  };

  handleButtonPress = (val: string) => {
    const { disableButtons } = this.state;
    const disable = val === 'disable' && !disableButtons;
    this.setState((prevState) => {
      let isFullNodeLoading = prevState.fullNodeLoading;
      if (val === 'toggleNodeLoading') {
        isFullNodeLoading = !isFullNodeLoading;
      }
      return {
        message: `Pressed ${val} button`,
        disableButtons: disable,
        fullNodeLoading: isFullNodeLoading
      };
    });
  };

  handleSendReceiveButtonPress = (val: string) => {
    this.setState({
      message: `Pressed ${val} button`
    });
  };

  handleChangeText = (val: string) => {
    this.setState({
      message: `Typed: ${val}`
    });
  };

  handleRadioSelect = (selection: RadioEntry) => {
    this.setState({
      message: `Radio[${selection.id}]: ${selection.label} selected`
    });
  };

  handleDropdownSelection = (selection: DropdownEntry) => {
    this.setState({
      message: `Radio[${selection.id}]: ${selection.label} selected`
    });
  };
}
