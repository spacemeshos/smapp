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

export type FilesAddedHandler = (file: {
  fileName: string;
  filePath: string;
}) => void;

type Props = {
  onFilesAdded: FilesAddedHandler;
  fileName: string;
  hasError: boolean;
};

const DragAndDrop = ({ onFilesAdded, fileName, hasError }: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files?.length) {
      const { name, path } = files[0];
      onFilesAdded({ fileName: name, filePath: path });
      setIsDragging(false);
    }
  };

  const onFilesAddedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;
    if (files?.length) {
      const { name, path } = files[0];
      onFilesAdded({ fileName: name, filePath: path });
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
    if (fileInputRef?.current) {
      fileInputRef.current.click();
    }
  };

  let preLinkText;
  let linkText;
  let message;

  if (hasError) {
    preLinkText = 'click to';
    linkText = 'browse again';
    message = fileName ? `Incorrect file ${fileName}` : 'Incorrect file';
  } else if (fileName) {
    preLinkText = 'or browse for';
    linkText = 'another file';
    message = fileName;
  } else {
    preLinkText = 'or';
    linkText = 'locate on your computer';
    message = 'Drop a wallet file here,';
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
        {hasError && <Image hasError={hasError} />}
        <Text>{message}</Text>
        <LinkWrapper>
          <Text>{preLinkText}&nbsp;</Text>
          <Link onClick={openFileDialog} text={linkText} />
        </LinkWrapper>
      </MsgWrapper>
    </Wrapper>
  );
};

export default DragAndDrop;
