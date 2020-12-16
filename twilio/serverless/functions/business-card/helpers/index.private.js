'use strict';
const functions = Runtime.getFunctions(); //eslint-disable-line no-undef

class Helpers {
  constructor(context, event) {
    /*
     * Load Logger Helper Methods
     */
    const loggerPath = functions['business-card/helpers/logger'].path;
    const loggerLib = require(loggerPath).LoggerLib;
    this.logger = new loggerLib(context, event);

    /*
     * Load Sync Service Helper Methods
     */
    const syncPath = functions['business-card/helpers/sync'].path;
    const syncLib = require(syncPath).SyncHelper;
    this.sync = new syncLib(this.logger);

    /*
     * Load Twilio Helper Methods
     */
    const twilioPath = functions['business-card/helpers/twilio'].path;
    const twilioLib = require(twilioPath).TwilioHelper;
    this.twilio = new twilioLib(this.logger);

    /*
     * Load Dev Tools Helper Methods
     */
    const devtoolsPath = functions['business-card/helpers/devtools'].path;
    const devtoolsLib = require(devtoolsPath).DevToolsHelper;
    this.devtools = new devtoolsLib(this.logger);
  }
}

/** @module helpers */
module.exports = {
  Helpers,
};