import React from 'react';
import { SecondaryButton } from '../../basicComponents';
import { chevronLeftWhite } from '../../assets/images';

type Props = {
  action: (e?: React.MouseEvent) => void;
  width?: number;
  height?: number;
};

const style = { position: 'absolute', bottom: 0, left: -45 };

const BackButton = ({ action, width = 10, height = 15 }: Props) => (
  <SecondaryButton
    onClick={action}
    img={chevronLeftWhite}
    imgWidth={width}
    imgHeight={height}
    style={style}
  />
);

export default BackButton;
