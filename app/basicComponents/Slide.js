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
  font-size: 16px;
  text-align: center;
  color: ${smColors.lighterBlack};
  line-height: 28px;
`;

type Props = {
  source: string,
  text: string
};

class Slide extends PureComponent<Props> {
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
