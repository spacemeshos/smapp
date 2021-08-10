import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Modal } from '../common';
import { Button } from '../../basicComponents';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import { setUiError } from '../../redux/ui/actions';

const Text = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.orange};
  margin-top: 20px;
`;

const ButtonsWrapper = styled.div<{ hasSingleButton: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: ${({ hasSingleButton }) => (hasSingleButton ? 'center' : 'space-between')};
  margin: 30px 0 15px 0;
`;

type Props = {
  children: any;
  error: Error | null;
  setUiError: (Error) => void;
};

type State = {
  error: any;
};

class ErrorBoundary extends Component<Props, State> {
  state = {
    error: null
  };

  render() {
    console.log('Err Boundary: render', this.props);
    const { children } = this.props;
    const { error } = this.state;

    if (error) {
      // @ts-ignore
      const { retryFunction } = error;
      const explanationText = `${retryFunction ? 'Retry failed action or refresh page.' : 'Try to refresh page.'}`;
      return (
        <Modal header="Something`s wrong here..." headerColor={smColors.orange}>
          {explanationText && <Text>{explanationText}</Text>}
          <ButtonsWrapper hasSingleButton={!retryFunction}>
            <Button onClick={() => this.setState({ error: null })} text="REFRESH" />
            {retryFunction && <Button onClick={this.handleRetry} text="RETRY" isPrimary={false} style={{ marginLeft: 20 }} />}
          </ButtonsWrapper>
        </Modal>
      );
    }
    return children;
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error: any, info: any) {
    console.log(`${error.message} ${info.componentStack}`); // eslint-disable-line no-console
    const { setUiError } = this.props;
    console.log('>>', error);
    setUiError(error);
    // this.setState({ error });
  }

  handleRetry = () => {
    const { error } = this.state;
    this.setState({ error: null });
    // @ts-ignore
    if (error && error.retryFunction) {
      // @ts-ignore
      error.retryFunction();
    }
  };
}

const mapStateToProps = (state: RootState) => ({
  error: state.ui.error
});

const mapDispatchToProps = { setUiError };

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary);
