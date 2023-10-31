import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { captureReactBreadcrumb } from '../../sentry';
import { Link } from '../../basicComponents';
import { smColors } from '../../vars';
import { incorrectFile } from '../../assets/images';

const Wrapper = styled.div<{
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  hasError: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  border: 1px dashed ${smColors.darkGray};
  border-radius: 2px;
  ${({ isDragging, hasError }) =>
    hasError
      ? 'background-color: rgba(236, 92, 61, 0.1);'
      : `background-color: ${
          isDragging ? 'rgba(101, 176, 66, 0.1)' : 'transparent'
        }`}
`;

const MsgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img.attrs<{ hasError: boolean }>(
  ({
    theme: {
      icons: { uploading },
    },
    hasError,
  }) => ({ src: hasError ? incorrectFile : uploading })
)<{ hasError: boolean }>`
  width: 32px;
  height: 26px;
  margin-bottom: 10px;
`;

const Text = styled.span`
  font-size: 15px;
  line-height: 17px;
  color: ${({ theme }) => theme.color.contrast};
  margin-bottom: 10px;
`;

const LinkWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

type Props = {
  onFilesAdded: ({
    fileName,
    filePath,
  }: {
    fileName: string;
    filePath: string;
  }) => void;
  fileName: string;
  hasError: boolean;
};

const DragAndDrop = ({ onFilesAdded, fileName, hasError }: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    captureReactBreadcrumb({
      category: 'Drug and drop',
      data: {
        action:
          'Default drop when the dragged content is released on the element',
      },
      level: 'info',
    });

    if (e.dataTransfer?.files) {
      onFilesAdded({
        fileName: e.dataTransfer.files[0].name,
        filePath: e.dataTransfer.files[0].path,
      });
      setIsDragging(false);

      captureReactBreadcrumb({
        category: 'Drug and drop',
        data: {
          action: 'On drop when the dragged content is released on the element',
        },
        level: 'info',
      });
    }
  };

  const onFilesAddedHandler = (e: any) => {
    if (e.target && e.target.files) {
      const {
        target: { files },
      } = e;
      onFilesAdded({ fileName: files[0].name, filePath: files[0].path });
      captureReactBreadcrumb({
        category: 'Drug and drop',
        data: {
          action: 'On files added',
        },
        level: 'info',
      });
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    captureReactBreadcrumb({
      category: 'Drug and drop',
      data: {
        action:
          'On drag over when element where the dragged content will be dropped',
      },
      level: 'info',
    });
  };

  const onDragLeave = () => {
    setIsDragging(false);
    captureReactBreadcrumb({
      category: 'Drug and drop',
      data: {
        action:
          'On drag leave when the element is out of the allowed wrapping zone',
      },
      level: 'info',
    });
  };

  const openFileDialog = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click();
    }
    captureReactBreadcrumb({
      category: 'Drug and drop',
      data: {
        action: 'Open file dialog',
      },
      level: 'info',
    });
  };

  let preLinkText;
  let linkText;
  if (hasError) {
    preLinkText = 'click to';
    linkText = 'browse again';
  } else if (fileName) {
    preLinkText = 'or browse for';
    linkText = 'another file';
  } else {
    preLinkText = 'or';
    linkText = 'locate on your computer';
  }

  return (
    <Wrapper
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      isDragging={isDragging}
      hasError={hasError}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={onFilesAddedHandler}
        style={{ display: 'none' }}
      />
      <MsgWrapper>
        {!fileName && <Image hasError={hasError} />}
        <Text>
          {hasError ? 'incorrect file' : fileName || 'Drop a wallet file here,'}
        </Text>
        <LinkWrapper>
          <Text>{preLinkText}&nbsp;</Text>
          <Link onClick={openFileDialog} text={linkText} />
        </LinkWrapper>
      </MsgWrapper>
    </Wrapper>
  );
};

export default DragAndDrop;
