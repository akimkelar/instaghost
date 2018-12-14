const config = {
    "development": {
        "config_id": "development",
        "clientId": "8e123c1818f448eaa334a7a98683db7d",
        "clientSecret": "d4c7ed55a4bd4736868d0fbeb5028fc8",
        // "accessToken": "907798820.8e123c1.06b6e7fdd1a54eebbc2bc8dfabd58baa"
    },
    "testing": {
        "config_id": "testing"
    },
    "staging": {
        "config_id": "staging"
    },
    "production": {
        "config_id": "production"
    }
};

const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = Object.assign(defaultConfig, environmentConfig);

module.exports = finalConfig;
