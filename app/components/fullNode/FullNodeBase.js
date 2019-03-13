// @flow
import React from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

export const FullNodePageBodyWrapper = styled.div`
  display: flex;
  height: 100%;
`;

export const FullNodeHeaderText = styled.span`
  font-size: 31px;
  font-weight: bold;
  color: ${smColors.darkGrayText};
`;

export const LeftPane = styled.div`
  text-align: left;
  flex: 2;
  padding: 24px 0;
  margin-right: 32px;
`;

export const RightPane = styled.div`
  flex: 1;
  background-color: white;
  padding: 30px;
  border: 1px solid ${smColors.borderGray};
`;

type Props = {
  rightPane: any,
  leftPane: any,
  header: string
};

const FullNodeBase = (props: Props) => {
  const { header, leftPane, rightPane } = props;
  return [
    <FullNodeHeaderText key="full-node-header">{header}</FullNodeHeaderText>,
    <FullNodePageBodyWrapper key="full-node-body">
      <LeftPane>{leftPane()}</LeftPane>
      <RightPane>{rightPane()}</RightPane>
    </FullNodePageBodyWrapper>
  ];
};

export default FullNodeBase;
