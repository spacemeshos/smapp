import React from 'react';
import WriteFilePermissionError from './screens/modal/WriteFilePermissionError';
import NoInternetConnection from './screens/modal/NoInternetConnection';
import CloseAppModal from './components/common/CloseAppModal';
import PoSProvingOptsUpdateWarningModal from './screens/modal/PoSProvingOptsUpdateWarningModal';
import AutoLaunchErrorModal from './screens/modal/AutoLaunchErrorModal';
import PromptModal from './screens/modal/PromptModal';
import CannotFetchConfigsError from './screens/modal/CannotFetchConfigsError';

export default () => (
  <>
    <CannotFetchConfigsError />
    <WriteFilePermissionError />
    <NoInternetConnection />
    <CloseAppModal />
    <PoSProvingOptsUpdateWarningModal />
    <AutoLaunchErrorModal />
    <PromptModal />
  </>
);
