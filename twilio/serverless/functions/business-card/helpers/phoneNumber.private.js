class PhoneNumberHelper {
  constructor(logger) {
    this.logger = logger;
  }
  
  async getLocalPhoneNumber (twilioClient, isoCountry, params) {
    const phoneNumbers = await twilioClient.availablePhoneNumbers(isoCountry)
      .local
      .list(params);
    return phoneNumbers;
  }

  async getTollFreeNumber (twilioClient, isoCountry, params) {
    const phoneNumbers = twilioClient.availablePhoneNumbers(isoCountry)
      .tollFree
      .list(params);
    return phoneNumbers;
  }

  async buyPhoneNumber (twilioClient, phoneNumber) {
    const boughtPhoneNumber = await twilioClient.incomingPhoneNumbers
      .create({phoneNumber});
    
    return boughtPhoneNumber;
  }

  /**
   * This function allows you to buy multiple phone numbers in one call.
   * @param {Object} twilioClient Instance of a Twilio Client.
   * @param {String} type Type of Phone Number. It can be either 'local' or 'toll-free'. Default value is 'local'.
   * @param {String} isoCountry The ISO country code of this phone number. Default value is 'US'.
   * @param {Integer} howMany How many phone do you want to buy? Default value is 1.
   */
  async buyPhoneNumbers (twilioClient, type=local, isoCountry=US, howMany=1) {
    const boughtPhoneNumbers = [];

    while(boughtPhoneNumbers.length < howMany) {
      const params = {
        limit: howMany - boughtPhoneNumbers.length
      };

      try {
        const phoneNumbers = type === 'local' ? 
          await this.getLocalPhoneNumber(twilioClient, isoCountry, params) : 
          await this.getTollFreeNumber(twilioClient, isoCountry, params);
        
        this.logger.info(`phoneNumbers: ${JSON.stringify(phoneNumbers)}`);
        
        for(const aPhoneNumber of phoneNumbers) {
          try {
            this.logger.info(`aPhoneNumber: ${JSON.stringify(aPhoneNumber)}`);
            const boughtPhoneNumber = await this.buyPhoneNumber(twilioClient, aPhoneNumber.phoneNumber);
            boughtPhoneNumbers.push(boughtPhoneNumber);
          } catch (e) {
            this.logger.error(`An error has occur when buying a phone number. \n Error Message: ${e}`);
          }
        }
      } catch(e) {
        // Log the error
        this.logger.error(`An error has occur when searching for some phone numbers. \n Error Message: ${e}`);
      }
    }
    return boughtPhoneNumbers;
  }
}

/** @module PhoneNumberHelper */
module.exports = {
  PhoneNumberHelper,
};