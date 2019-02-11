/* eslint-disable import/no-extraneous-dependencies */
const blacklist = require('metro-config/src/defaults/blacklist');

module.exports = {
    resolver: {
        blacklistRE: blacklist([/react-native\/local-cli\/core\/__fixtures__.*/]),
        sourceExts: process.env.RN_SRC_EXT ? process.env.RN_SRC_EXT.split(',') : ['js']
    }
};
