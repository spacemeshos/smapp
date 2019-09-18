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
  border: 1px solid ${smColors.black};
  &:hover {
    border: 1px solid ${smColors.purple};
  }
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
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin: 0 5px;
`;

const ItemsWrapper = styled.div`
  position: absolute;
  top: ${ROW_HEIGHT - 1}px;
  left: -1px;
  flex: 1;
  width: 101%;
  z-index: 10;
  overflow: hidden;
  transition: all 0.2s linear;
  overflow-y: scroll;
  border-bottom: 1px solid ${smColors.purple};
  border-left: 1px solid ${smColors.purple};
  border-right: 1px solid ${smColors.purple};
  background-color: ${smColors.white};
`;

const DropdownRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const DdElement = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin: 5px 10px;
  padding: 5px 0;
  border-bottom: 1px solid ${smColors.disabledGray};
  cursor: pointer;
  ${({ isFirst }) => isFirst && `border-top: 1px solid ${smColors.disabledGray};`}
`;

const Nickname = styled.div`
  font-size: 14px;
  line-height: 18px;
  color: ${smColors.black};
  cursor: pointer;
`;

const Address = styled(Nickname)`
  font-family: SourceCodeProBold;
`;

type Props = {
  initialAddress: string,
  onChange: ({ address: string }) => void,
  openCreateNewContact: () => void,
  contacts: Contact[]
};

type State = {
  address: string,
  filteredContacts: Contact[],
  isUnsavedAddress: boolean
};

class AutoComplete extends Component<Props, State> {
  debounce: TimeoutID;

  myRef: any;

  constructor(props: Props) {
    super(props);
    const { initialAddress } = props;
    this.state = {
      address: initialAddress,
      filteredContacts: [],
      isUnsavedAddress: false
    };

    this.myRef = React.createRef();
  }

  render() {
    const { address, filteredContacts, isUnsavedAddress } = this.state;
    return (
      <Wrapper>
        <HeaderWrapper>
          <ActualInput value={address} onKeyPress={this.onEnterPress} onChange={this.onChange} type="text" maxLength="64" ref={this.myRef} />
          {isUnsavedAddress && <AddToContactsImg src={addContact} onClick={this.openCreateNewContact} />}
        </HeaderWrapper>
        {filteredContacts.length ? <ItemsWrapper>{filteredContacts.map((item, index) => this.renderRow({ item, index }))}</ItemsWrapper> : null}
      </Wrapper>
    );
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { filteredContacts } = this.state;
    if (prevState.filteredContacts.length && !filteredContacts.length) {
      this.myRef.current.focus();
    }
  }

  componentWillUnmount() {
    this.debounce && clearTimeout(this.debounce);
  }

  renderRow = ({ item, index }: { item: Contact, index: number }) => {
    return (
      <DropdownRow onClick={(event) => this.handleSelection({ event, item })} key={`${item.label}${index}`}>
        <DdElement isFirst={index === 0}>
          <Nickname>{item.nickname || 'Unknown Address'}</Nickname>
          <Address>{getAbbreviatedText(item.address)}</Address>
        </DdElement>
      </DropdownRow>
    );
  };

  onEnterPress = ({ key }: { key: string }) => {
    const { onChange, contacts } = this.props;
    const { address } = this.state;
    if (key === 'Enter') {
      clearTimeout(this.debounce);
      onChange({ address });
      const filteredContacts = contacts.filter((contact) => contact.address.indexOf(address) !== -1 || contact.nickname.indexOf(address) !== -1);
      this.setState({ address, filteredContacts: [], isUnsavedAddress: filteredContacts.length === 0 });
    }
  };

  onChange = ({ target }: { target: { value: string } }) => {
    const { onChange, contacts } = this.props;
    const { value } = target;
    this.setState({ address: value });
    onChange({ address: value });
    clearTimeout(this.debounce);
    if (!value) {
      this.setState({ address: '', filteredContacts: contacts });
    } else {
      this.debounce = setTimeout(() => {
        const filteredContacts = contacts.filter((contact) => contact.address.indexOf(value) !== -1 || contact.nickname.indexOf(value) !== -1);
        this.setState({ filteredContacts, isUnsavedAddress: filteredContacts.length === 0 });
      }, 200);
    }
  };

  handleSelection = ({ event, item }: { event: Event, item: Contact }) => {
    const { onChange } = this.props;
    event.stopPropagation();
    event.preventDefault();
    clearTimeout(this.debounce);
    onChange({ address: item.address });
    this.setState({ address: item.address, filteredContacts: [], isUnsavedAddress: false });
  };

  openCreateNewContact = () => {
    const { openCreateNewContact } = this.props;
    openCreateNewContact();
    this.setState({ isUnsavedAddress: false });
  };
}

export default AutoComplete;
