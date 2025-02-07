/* eslint-disable no-undef */

const serverless = require('serverless-http');
const init = require('index.js')

let handler;

module.exports.handler = async (req, res) => {
    if (!handler) {
      const server = await init();
      handler = serverless(server.listener);
    }
    return handler(req, res);
  };