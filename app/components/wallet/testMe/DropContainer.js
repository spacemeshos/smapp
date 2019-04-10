// @flow
import React, { useState, useImperativeHandle, useEffect } from 'react';
import { DropTarget } from 'react-dnd';
import styled from 'styled-components';
import DnDTypes from './DnDTypes';
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
  transition: background-color 0.1s linear;
`;

const Word = styled.span`
  color: white;
`;

const DropContainer = React.forwardRef(
  ({ canDrop, isOver, connectDropTarget, resetContainer }: { canDrop: boolean, isOver: boolean, connectDropTarget: any, resetContainer: boolean }, ref) => {
    const [droppedWord, setDroppedWord] = useState(null);

    useEffect(() => {
      if (resetContainer) {
        setDroppedWord(null);
      }
    });

    useImperativeHandle(
      ref,
      () => ({
        onDrop: ({ itemWord }) => {
          setDroppedWord(itemWord);
        }
      }),
      []
    );

    const isActive = canDrop && isOver;
    const isDropped = !!droppedWord;
    let backgroundColor = smColors.white;
    if (isDropped) {
      backgroundColor = smColors.green;
    } else if (isActive) {
      backgroundColor = smColors.green30alpha;
    } else if (canDrop) {
      backgroundColor = smColors.green10alpha;
    }
    return (
      <Item ref={connectDropTarget} backgroundColor={backgroundColor}>
        {droppedWord && <Word>{droppedWord}</Word>}
      </Item>
    );
  }
);

export default DropTarget(
  DnDTypes.ITEM,
  {
    drop(props, monitor, component) {
      if (!component) {
        return;
      }
      const item = monitor.getItem();
      const hasDropped = monitor.didDrop();
      props.match(item.word === props.word);
      component.onDrop({ itemWord: item.word, expectedWord: props.word, hasDropped });
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
)(DropContainer);
