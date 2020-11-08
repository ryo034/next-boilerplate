/* eslint-disable no-param-reassign */
import { resolve } from 'path';
import withSass from '@zeit/next-sass';

export default withSass({
  webpack: (config) => {
    config.resolve.alias['@'] = resolve(__dirname);
    return config;
  },
  env: {
    // Reference a variable that was defined in the .env file and make it available at Build Time
    TEST_VAR: process.env.TEST_VAR
  },
  cssModules: true
});
