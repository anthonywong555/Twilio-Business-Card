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
   * Upsert a Sync Map Item in a Sync Map.
   * @param {Object} twilioClient 
   * @param {String} serviceSid Sync Service SID 
   * @param {String} mapUniqueName Sync Map Unique Name
   * @param {Object} payload {key, data}
   * @param {Boolean} shouldMapCreate If no map found, it will create the map. Default is false. 
   */
  async upsertMapItem(twilioClient, serviceSid, mapUniqueName, payload, shouldMapCreate=false) {
    try {
      const result = await twilioClient.sync
      .services(serviceSid)
      .syncMaps(mapUniqueName)
      .syncMapItems
      .create({...payload});
      return result;
    } catch(e) {
      if(e.message === `An Item with given key already exists in the Map`) {
        // Update the Map Item.
        const {key, data} = payload;
        const result = await twilioClient.sync
        .services(serviceSid)
        .syncMaps(mapUniqueName)
        .syncMapItems(key)
        .update({data});
        return result;
      } else if(e.message === `The requested resource /Services/${serviceSid}/Maps/${mapUniqueName}/Items was not found` && shouldMapCreate) {
        // Create the sync map
        await twilioClient.sync
        .services(serviceSid)
        .syncMaps
        .create({
          uniqueName: mapUniqueName
        });
        // Reinsert the sync map item.
        const result = await this.upsertMapItem(twilioClient, serviceSid, mapUniqueName, payload, shouldMapCreate);
        return result;
      }
      throw e;
    }
  }

  /**
   * Insert a Sync List Item in a Sync List.
   * @param {Object} twilioClient 
   * @param {String} serviceSid Sync Service SID 
   * @param {String} listUniqueName Sync List Unique Name
   * @param {Object} payload {data}
   * @param {Boolean} shouldListCreate If no list found, it will create the list. Default is false. 
   */
  async createListItem(twilioClient, serviceSid, listUniqueName, payload, shouldListCreate=false) {
    try {
      try {
        const result = await twilioClient.sync
          .services(serviceSid)
          .syncLists(listUniqueName)
          .syncListItems
          .create({
            data: payload
          });
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
          const result = await this.createListItem(twilioClient, serviceSid, listUniqueName, payload, shouldListCreate);
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