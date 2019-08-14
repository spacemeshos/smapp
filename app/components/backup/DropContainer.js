// @flow
import React from 'react';
import { DropTarget } from 'react-dnd';
import styled from 'styled-components';
import { smColors } from '/vars';

// $FlowStyledIssue
const Item = styled.div`
  height: 32px;
  line-height: 32px;
  text-align: center;
  width: 140px;
  border: 1px solid ${smColors.green};
  border-radius: 2px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: white;
`;

type Props = {
  canDrop: boolean,
  isOver: boolean,
  connectDropTarget: any,
  droppedWord: string
};

const DropContainer = (props: Props) => {
  const { canDrop, isOver, droppedWord, connectDropTarget } = props;

  const isActive = canDrop && isOver;
  let backgroundColor = smColors.white;

  if (droppedWord) {
    backgroundColor = smColors.green;
  } else if (isActive) {
    backgroundColor = smColors.green30alpha;
  } else if (canDrop) {
    backgroundColor = smColors.green10alpha;
  }

  return (
    <Item ref={connectDropTarget} backgroundColor={backgroundColor}>
      {droppedWord}
    </Item>
  );
};

export default DropTarget(
  'item',
  {
    drop: (props, monitor) => {
      const item = monitor.getItem();
      props.onDrop({ droppedWord: item.word });
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
)(DropContainer);
