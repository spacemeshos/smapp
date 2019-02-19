/* eslint-disable react/require-default-props */
/* eslint-disable global-require */
// @flow
import * as React from 'react';
import styles from './SmallLoader.css';

type SmallLoaderProps = {
  isLoading: boolean,
  mode?: 'normal' | 'white'
};

export default class SmallLoader extends React.Component<SmallLoaderProps> {
  render() {
    const { isLoading, mode } = this.props;

    const LoadingImageSource = require('./assets/loading@2x.png');
    const VImageSource =
      mode && mode === 'white'
        ? require('./assets/v_white@2x.png')
        : require('./assets/v@2x.png');

    const loadingStyle = {
      position: 'absolute',
      top: 18,
      left: 8,
      height: 18,
      width: 18,
    };

    const doneStyle = {
      position: 'absolute',
      top: 20,
      left: 8,
      height: 12,
      width: 12,
    };

    return (
      <div>
        <img
            src={isLoading? LoadingImageSource: VImageSource}
            style={isLoading? loadingStyle: doneStyle}
            className={isLoading? styles.rotate: ''} data-tid="rotate"
            alt="Icon missing"
          />
      </div>
    );
  }
}
