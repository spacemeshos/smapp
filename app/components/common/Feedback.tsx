import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Button, Link, Tooltip } from '../../basicComponents';
import { captureReactMessage, captureReactUserFeedback } from '../../sentry';
import { smColors } from '../../vars';
import { ExternalLinks } from '../../../shared/constants';
import CopyButton from '../../basicComponents/CopyButton';
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

const ActualInput = styled((props) => <input {...props} />) <{
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

const fadeInOut = keyframes`
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
`;

const CopiedBanner = styled.div`
  position: absolute;
  z-index: 10;
  line-height: 1.466;
  color: ${smColors.darkerGreen};
  animation: 3s ${fadeInOut} ease-out;
`;

const ErrorIdentifier = styled.div<{ isCopied: boolean }>`
  align-self: center;
  line-height: 1.466;
  cursor: inherit;
  white-space: nowrap;

  span {
    visibility: ${(props) => props.isCopied && 'hidden'};
  }
`;

const IdentifierSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  align-items: center;
`;

const CopySection = styled.div`
  display: flex;
  border-radius: 10px;
  padding: 10px;
  background-color: ${smColors.black80Alpha2};
`;

const IssueDescriptionSection = styled.div`
  display: flex;
  align-items: center;
`;

interface FormFields {
  name: string;
  email: string;
  comments: string;
  title: string;
}

const DESCRIPTION_PLACEHOLDER = ``;

const FORM_ERRORS: Partial<FormFields> = {
  name: 'Your Discord handle or name should not be empty',
  email: 'Email should be valid',
  comments: 'Steps to reproduce should not be empty',
};

const REGULAR_EXP_FOR_EMAIL_CHECK = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

const FeedbackButton = () => {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [
    uniqIdentifierForSuccessDialog,
    setUniqIdentifierForSuccessDialog,
  ] = useState('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [userData, setUserData] = useState<FormFields>({
    name: '',
    email: '',
    comments: '',
    title: '',
  });
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    comments: '',
    title: '',
  });

  const resetForm = () =>
    setUserData({
      name: '',
      email: '',
      comments: DESCRIPTION_PLACEHOLDER,
      title: '',
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
    // Add validation for comments
    if (!userData.comments.trim() || userData.comments.trim().length < 15) {
      errors['comments'] = 'Description must be at least 15 characters long';
    }
    setFieldErrors(errors as FormFields);
    return !Object.values(errors).some((error) => error);
  };

  const handleReport = () => {
    if (!validate()) {
      return;
    }

    const formData = {
      event_id: captureReactMessage(`
           User has submitted an issue and asked to check it. Discord handle: ${userData.name} and email: ${userData.email}, 
         `),
      ...userData,
    };

    captureReactUserFeedback(formData);
    resetForm();
    setShowReportDialog(false);
    setUniqIdentifierForSuccessDialog(formData.event_id);
  };

  const handleCloseSuccessMessageModal = () => {
    setUniqIdentifierForSuccessDialog('');
  };

  const openDiscord = () => window.open(ExternalLinks.Discord);

  return (
    <Container>
      {uniqIdentifierForSuccessDialog && (
        <Modal header="The report was sent" indicatorColor={smColors.green}>
          <SuccemssMessage>
            Thank you for the report! The Spacemesh team will investigate it.
            They may ask you to provide more details via email you have
            specified.
            <br />
            <br />
            <IdentifierSection>
              <IssueDescriptionSection>
                Issue ID
                <Tooltip
                  width={140}
                  text="You can copy and share it with the Spacemesh team."
                />
                :
              </IssueDescriptionSection>
              <CopySection>
                <ErrorIdentifier isCopied={isCopied}>
                  {isCopied && <CopiedBanner>Copied</CopiedBanner>}
                  <span>{uniqIdentifierForSuccessDialog}</span>
                </ErrorIdentifier>
                <CopyButton
                  onClick={(val) => setIsCopied(Boolean(val))}
                  value={uniqIdentifierForSuccessDialog}
                />
              </CopySection>
            </IdentifierSection>
            <br />
            <Link
              onClick={openDiscord}
              text="Join Our Discord Community"
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
            <InputWrapper label="Your Discord handle or name" required>
              <ActualInput
                value={userData.name}
                type="text"
                required
                placeholder="nickname"
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
            <InputWrapper label="Title" required>
              <ActualInput
                value={userData.title}
                type="text"
                placeholder="Clear and concise description of the issue"
                onChange={(e: any) =>
                  setUserData((userData) => ({
                    ...userData,
                    additionalInfo: e.target.value,
                  }))
                }
              />
            </InputWrapper>
            <InputWrapper label="Details" required>
              <StyledTextArea
                value={userData.comments}
                required
                placeholder="Provide clear steps to reproduce the issue, including expected and actual behaviors."
                onChange={(e: any) =>
                  setUserData((userData) => ({
                    ...userData,
                    comments: e.target.value,
                  }))
                }
              />
            </InputWrapper>
            {Boolean(fieldErrors.comments) && (
              <ErrorMessage>{fieldErrors.comments}</ErrorMessage>
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
