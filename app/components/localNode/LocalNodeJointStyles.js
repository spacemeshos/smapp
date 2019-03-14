// @flow
import styled, { css } from 'styled-components';
import { smColors } from '/vars';

const Actionable = css`
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

export const RightPaneInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const LeftPaneInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
`;

export const RightHeaderText = styled.span`
  font-size: 14px;
  font-weight: bold;
  padding: 0 12px 12px 12px;
`;

export const BaseText = styled.span`
  font-size: 16px;
  font-weight: normal;
`;

export const GrayText = styled(BaseText)`
  color: ${smColors.textGray};
`;

export const BoldText = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

export const ActionLink = styled(BaseText)`
  user-select: none;
  color: ${smColors.green};
  cursor: pointer;
  ${Actionable}
`;

// $FlowStyledIssue
export const BaseImage = styled.img`
  height: ${({ height }) => (height ? `${height}px` : '100%')};
  width: ${({ width }) => (width ? `${width}px` : '100%')};
`;

// $FlowStyledIssue
export const ImageWrapper = styled.div`
  ${({ maxHeight }) =>
    maxHeight &&
    `
  max-height: ${maxHeight}px;

  `}
  ${({ maxWidth }) =>
    maxWidth &&
    `
  max-width: ${maxWidth}px;

  `}
  display: flex;
  flex-direction: row;
  align-self: center;
  flex: 1;
  padding: 12px;
`;

export const LeftPaneRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 22px 0;
  border-bottom: 1px solid ${smColors.borderGray};
  width: inherit;
  height: 62px;
`;

export const BottomPaddedRow = styled(LeftPaneRow)`
  padding-top: 0;
  padding-bottom: 72px;
`;

export const ItemTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
`;

export const ItemTextWrapperUniformPadding = styled.div`
  padding: 10px;
`;

export const LinkTextWrapper = styled.div`
  padding: 10px;
`;

export const ItemText = styled(BaseText)`
  color: ${smColors.black};
`;

export const CenterTextWrapper = styled.div`
  /* flex: 1; */
  display: flex;
  flex-direction: column;
  align-self: center;
`;
export const BottomLinksWrapper = styled.div``;
