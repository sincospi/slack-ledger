const yamlConfig = require('node-yaml-config');

if (process.env.NODE_ENV) {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
} else {
  throw new Error('process.env.NODE_ENV is not defined!');
}

const envVariables = yamlConfig.load('./env.yaml', process.env.NODE_ENV);
console.log(envVariables);

Object.keys(envVariables).forEach(k => {
  if (!process.env[k]) {
    process.env[k] = envVariables[k];
  }
});
