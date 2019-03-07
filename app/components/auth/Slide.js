// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors, smFonts } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 15px;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
`;

// $FlowStyledIssue
const Image = styled.img`
  max-width: 100px;
  max-height: 100px;
  margin-bottom: 30px;
`;

const Text = styled.span`
  text-align: center;
  color: ${smColors.black};
  font-family: ${smFonts.fontNormal16.fontFamily};
  font-size: ${smFonts.fontNormal16.fontSize}px;
  font-weight: ${smFonts.fontNormal16.fontWeight};
  user-select: none;
`;

export type SlideProps = {
  id: number, // eslint-disable-line react/no-unused-prop-types
  source: any,
  text: string
};

class Slide extends PureComponent<SlideProps> {
  render() {
    const { source, text } = this.props;
    return (
      <Wrapper>
        <ImageWrapper>
          <Image src={source} />
        </ImageWrapper>
        <Text>{text}</Text>
      </Wrapper>
    );
  }
}

export default Slide;
