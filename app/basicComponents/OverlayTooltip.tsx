import React from 'react';
import { PlacesType, Tooltip, VariantType } from 'react-tooltip';
import styled from 'styled-components';
import { smColors } from '../vars';

interface OverlayTooltipProps {
  anchorClassName: string;
  content: string;
  place?: PlacesType;
  variant?: VariantType;
}

const StyledTooltip = styled(Tooltip)`
  max-width: 300px !important;
  opacity: 1;
  padding: 10px !important;
  background-color: ${({
    theme: {
      popups: {
        states: { infoTooltip },
      },
    },
  }) => infoTooltip.backgroundColor} !important;
  border: 1px solid ${smColors.realBlack};
  border-radius: ${({
    theme: {
      popups: { boxRadius },
    },
  }) => boxRadius}px !important;
  font-size: 10px !important;
  line-height: 13px;

  white-space: pre-wrap;
  color: ${({
    theme: {
      popups: {
        states: { infoTooltip },
      },
    },
  }) => infoTooltip.color} !important;
`;

const OverlayTooltip = ({
  anchorClassName,
  content,
  place = 'top',
  variant,
}: OverlayTooltipProps) => {
  return (
    <StyledTooltip
      anchorSelect={`.${anchorClassName}`}
      place={place}
      content={content}
      variant={variant}
      noArrow
      opacity={1}
    />
  );
};

interface OverlayTooltipListProps
  extends Omit<OverlayTooltipProps, 'anchorClassName' | 'content'> {
  list: Array<{ anchorClassName: string; content: string }>;
}

const OverlayTooltipList = ({
  list,
  place,
  variant,
}: OverlayTooltipListProps) => (
  <>
    {list.map((tooltipContent) => (
      <OverlayTooltip
        key={tooltipContent.anchorClassName}
        {...tooltipContent}
        place={place}
        variant={variant}
      />
    ))}
  </>
);

export { OverlayTooltip, OverlayTooltipList };
