import React, { useState } from 'react';
import styled from 'styled-components';
import { showReportDialog } from '@sentry/browser';
import { v4 as uuidv4 } from 'uuid';
import { captureMessage } from '@sentry/minimal';
import { smColors } from '../../vars';
import { Loader } from '../../basicComponents';

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

const FeedbackButton = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <Loader
        size={Loader.sizes.SMALL}
        isDarkMode={isDarkMode}
        note="Report dialog is loading"
      />
    );
  }

  return (
    <Container>
      <Button
        onClick={() => {
          setIsLoading(true);
          showReportDialog({
            eventId: captureMessage(`${uuidv4()}-user-feedback`),
            onLoad() {
              setIsLoading(false);
            },
          });
        }}
      >
        Report an issue!
      </Button>
    </Container>
  );
};

export default FeedbackButton;
