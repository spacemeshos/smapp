import React from 'react';
import { SecondaryButton } from '../../basicComponents';
import { chevronLeftWhite } from '../../assets/images';

type Props = {
  action: (e?: React.MouseEvent) => void;
};

const style = { position: 'absolute', bottom: 0, left: -45 };

const BackButton = ({ action }: Props) => (
  <SecondaryButton
    onClick={action}
    img={chevronLeftWhite}
    imgWidth={10}
    imgHeight={15}
    style={style}
  />
);

export default BackButton;
