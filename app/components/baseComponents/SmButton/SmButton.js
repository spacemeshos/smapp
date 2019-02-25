// @flow
import React from 'react';
import styled from 'styled-components';
import { smColors, smFonts } from '/vars';

type SmButtonProps = {
  title: string,
  theme: 'green' | 'orange',
  disabled?: boolean,
  font?: 'fontLight24' | 'fontNormal16' | 'fontNormal14' | 'fontBold14',
  onPress: () => void
};

type SmButtonState = {
  hovered: boolean,
  clicked: boolean
};

const styles = {
  root: {
    borderRadius: 0,
    cursor: 'pointer'
  },
  disabled: {
    border: `1px solid ${smColors.borderGray}`,
    cursor: 'default'
  },
  buttonWrapper: {
    height: '100%',
    width: '100%'
  },
  button: {
    overflow: 'hidden',
    padding: 10,
    paddingTop: 6,
    userSelect: 'none'
  },
  buttonText: {
    textAlign: 'center'
  }
};

// $FlowStyledIssue
const Container = styled.div`
  cursor: pointer;
  border-radius: 0;
  background-color: ${({ theme }) => (theme === 'green' ? smColors.white : smColors.orange)};
  border: 1px solid ${({ theme }) => (theme === 'green' ? smColors.borderGray : smColors.orange)};
`;

export default class SmButton extends React.Component<SmButtonProps, SmButtonState> {
  constructor(props: SmButtonProps) {
    super(props);
    this.state = {
      hovered: false,
      clicked: false
    };
  }

  render() {
    const { disabled, onPress, theme } = this.props;

    return (
      <Container theme={theme}>
        <div style={styles.buttonWrapper} onClick={disabled ? undefined : onPress} onMouseDown={this.handlePressIn} onMouseUp={this.handlePressOut}>
          {this.renderRmButtonElem()}
        </div>
      </Container>
    );
  }

  renderRmButtonElem = () => {
    const { title } = this.props;
    return (
      <div style={styles.button} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <span style={{ ...styles.buttonText, ...this.buttonTextThemeStyle(), ...this.disabledTextThemeStyle() }}>{title}</span>
      </div>
    );
  };

  handleMouseEnter = () => {
    this.setState({ hovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ hovered: false });
  };

  handlePressIn = () => {
    this.setState({ clicked: true });
  };

  handlePressOut = () => {
    this.setState({ clicked: false });
  };

  buttonTextThemeStyle = () => {
    const { theme, font } = this.props;
    const fontByTheme: string = theme === 'green' ? 'fontNormal14' : 'fontBold14';
    return {
      color: theme === 'green' ? smColors.darkGreen : smColors.white,
      ...smFonts[font !== undefined ? font : fontByTheme]
    };
  };

  disabledTextThemeStyle = () => {
    const { theme, disabled } = this.props;
    return disabled ? { color: theme === 'green' ? smColors.borderGray : smColors.white } : {};
  };

  hoveredThemeStyle = () => {
    const { theme } = this.props;
    return {
      backgroundColor: theme === 'green' ? `rgba(${smColors.greenRgb}, 0.1)` : `rgba(${smColors.orangeRgb}, 0.71)`
    };
  };

  disabledThemeStyle = () => {
    const { theme } = this.props;
    return { backgroundColor: theme === 'green' ? smColors.white : smColors.borderGray };
  };

  clickedThemeStyle = () => {
    const { theme } = this.props;
    return { backgroundColor: theme === 'green' ? smColors.white : smColors.darkOrange, border: `1px solid ${theme === 'green' ? smColors.green : smColors.orange}` };
  };

  rootStyles = () => {
    const { disabled } = this.props;
    const { clicked, hovered } = this.state;
    if (disabled) {
      return { ...styles.disabled, ...this.disabledThemeStyle() };
    }
    if (clicked) {
      return this.clickedThemeStyle();
    }
    if (hovered) {
      return this.hoveredThemeStyle();
    }
    return {};
  };
}
