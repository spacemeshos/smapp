// @flow
import * as React from 'react';
import styles from './SmallLoader.css';
import * as LoadingImageSource from '../../../assets/images/loading@2x.png';
import * as VImageSource from '../../../assets/images/v@2x.png';
import * as VWhiteImageSource from '../../../assets/images/v_white@2x.png';

type SmallLoaderProps = {
  isLoading: boolean,
  mode?: 'normal' | 'white'
};

export default class SmallLoader extends React.Component<SmallLoaderProps> {
  render() {
    const { isLoading, mode } = this.props;

    const VImgSource = mode && mode === 'white' ? VWhiteImageSource : VImageSource;

    const loadingStyle = {
      position: 'absolute',
      top: 18,
      left: 8,
      height: 18,
      width: 18
    };

    const doneStyle = {
      position: 'absolute',
      top: 20,
      left: 8,
      height: 12,
      width: 12
    };

    return (
      <div>
        <img
          src={isLoading ? LoadingImageSource : VImgSource}
          style={isLoading ? loadingStyle : doneStyle}
          className={isLoading ? styles.rotate : ''}
          data-tid="rotate"
          alt="Icon missing"
        />
      </div>
    );
  }
}
