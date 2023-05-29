import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { Button, Link } from '../../basicComponents';
import { captureReactException, captureReactMessage } from '../../sentry';
import Loader from '../../basicComponents/Loader';
import { smColors } from '../../vars';
import { ExternalLinks } from '../../../shared/constants';
import Modal from './Modal';
import BackButton from './BackButton';

const Container = styled.div`
  padding: 4px 12px;
  display: flex;
  margin-left: auto;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const ReportButton = styled.div`
  font-size: 12px;
  text-decoration: underline;
  border: 0;
  color: ${({ theme }) => theme.color.gray};
  cursor: pointer;
  user-select: none;
`;

const Label = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => theme.color.contrast};
`;

const Star = styled((props) => <span {...props}> *</span>)`
  color: ${({ theme }) => theme.popups.states.error.backgroundColor};
  position: relative;
  bottom: 4px;
  > * {
    position: absolute;
  }
`;

const InputWrapper = styled(
  (props: { children?: any; label: string; required?: boolean }) => (
    <div {...props}>
      <Label>
        {props.label}
        {props.required && <Star />}
      </Label>
      {props.children}
    </div>
  )
)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
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

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.error};
  margin-top: -16px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const SuccemssMessage = styled.span`
  color: ${({ theme }) => theme.color.contrast};
  margin-bottom: 20px;
  font-size: 14px;
`;

const ActualInput = styled((props) => <input {...props} />)<{
  value?: string;
  onKeyPress?: (event: any) => void;
  onChange: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  isDisabled?: any;
  iconRight?: string;
}>`
  flex: 1;
  width: 100%;
  height: 38px;
  padding: 8px 10px;
  transition: background-color 100ms linear, border-color 100ms linear;

  color: ${({
    theme: {
      form: {
        input: { states },
      },
    },
  }) => states.normal.color};
  background-color: ${({
    theme: {
      form: {
        input: { states },
      },
    },
  }) => states.normal.backgroundColor};
  ${({
    theme: {
      form: {
        input: { states },
      },
    },
  }) =>
    css`
      &:hover,
      &:focus,
      &:active {
        background-color: ${states.focus.backgroundColor};
        color: ${states.focus.color};
      }
    `}
  font-size: 14px;
  line-height: 16px;
  outline: none;
  cursor: text;
  ${({ theme: { form } }) => css`
    border-radius: ${form.input.boxRadius}px;
  `}
`;

const StyledTextArea = styled((props) => <textarea {...props} rows={10} />)`
  display: flex;
  flex-direction: column;
  resize: none;
  flex: 1;
  padding: 8px 10px;
  border-radius: 0;
  transition: background-color 100ms linear, border-color 100ms linear;
  font-size: 14px;
  line-height: 16px;
  outline: none;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'text')};
  ${({ theme: { form } }) => `
  border-radius: ${form.input.boxRadius}px;`};
`;

interface FormFields {
  name: string;
  email: string;
  description: string;
}

