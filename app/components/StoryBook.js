// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { smFonts } from '/vars';
import { SmButton, SendReceiveButton, SmInput, SmRadioGroup, SmDropdown } from '/basicComponents';
import type { RadioEntry, DropdownEntry } from '/basicComponents';
import { localStorageService } from '/infra/localStorageService';

type StoryBookProps = {};
type StoryBookState = {
  message: string,
  disableButtons: boolean
};

const styles = {
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    width: '100%',
    ...smFonts.fontLight24
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
    label: '4.0 GB',
    disabled: true
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
    disableButtons: false
  };

  render() {
    const { message, disableButtons } = this.state;

    return (
      <div style={styles.content}>
        <div style={styles.row}>
          <span>{message}</span>
        </div>
        <div style={styles.row}>
          <SmInput onChange={this.handleChangeText} disabled={disableButtons} />
          <SmRadioGroup data={radioButtons} onPress={this.handleRadioSelect} disabled={disableButtons} />
          <SmDropdown disabled={disableButtons} data={dropdownList1} onPress={(e: DropdownEntry) => this.handleDropdownSelection(e)} />
          <SmDropdown disabled={disableButtons} data={dropdownList2} onPress={(e: DropdownEntry) => this.handleDropdownSelection(e)} />
        </div>
        <div style={styles.row}>
          <SendReceiveButton disabled={disableButtons} title="Send coins" onPress={() => this.handleSendReceiveButtonPress('send')} />
          <SendReceiveButton disabled={disableButtons} title="Receive coins" onPress={() => this.handleSendReceiveButtonPress('receive')} />
        </div>
        <div style={styles.row}>
          <SmButton title="Clear Local Storage" theme="green" disabled={disableButtons} onPress={() => this.handleButtonPress('clearStorage')} />
          <SmButton title="test" theme="green" disabled={disableButtons} onPress={() => this.handleButtonPress('green')} />
          <SmButton title="test" theme="orange" disabled={disableButtons} onPress={() => this.handleButtonPress('orange')} />
          <SmButton title={disableButtons ? 'enable' : 'disable'} theme="green" onPress={() => this.handleButtonPress(disableButtons ? 'enable' : 'disable')} />
        </div>
        <div style={styles.row}>
          <Link to="/">Back</Link>
        </div>
      </div>
    );
  }

  handleButtonPress = (val: string) => {
    const { disableButtons } = this.state;
    const disable = val === 'disable' && !disableButtons;
    if (val === 'clearStorage') {
      localStorageService.clearLocalStorage();
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

  handleRadioSelect = (selection: RadioEntry) => {
    if (selection) {
      this.setState({
        message: `Radio[${selection.id}]: ${selection.label} selected`
      });
    }
  };

  handleDropdownSelection = (selection: DropdownEntry) => {
    this.setState({
      message: `Radio[${selection.id}]: ${selection.label} selected`
    });
  };
}
