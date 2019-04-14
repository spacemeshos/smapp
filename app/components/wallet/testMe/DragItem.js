// @flow
import React from 'react';
import { DragSource } from 'react-dnd';
import styled from 'styled-components';
import { smColors } from '/vars';

// $FlowStyledIssue
const Wrapper = styled.div`
  height: 32px;
  line-height: 32px;
  text-align: center;
  width: 140px;
  border-radius: 2px;
  background-color: ${({ isDropped }) => (isDropped ? smColors.borderGray : smColors.green)};
  margin-right: 12px;
  color: ${smColors.white};
  opacity: ${({ isDragging }) => (isDragging ? 0.4 : 1)};
  cursor: pointer;
`;

type Props = {
  word: string,
  isDropped: boolean,
  isDragging: boolean,
  connectDragSource: any
};

const DragItem = (props: Props) => {
  const { word, isDropped, isDragging, connectDragSource } = props;
  return (
    <Wrapper ref={connectDragSource} isDragging={isDragging} isDropped={isDropped}>
      {!isDropped ? word : ''}
    </Wrapper>
  );
};
export default DragSource(
  'item',
  {
    beginDrag: (props: Props) => ({ word: props.word })
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(DragItem);
