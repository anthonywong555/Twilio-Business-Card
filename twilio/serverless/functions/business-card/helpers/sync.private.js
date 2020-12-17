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

  /**
   * Insert a Sync List Item in a Sync List.
   * @param {Object} twilioClient 
   * @param {String} serviceSid Sync Service SID 
   * @param {String} listUniqueName Sync List Unique Name
   * @param {Object} data
   * @param {Boolean} shouldListCreate If no sync list found, it will create the sync list. Default is false. 
   */
  async insertSyncListItem(twilioClient, serviceSid, listUniqueName, data, shouldListCreate=false) {
  try {
    try {
      const result = await twilioClient.sync
        .services(serviceSid)
        .syncLists(listUniqueName)
        .syncListItems
        .create({data});
      return result;
    } catch(e) {
      if(e.message === `The requested resource /Services/${serviceSid}/Lists/${listUniqueName}/Items was not found` && shouldListCreate) {
        // Create the sync list
        await twilioClient.sync
          .services(serviceSid)
          .syncLists
          .create({
            uniqueName: listUniqueName
          });
        // Reinsert the sync list item.
        const result = await this.insertSyncListItem(twilioClient, serviceSid, listUniqueName, data);
        return result;
      } else {
        throw e;
      }
    }
  } catch(e) {
    throw e;
  }
}
}

/** @module syncHelper */
module.exports = {
  SyncHelper,
};