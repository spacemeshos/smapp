import React from 'react';
import { PlacesType, Tooltip, VariantType } from 'react-tooltip';
import styled from 'styled-components';

interface OverlayTooltipProps {
  id: string;
  content: string;
  place?: PlacesType;
  variant?: VariantType;
}

const StyledTooltip = styled(Tooltip)`
  background-color: #555 !important;
  color: #fff !important;
  border-radius: 4px !important;
  padding: 8px 12px !important;
  font-size: 14px !important;
  max-width: 300px !important;
`;

const OverlayTooltip = ({
  id,
  content,
  place = 'top',
  variant,
}: OverlayTooltipProps) => {
  return (
    <StyledTooltip
      anchorSelect={`.${id}`}
      place={place}
      content={content}
      variant={variant}
    />
  );
};

interface OverlayTooltipListProps
  extends Omit<OverlayTooltipProps, 'id' | 'content'> {
  list: Array<{ id: string; content: string }>;
}

const OverlayTooltipList = ({
  list,
  place,
  variant,
}: OverlayTooltipListProps) => (
  <>
    {list.map((tooltipContent) => (
      <OverlayTooltip
        key={tooltipContent.id}
        {...tooltipContent}
        place={place}
        variant={variant}
      />
    ))}
  </>
);

export { OverlayTooltip, OverlayTooltipList };
