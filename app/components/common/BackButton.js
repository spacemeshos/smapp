import React, { PureComponent } from 'react';
import { SecondaryButton } from '/basicComponents';
import { chevronLeftWhite } from '/assets/images';

type Props = {
  action: Function,
  width?: number,
  height?: number
};

const style = { position: 'absolute', bottom: 0, left: -45 };

class BackButton extends PureComponent<Props> {
  static defaultProps = {
    width: 10,
    height: 15
  };

  render() {
    const { action, width, height } = this.props;
    return <SecondaryButton onClick={action} img={chevronLeftWhite} imgWidth={width} imgHeight={height} style={style} />;
  }
}

export default BackButton;
