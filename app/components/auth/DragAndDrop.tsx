import React, { useState, useRef } from 'react';
import styled from 'styled-components';
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
      ? `background-color: rgba(236, 92, 61, 0.1);`
      : `background-color: ${
          isDragging ? `rgba(101, 176, 66, 0.1)` : 'transparent'
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
    if (e.dataTransfer?.files) {
      onFilesAdded({
        fileName: e.dataTransfer.files[0].name,
        filePath: e.dataTransfer.files[0].path,
      });
      setIsDragging(false);
    }
  };

  const onFilesAddedHandler = (e: any) => {
    if (e.target && e.target.files) {
      const {
        target: { files },
      } = e;
      onFilesAdded({ fileName: files[0].name, filePath: files[0].path });
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const openFileDialog = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click();
    }
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
