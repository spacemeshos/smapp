// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { getAbbreviatedText } from '/infra/utils';
import { addContact } from '/assets/images';
import type { Contact } from '/types';

const ROW_HEIGHT = 40;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
  border: 1px solid ${({ isFocused }) => (isFocused ? smColors.purple : smColors.black)};
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${ROW_HEIGHT}px;
  background-color: ${smColors.white};
`;

const ActualInput = styled.input`
  flex: 1;
  width: 100%;
  height: 38px;
  padding: 8px 10px;
  border-radius: 0;
  border: none;
  color: ${smColors.black};
  font-size: 14px;
  line-height: 16px;
  outline: none;
`;

const AddToContactsImg = styled.img`
  width: 14px;
  height: 12px;
  cursor: pointer;
  margin: 0 10px;
`;

const ItemsWrapper = styled.div`
  position: absolute;
  top: ${ROW_HEIGHT - 1}px;
  width: 100%;
  flex: 1;
  z-index: 10;
  overflow: hidden;
  transition: all 0.2s linear;
  overflow-y: scroll;
  box-shadow: 0 3px 6px ${smColors.black02Alpha};
  background-color: ${smColors.white};
`;

const DropdownRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${ROW_HEIGHT}px;
  cursor: pointer;
`;

const DdElement = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: ${ROW_HEIGHT}px;
  padding: 10px 5px;
  border-bottom: 1px solid ${smColors.disabledGray};
`;

const Nickname = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
`;

const Address = styled(Nickname)`
  font-family: SourceCodeProBold;
`;

type Props = {
  initialAddress: string,
  onChange: ({ value: string }) => void,
  contacts: Contact[],
  style?: Object
};

type State = {
  address: string,
  filteredContacts: Contact[],
  isFocused: boolean
};

class AutoComplete extends Component<Props, State> {
  debounce: TimeoutID;

  constructor(props: Props) {
    super(props);
    const { initialAddress } = props;
    this.state = {
      address: initialAddress,
      filteredContacts: [],
      isFocused: false
    };
  }

  render() {
    const { style } = this.props;
    const { address, isFocused, filteredContacts } = this.state;
    return (
      <Wrapper isFocused={isFocused} style={style}>
        <HeaderWrapper>
          <ActualInput
            value={address}
            onChange={this.onChange}
            onFocus={() => this.setState({ isFocused: true })}
            onBlur={() => this.setState({ isFocused: false })}
            type="text"
            maxLength="64"
          />
          <AddToContactsImg src={addContact} />
        </HeaderWrapper>
        {isFocused && filteredContacts && <ItemsWrapper>{filteredContacts.map((item, index) => this.renderRow({ item, index }))}</ItemsWrapper>}
      </Wrapper>
    );
  }

  renderRow = ({ item, index }: { item: Contact, index: number }) => {
    return (
      <DropdownRow onClick={(event) => this.handleSelection({ event, item })} key={`${item.label}${index}`}>
        <DdElement>
          <Nickname>{item.nickname || 'Unknown Address'}</Nickname>
          <Address>{getAbbreviatedText(item.address, 8)}</Address>
        </DdElement>
      </DropdownRow>
    );
  };

  onChange = ({ target }: { target: { value: string } }) => {
    const { onChange, contacts } = this.props;
    const { value } = target;
    this.setState({ address: value });
    clearTimeout(this.debounce);
    if (!value) {
      onChange({ value });
      this.setState({ address: '', filteredContacts: contacts });
    } else {
      this.debounce = setTimeout(() => {
        onChange({ value });
        this.setState({
          filteredContacts: contacts.filter((contact) => contact.address.indexOf(value) !== -1 || contact.nickname.indexOf(value) !== -1)
        });
      }, 200);
    }
  };

  handleSelection = ({ event, item }: { event: Event, item: Contact }) => {
    const { onChange } = this.props;
    event.preventDefault();
    event.stopPropagation();
    clearTimeout(this.debounce);
    onChange({ value: item.address });
    this.setState({ address: item.address, isFocused: false });
  };
}

export default AutoComplete;
