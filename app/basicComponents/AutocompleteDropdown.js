import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { chevronBottomBlack, chevronBottomWhite } from '/assets/images';
import { getAbbreviatedText } from '/infra/utils';

const AutocompleteField = styled.div`
  position: relative;
  background-color: ${smColors.white};
`;

const InputField = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 40px;
  border: 1px solid ${({ isFocused }) => (isFocused ? smColors.purple : smColors.black)};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.2 : 1)};
  ${({ isDisabled }) => !isDisabled && `&:hover { border: 1px solid ${smColors.purple}; `}
  background-color: ${smColors.white};
`;

const ActualInput = styled.input`
  flex: 1;
  width: 100%;
  height: 36px;
  padding: 8px 14px;
  border-radius: 0;
  border: none;
  color: ${({ isDisabled }) => (isDisabled ? smColors.darkGray : smColors.black)};
  font-size: 14px;
  line-height: 16px;
  outline: none;
`;

const AutocompleteList = styled.div`
  position: absolute;
  top: 2em;
  width: 100%;
  background: ${smColors.white};
  overflow: auto;
  height: ${(props) => (props.show ? 'unset' : '0')};
  max-height: 214px;
  z-index: 9;
  -webkit-box-shadow: 0 2px 3px ${smColors.black30Alpha};
  box-shadow: 0 2px 3px ${smColors.black30Alpha};
  > div {
    padding: 10px;
    margin: 0 6px;
    font-size: 13px;
    background: ${smColors.white};
    color: ${smColors.black30Alpha};
    border-bottom: 1px solid ${smColors.disabledGray};
    cursor: pointer;
    outline: none;
  }
  > div:hover {
    background: ${smColors.black10Alpha};
  }
  > div:last-child {
    border: none;
  }
  > div.isFocus {
    background: ${smColors.black20Alpha};
  }
`;

const Icon = styled.img`
  height: 11px;
  width: 22px;
  margin: 0 10px;
  transform: rotate(${({ isOpened }) => (isOpened ? '180' : '0')}deg);
  transition: transform 0.2s linear;
  cursor: pointer;
`;

type Props = {
  isDarkModeOn: boolean,
  getItemValue: () => void,
  id: string,
  name: string,
  value: string,
  placeholder: string,
  data: Array,
  onChange: () => void,
  onEnter: () => void
};

const AutocompleteDropdown = (props: Props) => {
  const { value } = props;
  let inputBlurTimer = null;
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState([]);
  const [isFocus, setIsFocus] = useState(-1);
  const [editField, setEditField] = useState(value || '');
  const [move, setMove] = useState(0);

  const inputField = useRef({});
  const listContainer = useRef({});

  useEffect(() => {
    return clearTimeout(inputBlurTimer);
  }, []);

  const filterList = () => {
    const { data, getItemValue } = props;
    const { value } = inputField.current || {};
    let list = [];

    if (value && value.trim()) {
      list = data.filter((d) => getItemValue(d).toLowerCase().indexOf(value.trim().toLowerCase()) > -1);
    }
    return list;
  };

  const handleSelectOption = (data) => {
    const { onChange, getItemValue } = props;

    onChange(getItemValue(data));
    setEditField(getItemValue(data));
    setList([]);
    setIsFocus(list.indexOf(data));
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    const list = filterList();
    setList(list);
    setIsFocus(0);
    setIsOpen(list.length > 0);
  };

  const handleInputBlur = () => {
    inputBlurTimer = setTimeout(() => {
      setList([]);
      setIsOpen(false);
    }, 200);
  };

  const handleIconClick = () => {
    const { data, getItemValue } = props;
    const list = !isOpen ? data.filter((d) => getItemValue(d).toLowerCase()) : [];
    setList(list);
    setIsOpen(!isOpen);
  };

  const handleInputKeyUp = (e) => {
    const { keyCode } = e;

    e.stopPropagation();
    e.preventDefault();

    if (keyCode === 13) {
      // Enter
      pressEnterKey(e);
    } else if (keyCode === 38) {
      // Up
      if (isFocus > 0) {
        setMove('up');
        setIsFocus(isFocus - 1);
      }
    } else if (keyCode === 39) {
      // Right
      pressEnterKey(e);
    } else if (keyCode === 40) {
      // Down
      if (isFocus < list.length - 1) {
        setMove('down');
        setIsFocus(isFocus + 1);
      }
    }
  };

  const pressEnterKey = (e) => {
    const { onChange, getItemValue, onEnter } = props;
    const data = list[isFocus];

    const value = (data && getItemValue(data)) || editField;

    onChange(value);
    setEditField(value);
    setList([]);
    setIsOpen(false);

    onEnter(e);
  };

  const scrollListContainer = () => {
    const c = listContainer.current;

    if (c) {
      if (c.children[0]) {
        const nh = c.offsetHeight;
        const ch = c.children[0].offsetHeight;
        const st = c.scrollTop;

        if (move === 'down') {
          const moveBottom = (isFocus + 1) * ch;

          if (moveBottom - st > nh) {
            c.scrollTo(0, moveBottom - nh);
          }
        } else if (move === 'up') {
          const moveTop = isFocus * ch;

          if (moveTop < st) {
            c.scrollTo(0, moveTop);
          }
        }
      }
    }
  };

  const renderItem = (item) => (
    <div role="button" tabIndex="-1">
      {item.nickname} - {getAbbreviatedText(item.address)}
    </div>
  );

  const renderMenu = () => {
    const menus = filterList().map((data, i) => {
      const item = renderItem(data);

      return React.cloneElement(item, {
        key: data.address || data.nickname,
        className: i === isFocus ? 'isFocus' : '',
        onClick: () => handleSelectOption(data)
      });
    });

    setTimeout(() => {
      scrollListContainer();
    }, 10);

    return menus;
  };

  const handleInputChange = (e) => {
    const { target } = e;
    const { value } = target;
    const { onChange } = props;
    const list = filterList();

    onChange(value);

    setList(list);
    setIsOpen(list.length > 0);
    setIsFocus(0);
    setEditField(value);
  };

  const { id, name, placeholder, isDarkModeOn } = props;
  const icon = isDarkModeOn ? chevronBottomBlack : chevronBottomWhite;

  return (
    <AutocompleteField icon={icon}>
      <InputField>
        <ActualInput
          type="text"
          id={id}
          name={name}
          autoComplete="off"
          placeholder={placeholder}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          onKeyUp={handleInputKeyUp}
          value={editField}
          maxLength={42}
          ref={inputField}
        />
        <Icon isOpened={isOpen} src={icon} onClick={handleIconClick} />
      </InputField>
      <AutocompleteList show={isOpen} ref={listContainer}>
        {renderMenu()}
      </AutocompleteList>
    </AutocompleteField>
  );
};

export default AutocompleteDropdown;
