// @flow
import * as React from 'react';
import styles from './SmallLoader.css';
import * as LoadingImageSource from '../../../assets/images/loading@2x.png';
import * as VImageSource from '../../../assets/images/v@2x.png';
import * as VWhiteImageSource from '../../../assets/images/v_white@2x.png';

type SmallLoaderProps = {
  isLoading: boolean,
  mode?: 'normal' | 'white',
  loadingTop?: number,
  loadingLeft?: number,
  loadingSize?: number,
  doneTop?: number,
  doneLeft?: number,
  doneSize?: number
};

export default class SmallLoader extends React.Component<SmallLoaderProps> {
  render() {
    const { isLoading, mode, doneSize, doneTop, doneLeft, loadingSize, loadingTop, loadingLeft } = this.props;

    const VImgSource = mode && mode === 'white' ? VWhiteImageSource : VImageSource;

    const loadingStyle = {
      position: 'absolute',
      top: loadingTop || 18,
      left: loadingLeft || 8,
      height: loadingSize || 18,
      width: loadingSize || 18,
      transition: 'all .2s linear'
    };

    const doneStyle = {
      position: 'absolute',
      top: doneTop || 20,
      left: doneLeft || 8,
      height: doneSize || 12,
      width: doneSize || 12
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
