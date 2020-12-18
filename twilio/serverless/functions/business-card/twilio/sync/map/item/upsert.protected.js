'use strict';

const SERVERLESS_FILE_PATH = '/twilio/sync/map/item/create';

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
    const {mapName, payload} = serverlessEvent;

    const shouldMapCreate = (serverlessEvent.shouldMapCreate === true) ?
      true : false;

    // Upsert in Sync Map Item
    const result = await serverlessHelper.
      sync.
      upsertMapItem(twilioClient, SYNC_SERVICE_SID, mapName, payload, shouldMapCreate);
    return result;
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'driver', e);
  }
}