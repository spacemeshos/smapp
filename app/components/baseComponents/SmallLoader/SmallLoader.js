// @flow
import React from 'react';
import styles from './SmallLoader.css';
import { LoadingImageSource, VImageSource, VWhiteImageSource } from '../../../assets/images';

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
