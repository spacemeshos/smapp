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

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 100%;
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
  min-height: 480px;
  max-height: 75%;
  border: 1px solid ${smColors.borderGray};
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

export const RightHeaderWrapper = styled.div`
  padding: 0 12px 12px 12px;
`;

export const LeftHeaderWrapper = styled.div`
  padding: 12px 0;
  margin-top: 12px;
`;

export const RightHeaderText = styled.span`
  font-size: 14px;
  font-weight: bold;
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

export const SemiBoldText = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

export const ActionLink = styled(BaseText)`
  user-select: none;
  color: ${smColors.green};
  cursor: pointer;
  ${Actionable}
`;

// $FlowStyledIssue
export const BaseImage = styled.img`
  width: ${({ width }) => width || 42}px;
  height: ${({ height }) => height || 42}px;
`;

export const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const LeftPaneRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 22px 0;
  border-bottom: 1px solid ${smColors.borderGray};
  height: 62px;
`;

export const BorderlessLeftPaneRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 12px 0;
`;

export const LogRow = styled(LeftPaneRow)`
  border-bottom: none;
  height: 100%;
  max-height: 200px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

export const LogRowInner = styled.div`
  height: 100%;
  width: 100%;
`;

export const LoadingRow = styled(LeftPaneRow)`
  padding-top: 0;
  margin-bottom: 54px;
  padding-bottom: 72px;
`;

export const StatusSection = styled.div`
  margin-bottom: 54px;
  height: 100%;
`;

export const LogSection = styled.div`
  height: 100%;
`;

export const StatusRowSection = styled.div`
  width: 50%;
`;

export const LogRowSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const LogEntryWrapper = styled.div`
  height: 44px;
  line-height: 44px;
`;

// $FlowStyledIssue
export const LogEntry = styled(BaseText)`
  color: ${({ reward }) => (reward ? smColors.green : smColors.black)};
`;

export const SideLabelWrapper = styled.div`
  height: 44px;
  line-height: 44px;
  padding-left: 24px;
`;

export const GrayTextWrapper = styled.div`
  min-height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ItemTextWrapper = styled.div`
  padding: 10px 30px;
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

export const CenterTextWrapper = styled.div``;
export const BottomLinksWrapper = styled.div``;

export const FullNodeHeaderText = styled.span`
  font-size: 31px;
  font-weight: bold;
  color: ${smColors.darkGrayText};
`;
