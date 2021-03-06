'use strict';

const SERVERLESS_FILE_PATH = '/twilio/sync/list/get';

/**
 * Twilio calls this method
 * @param {Object} context 
 * @param {Object} event 
 * @param {Function} callback
 * @returns {Object} 
 */
exports.handler = async (context, event, callback) => {
  try {
    const {ACCOUNT_SID, AUTH_TOKEN} = context;
    const twilioClient = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
    const serverlessHelper = loadServerlessModules(context, event);
    const result = await driver(context, event, serverlessHelper, twilioClient);
    return callback(null, result);
  } catch(e) {
    return callback(e);
  }
};

/**
 * Loads up related helper methods.
 */
const loadServerlessModules = (serverlessContext, serverlessEvent) => {
  try {
    const functions = Runtime.getFunctions();
    const serverlessHelperPath = functions['business-card/helpers/index'].path;
    const serverlessHelper = require(serverlessHelperPath).Helpers;
    return new serverlessHelper(serverlessContext, serverlessEvent);
  } catch (e) {
    throw e;
  }
}

/**
 * Main Driver of the Twilio Serverless Function
 * @param {Object} serverlessContext 
 * @param {Object} serverlessEvent 
 * @param {Object} serverlessHelper 
 * @param {Object} twilioClient 
 * @returns {Object}
 */
const driver = async (serverlessContext, serverlessEvent, serverlessHelper, twilioClient) => {
  try {
    const {SYNC_SERVICE_SID} = serverlessContext;
    const {listName, payload} = serverlessEvent;

    const shouldListCreate = (serverlessEvent.shouldListCreate === true) ?
      true : false;

    // Insert in Sync List Item
    const result = await serverlessHelper.
      sync.
      createListItem(twilioClient, SYNC_SERVICE_SID, listName, payload, shouldListCreate);
    return result;
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'driver', e);
  }
}