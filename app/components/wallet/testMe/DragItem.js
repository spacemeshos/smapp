// @flow
import React from 'react';
import { DragSource } from 'react-dnd';
import styled from 'styled-components';
import DnDTypes from './DnDTypes';
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
`;

const DragItem = ({ word, isDropped, isDragging, connectDragSource }: { word: string, isDropped: boolean, isDragging: boolean, connectDragSource: any }) => {
  return (
    <Wrapper ref={connectDragSource} isDragging={isDragging} isDropped={isDropped}>
      {!isDropped ? word : ''}
    </Wrapper>
  );
};
export default DragSource(
  DnDTypes.ITEM,
  {
    beginDrag: (props) => ({ word: props.word }),
    canDrag: (props) => !props.isDropped,
    endDrag(props, monitor) {
      const item = monitor.getItem();
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        props.drop(item.word);
      }
    }
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(DragItem);
