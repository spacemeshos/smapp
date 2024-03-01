import React, { useState } from 'react';
import styled from 'styled-components';
import { eventsService } from '../../infra/eventsService';
import SubHeader from '../../basicComponents/SubHeader';
import { Button, Link } from '../../basicComponents';
import { ExternalLinks } from '../../../shared/constants';
import { smColors } from '../../vars';
import Modal from './Modal';
import BackButton from './BackButton';

const Container = styled.div`
  padding: 4px 12px;
  display: flex;
  margin-left: auto;
`;

const ReportButton = styled.div`
  font-size: 12px;
  text-decoration: underline;
  border: 0;
  color: ${({ theme }) => theme.color.gray};
  cursor: pointer;
  user-select: none;
`;

const Message = styled.span`
  color: ${({ theme }) => theme.color.contrast};
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 25px;
  padding-right: 40px;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;
  border-top: 1px solid ${({ theme }) => theme.color.contrast};
  padding-top: 16px;
  margin-top: 8px;
`;

const FeedbackButton = () => {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const openDiscord = () => window.open(ExternalLinks.Discord);
  const openGitHub = () => window.open(ExternalLinks.GithubSMAppIssuePage);

  const openLogFile = () => {
    eventsService.showFileInFolder({ isLogFile: true });
  };

  return (
    <Container>
      {showReportDialog && (
        <Modal
          header="Help Improve Smapp"
          height={450}
          width={600}
          indicatorColor={smColors.red}
        >
          <ModalContainer>
            <SubHeader>
              ENCOUNTERED AN ISSUE OR HAVE A BRILLIANT IDEA?
            </SubHeader>
            <Message>
              <Link
                onClick={openGitHub}
                text="SHARE IT WITH US!"
                style={{
                  fontSize: 16,
                  lineHeight: '20px',
                  paddingBottom: 20,
                }}
              />
              Including your logs wiil help us understand better and act faster.{' '}
              <Link
                onClick={openLogFile}
                text="Your log files are here."
                style={{ fontSize: 14, display: 'inline' }}
              />
              <br />
              <br />
              <Link
                onClick={openDiscord}
                text="Join our Discord"
                style={{
                  fontSize: 14,
                  lineHeight: '20px',
                  display: 'inline',
                }}
              />{' '}
              for more information, support, or to share your thoughts with
              fellow Smeshers.
            </Message>
          </ModalContainer>
          <BackButton action={() => setShowReportDialog(false)} />
          <Row>
            <Button
              style={{ marginLeft: 'auto' }}
              text="CLOSE"
              onClick={() => {
                setShowReportDialog(false);
              }}
            />
          </Row>
        </Modal>
      )}
      <ReportButton
        onClick={() => {
          setShowReportDialog(true);
        }}
      >
        Report an issue!
      </ReportButton>
    </Container>
  );
};

export default FeedbackButton;
