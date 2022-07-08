import React from 'react';
import styled from 'styled-components';
import { showReportDialog } from '@sentry/browser';
import { captureException, lastEventId } from '@sentry/react';
import { v4 as uuidv4 } from 'uuid';
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
`;

const FeedbackButton = () => {
  return (
    <Container>
      <Button
        onClick={() => {
          captureException(`client_report_${uuidv4()}`);
          showReportDialog({ eventId: lastEventId() });
        }}
      >
        Report an issue!
      </Button>
    </Container>
  );
};

export default FeedbackButton;
