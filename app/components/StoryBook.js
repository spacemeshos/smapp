// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SmButton, SendReceiveButton, SmInput, SmRadioGroup, SmDropdown } from '/basicComponents';
import type { RadioEntry, DropdownEntry } from '/basicComponents';
import { localStorageService } from '../infra/storageServices';

type StoryBookProps = {
  history: any
};
type StoryBookState = {
  message: string,
  disableButtons: boolean,
  index1: number,
  index2: number
};

const styles = {
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    width: '100%',
    fontSize: 24,
    fontFamily: 'sans-serif'
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
  },
  {
    id: 3,
    label: '4.0 GB test test test test',
    isDisabled: true
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

export default class WalletRoot extends Component<StoryBookProps, StoryBookState> {
  props: StoryBookProps;

  state: StoryBookState = {
    message: '',
    index1: -1,
    index2: -1,
    disableButtons: false
  };

  render() {
    const { message, disableButtons, index1, index2 } = this.state;

    return (
      <div style={styles.content}>
        <div style={styles.row}>
          <span>{message}</span>
        </div>
        <div style={styles.row}>
          <SmInput onChange={this.handleChangeText} isDisabled={disableButtons} />
          <SmRadioGroup data={radioButtons} onSelect={this.handleRadioSelect} />
          <SmDropdown isDisabled={disableButtons} data={dropdownList1} selectedItemIndex={index1} onPress={this.handleDropdownSelection} />
          <SmDropdown isDisabled={disableButtons} data={dropdownList1} selectedItemIndex={index2} onPress={this.handleDropdownSelection1} />
        </div>
        <div style={styles.row}>
          <SendReceiveButton disabled={disableButtons} title="Send coins" onPress={() => this.handleSendReceiveButtonPress('send')} />
          <SendReceiveButton disabled={disableButtons} title="Receive coins" onPress={() => this.handleSendReceiveButtonPress('receive')} />
        </div>
        <div style={styles.row}>
          <SmButton text="Clear Local Storage" theme="green" isDisabled={disableButtons} onPress={() => this.handleButtonPress('clearStorage')} />
          <SmButton text="test" theme="green" isDisabled={disableButtons} onPress={() => this.handleButtonPress('green')} />
          <SmButton text="test" theme="orange" isDisabled={disableButtons} onPress={() => this.handleButtonPress('orange')} />
          <SmButton text={disableButtons ? 'enable' : 'disable'} theme="green" onPress={() => this.handleButtonPress(disableButtons ? 'enable' : 'disable')} />
        </div>
        <div style={styles.row}>
          <Link to="/auth">Back</Link>
          <SmButton text="Logout" theme="green" onPress={this.handleLogout} />
        </div>
      </div>
    );
  }

  handleButtonPress = (val: string) => {
    const { disableButtons } = this.state;
    const disable = val === 'disable' && !disableButtons;
    if (val === 'clearStorage') {
      localStorageService.clear();
    }
    this.setState({
      message: `Pressed ${val} button`,
      disableButtons: disable
    });
  };

  handleSendReceiveButtonPress = (val: string) => {
    this.setState({
      message: `Pressed ${val} button`
    });
  };

  handleChangeText = ({ value }: { value: string }) => {
    this.setState({
      message: `Typed: ${value}`
    });
  };

  handleRadioSelect = ({ index }: { index: number }) => {
    this.setState({
      message: `Radio [${radioButtons[index].label}] selected`
    });
  };

  handleDropdownSelection = ({ index }: { index: number }) => {
    this.setState({
      message: `Radio[${dropdownList1[index].id}]: ${dropdownList1[index].label} selected`,
      index1: index
    });
  };

  handleDropdownSelection1 = ({ index }: { index: number }) => {
    this.setState({
      message: `Radio[${dropdownList2[index].id}]: ${dropdownList2[index].label} selected`,
      index2: index
    });
  };

  handleLogout = () => {
    const { history } = this.props;
    history.push('/');
  };
}
