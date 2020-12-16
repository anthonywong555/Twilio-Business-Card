class SyncHelper {
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * @param {twilio.Client} twilioClient
   * @param {string} serviceSid
   * @param {string} uniqueName
   * @returns {Promise}
   */
  async fetchDocument(twilioClient, serviceSid, uniqueName) {
    return twilioClient.sync.services(serviceSid).documents(uniqueName).fetch();
  }

  /**
   * @param {twilio.Client} twilioClient
   * @param {string} serviceSid
   * @param {string} uniqueName
   * @param {Object} data
   * @param {number} [3600] ttl - Time To Live
   * @returns {Promise}
   */
  async createDocument(twilioClient, serviceSid, uniqueName, data, ttl = 3600) {
    return twilioClient.sync.services(serviceSid).documents.create({
      data,
      ttl,
      uniqueName,
    });
  }

  /**
   * @param {twilio.Client} twilioClient
   * @param {string} serviceSid
   * @param {string} uniqueName
   * @param {Object} data
   * @returns {Promise}
   */
  async updateDocument(twilioClient, serviceSid, uniqueName, data) {
    return twilioClient.sync.services(serviceSid).documents(uniqueName).update({
      data,
    });
  }
}

/** @module syncHelper */
module.exports = {
  SyncHelper,
};