export const SET_APP_LATEST_VERSION = 'SET_APP_LATEST_VERSION';

export const setLatestVersion = (version: string) => ({ type: SET_APP_LATEST_VERSION, payload: version });
