import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from '/basicComponents';
import { smColors } from '/vars';
import { upload, incorrectFile } from '/assets/images';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  border: 1px dashed ${smColors.darkGray};
  border-radius: 2px;
  ${({ isDragging, hasError }) => (hasError ? `background-color: rgba(236, 92, 61, 0.1);` : `background-color: ${isDragging ? `rgba(101, 176, 66, 0.1)` : smColors.lightGray}`)}
`;

const MsgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  width: 32px;
  height: 26px;
  margin-bottom: 10px;
`;

const Text = styled.span`
  font-size: 15px;
  line-height: 17px;
  color: ${smColors.realBlack};
  margin-bottom: 10px;
`;

type Props = {
  onFilesAdded: Function,
  fileName: string,
  hasError: boolean
};

type State = {
  isDragging: boolean
};

class DragAndDrop extends Component<Props, State> {
  fileInputRef: Object;

  constructor(props: Object) {
    super(props);
    this.state = { isDragging: false };
    this.fileInputRef = React.createRef();
  }

  render() {
    const { fileName, hasError } = this.props;
    const { isDragging } = this.state;
    return (
      <Wrapper onDragOver={this.onDragOver} onDragLeave={this.onDragLeave} onDrop={this.onDrop} isDragging={isDragging} hasError={hasError}>
        <input ref={this.fileInputRef} type="file" onChange={this.onFilesAdded} style={{ display: 'none' }} />
        <MsgWrapper>
          {!fileName && <Image src={hasError ? incorrectFile : upload} />}
          <Text>{hasError ? 'incorrect file' : fileName || 'drag & drop'}</Text>
          <Link onClick={this.openFileDialog} text={hasError ? 'click to browse again' : 'or browse for another file' || 'Or click to browse computer'} />
        </MsgWrapper>
      </Wrapper>
    );
  }

  onDrop = (e: Event) => {
    const { onFilesAdded } = this.props;
    e.preventDefault();
    const { files } = e.dataTransfer;
    onFilesAdded({ fileName: files[0].name, filePath: files[0].path });
    this.setState({ isDragging: false });
  };

  onFilesAdded = (e: Event) => {
    const { onFilesAdded } = this.props;
    const { files } = e.target;
    onFilesAdded({ fileName: files[0].name, filePath: files[0].path });
  };

  onDragOver = (e: Event) => {
    e.preventDefault();
    this.setState({ isDragging: true });
  };

  onDragLeave = () => {
    this.setState({ isDragging: false });
  };

  openFileDialog = () => {
    this.fileInputRef.current.click();
  };
}

export default DragAndDrop;
