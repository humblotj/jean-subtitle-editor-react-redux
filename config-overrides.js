/* config-overrides.js */
const { useBabelRc, override } = require("customize-cra");

const rewireReactHotLoader = require("react-app-rewire-hot-loader");
const hotLoader = () => (config, env) => {
    config = rewireReactHotLoader(config, env)

    config.resolve.alias = {
        ...config.resolve.alias,
        'react-dom': '@hot-loader/react-dom'
    }

    return config
  }

module.exports = override(hotLoader());
