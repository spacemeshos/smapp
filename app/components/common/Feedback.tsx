import React from 'react';
import styled from 'styled-components';
import { showReportDialog } from '@sentry/browser';
import { v4 as uuidv4 } from 'uuid';
import { captureMessage } from '@sentry/electron';
import { smColors } from '../../vars';

const Container = styled.div`
  padding: 4px 12px;
  bottom: 10px;
  display: flex;
`;

const Button = styled.div`
  font-size: 12px;
  text-decoration: underline;
  border: 0;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.lightGray : smColors.darkGray};
  cursor: pointer;
  user-select: none;
`;

const FeedbackButton = () => {
  return (
    <Container>
      <Button
        onClick={() => {
          showReportDialog({
            eventId: captureMessage(`BugReport_${uuidv4()}`),
          });
        }}
      >
        Report an issue!
      </Button>
    </Container>
  );
};

export default FeedbackButton;
