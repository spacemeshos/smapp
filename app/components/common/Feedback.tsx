import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Button, Loader } from '../../basicComponents';
import Modal from './Modal';
import BackButton from './BackButton';

const Container = styled.div`
  padding: 4px 12px;
  bottom: 10px;
  display: flex;
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

const ActualInput = styled((props) => <input {...props} />)<{
  value?: string;
  onKeyPress?: (event: any) => void;
  onChange: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  isDisabled?: any;
  iconRight?: string;
  isError?: boolean;
}>`
  flex: 1;
  width: 100%;
  height: 38px;
  padding: 8px 10px;
  transition: background-color 100ms linear, border-color 100ms linear;
  ${({ theme, isError }) =>
    isError
      ? css`
          border: 2px solid ${theme.form.input.states.error.borderColor};
          margin: 0;
        `
      : css`
          border: none;
          margin: 2px 0;
        `}

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

const StyledTextArea = styled((props) => <textarea {...props} rows={4} />)`
  display: flex;
  flex-direction: column;
  resize: none;
  flex: 1;
  height: 38px;
  padding: 8px 10px;
  border-radius: 0;
  transition: background-color 100ms linear, border-color 100ms linear;
  font-size: 14px;
  line-height: 16px;
  outline: none;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'text')};
  ${({ theme: { form } }) => `
  border-radius: ${form.input.boxRadius}px;`};

  ${({ theme, isError }) =>
    isError
      ? css`
          border: 2px solid ${theme.form.input.states.error.borderColor};
          margin: 0;
        `
      : css`
          border: none;
          margin: 2px 0;
        `}
`;

const UploadIcon = styled.img.attrs((props) => ({
  src: props.theme.icons.uploadingContrast,
}))`
  margin-left: auto;
`;

const UploadField = styled((props) => {
  const onFilesAddedHandler = (e: any) => {
    e.preventDefault();
  };

  return (
    <div {...props}>
      <div>
        <UploadIcon />
      </div>
      <input type="file" onChange={onFilesAddedHandler} />
    </div>
  );
})`
  position: relative;
  display: flex;

  height: 38px;
  font-size: 14px;
  line-height: 16px;

  && {
    > div {
      display: flex;
      padding: 8px 10px;

      flex: 1;
      width: 100%;
      outline: none;
      ${({ theme: { form } }) => css`
        border-radius: ${form.input.boxRadius}px;
      `}
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
    }
    input {
      position: absolute;
      display: flex;
      width: 100%;
      height: 38px;
      opacity: 0;
      cursor: pointer;
    }
  }
`;

const FeedbackButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const [userData, setUserData] = useState<{
    name?: string;
    email?: string;
    description?: string;
  }>({});
  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    email: false,
    description: false,
  });

  if (isLoading) {
    return <Loader size={Loader.sizes.SMALL} note="Report dialog is loading" />;
  }

  const validate = () => {
    Object.keys(fieldErrors).forEach((key) => {
      setFieldErrors((errors) => ({ ...errors, [key]: !userData[key] }));
    });
    return !Object.values(fieldErrors).some((error) => error);
  };

  const handleReport = () => {
    if (validate()) {
      // eslint-disable-next-line no-console
      console.log('userData!', userData);
    }
  };

  return (
    <Container>
      {showReportDialog && (
        <Modal header="Report an issue" height={580}>
          <ModalContainer>
            <InputWrapper label="Name" required>
              <ActualInput
                isError={fieldErrors.name}
                value={userData.name}
                onChange={(e: any) =>
                  setUserData((userData) => ({
                    ...userData,
                    name: e.target.value,
                  }))
                }
              />
            </InputWrapper>
            <InputWrapper label="E-mail" required>
              <ActualInput
                isError={fieldErrors.email}
                value={userData.email}
                onChange={(e: any) =>
                  setUserData((userData) => ({
                    ...userData,
                    email: e.target.value,
                  }))
                }
              />
            </InputWrapper>
            <InputWrapper label="Step to reproduce" required>
              <StyledTextArea
                value={userData.description}
                isError={fieldErrors.description}
                onChange={(e: any) =>
                  setUserData((userData) => ({
                    ...userData,
                    description: e.target.value,
                  }))
                }
              />
            </InputWrapper>
            <InputWrapper label="File loader">
              <UploadField />
            </InputWrapper>
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
          setIsLoading(true);
          /*  showReportDialog({
            eventId: captureReactException(`
            User has submitted an issue and asked to check it. id: ${uuid()}
            `),
            onLoad() {
              setIsLoading(false);
            },
          }); */
        }}
      >
        Report an issue!
      </ReportButton>
    </Container>
  );
};

export default FeedbackButton;