const sendReport = (name: string, email: string, comments: string) =>
  fetch(
    `https://sentry.io/api/0/projects/${process.env.SENTRY_SLUG}/${process.env.SENTRY_PROJECT_SLUG}/user-feedback/`,
    {
      method: 'POST',
      headers: {
        Authorization: `DSN ${process.env.SENTRY_DSN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_id: captureReactMessage(`
           User has submitted an issue and asked to check it. id: ${uuidv4()}
           ------------------------------------------------------------------
           ${name}
           ------------------------------------------------------------------
           ${email}
           ------------------------------------------------------------------
           ${comments}
           ------------------------------------------------------------------
           `),
        name,
        email,
        comments,
      }),
    }
  );

const DESCRIPTION_PLACEHOLDER = `### Describe the bug

A clear and concise description of what the bug is.

### Steps to reproduce

Try to narrow down your scenario to a minimal working/failing example. That is, if you have a big program causing a problem, start with deleting parts not relevant to the issue and observing the result: is the problem still there? Repeat until you get the most straightforward sequence of steps to reproduce the problem without any noise surrounding it.

### Expected behavior

What should happen?

### Actual behavior

What’s happening now?
`;

const FORM_ERRORS: Partial<FormFields> = {
  name: 'Your name should not be empty',
  email: 'Email should be valid',
  description: 'Steps to reproduce should not be empty',
};

const REGULAR_EXP_FOR_EMAIL_CHECK = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

const FeedbackButton = () => {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [
    showReportDialogSuccessMessage,
    setShowReportDialogSuccessMessage,
  ] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<FormFields>({
    name: '',
    email: '',
    description: DESCRIPTION_PLACEHOLDER,
  });
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    description: '',
  });

  const resetForm = () =>
    setUserData({
      name: '',
      email: '',
      description: DESCRIPTION_PLACEHOLDER,
    });

  const validate = () => {
    const errors = {};
    Object.keys(fieldErrors).forEach((key) => {
      if (key === 'email' && userData[key]) {
        const isValidEmail = REGULAR_EXP_FOR_EMAIL_CHECK.test(
          userData[key] || ''
        );
        errors[key] = !isValidEmail ? 'Email is not valid' : '';
        return;
      }

      errors[key] = userData[key] === '' ? FORM_ERRORS[key] : '';
    });
    setFieldErrors(errors as FormFields);
    return !Object.values(errors).some((error) => error);
  };

  const handleReport = () => {
    if (validate()) {
      setIsLoading(true);
      sendReport(userData.name, userData.email, userData.description)
        .then(() => {
          resetForm();
          setIsLoading(false);
          setShowReportDialog(false);
          return setShowReportDialogSuccessMessage(true);
        })
        .catch(captureReactException);
    }
  };

  const handleCloseSuccessMessageModal = () => {
    setShowReportDialogSuccessMessage(false);
  };

  const openDiscord = () => window.open(ExternalLinks.DiscordTapAccount);

  if (isLoading) {
    return (
      <Loader
        size={Loader.sizes.SMALL}
        note="We are sending the report. Please wait."
      />
    );
  }

  return (
    <Container>
      {showReportDialogSuccessMessage && (
        <Modal header="The report was sent" indicatorColor={smColors.green}>
          <SuccemssMessage>
            Thanks for the report! Spacemesh team will investigate it and open
            an issue on Github. They may ask you to provide some details via
            email you have specified. You can join our community.
            <br />
            <br />
            <Link
              onClick={openDiscord}
              text="join discord channel"
              style={{ fontSize: 16, lineHeight: '22px' }}
            />
          </SuccemssMessage>
          <Button onClick={handleCloseSuccessMessageModal} text="CLOSE" />
        </Modal>
      )}
      {showReportDialog && (
        <Modal
          header="Report an issue"
          height={580}
          indicatorColor={smColors.red}
        >
          <ModalContainer>
            <InputWrapper label="Name" required>
              <ActualInput
                value={userData.name}
                type="text"
                required
                placeholder="John Doe"
                onChange={(e: any) =>
                  setUserData((userData) => ({
                    ...userData,
                    name: e.target.value,
                  }))
                }
              />
            </InputWrapper>
            {Boolean(fieldErrors.name) && (
              <ErrorMessage>{fieldErrors.name}</ErrorMessage>
            )}
            <InputWrapper label="E-mail" required>
              <ActualInput
                value={userData.email}
                type="email"
                required
                placeholder="john.doe@gmail.com"
                onChange={(e: any) =>
                  setUserData((userData) => ({
                    ...userData,
                    email: e.target.value,
                  }))
                }
              />
            </InputWrapper>
            {Boolean(fieldErrors.email) && (
              <ErrorMessage>{fieldErrors.email}</ErrorMessage>
            )}
            <InputWrapper label="Step to reproduce" required>
              <StyledTextArea
                value={userData.description}
                required
                placeholder={DESCRIPTION_PLACEHOLDER}
                onChange={(e: any) =>
                  setUserData((userData) => ({
                    ...userData,
                    description: e.target.value,
                  }))
                }
              />
            </InputWrapper>
            {Boolean(fieldErrors.description) && (
              <ErrorMessage>{fieldErrors.description}</ErrorMessage>
            )}
          </ModalContainer>
          <BackButton action={() => setShowReportDialog(false)} />
          <Row>
            <Button
              style={{ marginLeft: 'auto' }}
              text="REPORT"
              onClick={handleReport}
            />
          </Row>
        </Modal>
      )}

      <ReportButton
        onClick={() => {
          resetForm();
          setShowReportDialog(true);
        }}
      >
        Report an issue!
      </ReportButton>
    </Container>
  );
};

export default FeedbackButton;
