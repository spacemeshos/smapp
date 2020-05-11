// @flow
import { clipboard, shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';
import { WrapperWith2SideBars, Button, Link, SmallHorizontalPanel } from '/basicComponents';
import { smColors } from '/vars';
import { eventsService } from '/infra/evenstService';
import { localStorageService } from '/infra/storageService';

const TextWrapper = styled.div`
  height: 75px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Text = styled.span`
  font-size: 14px;
  line-height: 22px;
`;

const GreenText = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: ${smColors.green};
`;

const MiddleSectionRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const BottomRow = styled(MiddleSectionRow)`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: flex-end;
  justify-content: space-between;
`;

const ButtonsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 18px;
`;

const WordsSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 140px;
  width: 100%;
`;

const WordContainer = styled.div`
  border: 1px dashed ${smColors.darkGray};
  height: 27px;
  width: 155px;
  margin-bottom: 7px;
  border-radius: 5px;
  margin-right: 20px;
  padding-left: 16px;
`;

const IndexWrapper = styled.div`
  width: 20px;
  margin-right: 4px;
  text-align: right;
`;

const Index = styled(Text)`
  color: ${smColors.darkGray};
`;

const WordWrapper = styled.div`
  display: flex;
`;

type Props = {
  history: RouterHistory,
  mnemonic: string
};

type State = {
  isTwelveWordsCopied: boolean
};

class TwelveWordsBackup extends Component<Props, State> {
  twelveWords: Array<string>;

  twelveWordsPrint: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      isTwelveWordsCopied: false
    };
    const { mnemonic } = props;
    this.twelveWords = mnemonic.split(' ');
    this.twelveWordsPrint = '<div>';
    this.twelveWords.forEach((word: string, index: number) => {
      this.twelveWordsPrint += `<h2>${index + 1} ${word}</h2>`;
    });
    this.twelveWordsPrint += '</div>';
  }

  render() {
    const { isTwelveWordsCopied } = this.state;
    return (
      <WrapperWith2SideBars width={920} height={400} header="YOUR 12 WORDS BACKUP">
        <SmallHorizontalPanel />
        <TextWrapper>
          <Text>
            A paper backup is a numbered list of words written down on a paper Write down or print this numbered word list and store the paper in a a safe place, or copy & paste it
            into your password manager
          </Text>
        </TextWrapper>
        <MiddleSectionRow>
          <ButtonsSection>
            <Button onClick={this.print12Words} text="PRINT WORDS" width={172} isPrimary={false} style={{ marginBottom: 12 }} />
            <Button onClick={this.copy12Words} text="COPY WORDS" width={172} isPrimary={false} style={{ marginBottom: 12 }} />
            {isTwelveWordsCopied && <GreenText>Copied to clipboard</GreenText>}
          </ButtonsSection>
          <WordsSection>
            {this.twelveWords.map((word: string, index: number) => (
              <WordWrapper key={word}>
                <IndexWrapper>
                  <Index>{`${index + 1}`}</Index>
                </IndexWrapper>
                <WordContainer>
                  <Text>{word}</Text>
                </WordContainer>
              </WordWrapper>
            ))}
          </WordsSection>
        </MiddleSectionRow>
        <BottomRow>
          <Link onClick={this.openBackupGuide} text="BACKUP GUIDE" />
          <Button onClick={this.navigateToTestMe} text="Next" width={95} />
        </BottomRow>
      </WrapperWith2SideBars>
    );
  }

  navigateToTestMe = () => {
    const { history, mnemonic } = this.props;
    history.push('/main/backup/test-twelve-words-backup', { mnemonic });
    localStorageService.set('hasBackup', true);
  };

  copy12Words = () => {
    const { mnemonic } = this.props;
    clipboard.writeText(mnemonic);
    localStorageService.set('hasBackup', true);
    this.setState({ isTwelveWordsCopied: true });
  };

  print12Words = () => {
    eventsService.print({ content: this.twelveWordsPrint });
    localStorageService.set('hasBackup', true);
  };

  openBackupGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/backup');
}

const mapStateToProps = (state) => ({
  mnemonic: state.wallet.mnemonic
});

TwelveWordsBackup = connect<any, any, _, _, _, _>(mapStateToProps)(TwelveWordsBackup);
export default TwelveWordsBackup;
