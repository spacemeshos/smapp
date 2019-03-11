// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

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
  margin-bottom: 30px;
`;

// $FlowStyledIssue
const Image = styled.img`
  max-width: 100px;
  max-height: 100px;
`;

const Text = styled.span`
  line-height: 26px;
  text-align: center;
  color: ${smColors.black};
  font-size: 16px;
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
