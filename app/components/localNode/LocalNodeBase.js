// @flow
import React from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const LocalNodePageBodyWrapper = styled.div`
  display: flex;
  height: 100%;
`;

const LocalNodeHeaderText = styled.span`
  font-size: 31px;
  font-weight: bold;
  color: ${smColors.darkGray};
`;

const LeftPane = styled.div`
  text-align: left;
  flex: 2;
  padding: 24px 0;
  margin-right: 32px;
`;

const RightPane = styled.div`
  flex: 1;
  background-color: white;
  padding: 30px;
  border: 1px solid ${smColors.borderGray};
`;

type Props = {
  rightPane: Object,
  leftPane: Object,
  header: string
};

const LocalNodeBase = (props: Props) => {
  const { header, leftPane, rightPane } = props;
  return [
    <LocalNodeHeaderText key="local-node-header">{header}</LocalNodeHeaderText>,
    <LocalNodePageBodyWrapper key="local-node-body">
      <LeftPane>{leftPane}</LeftPane>
      <RightPane>{rightPane}</RightPane>
    </LocalNodePageBodyWrapper>
  ];
};

export default LocalNodeBase;
