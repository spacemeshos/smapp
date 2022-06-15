const target = "web";

module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5",
  },
  managerWebpack(config) {
    config.target = target;
    return config;
  },
  webpackFinal(config, { configType }) {
    config.target = target;
    return config;
  },
};
