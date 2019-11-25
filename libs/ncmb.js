const { Query } = require('./query');
const { Signature } = require('./signature');
const { NCMBObject } = require('./object');
const { Request } = require('./request');

class NcmbDS {
  constructor(applicationKey, clientKey) {
    this.applicationKey = applicationKey;
    this.clientKey = clientKey;
    this.fqdn = 'mbaas.api.nifcloud.com';
    this.version = '2013-09-01';
    this.signature = new Signature(this, applicationKey, clientKey);
    this.applicationKeyName = 'X-NCMB-Application-Key';
    this.timestampName = 'X-NCMB-Timestamp';
    this.NCMBObject = NCMBObject;
    this.request = new Request(this);
  }
  Object(name) {
    return new this.NCMBObject(this, name);
  }
  Query(name) {
    return new Query(this, name);
  }
  path(className, objectId = null) {
    return `/${this.version}/classes/${className}/${objectId || ''}`;
  }
  url(className, queries = {}, objectId = null) {
    const query = Object.keys(queries).sort().map(k => `${k}=${encodeURI(JSON.stringify(queries[k]))}`).join('&');
    return `https://${this.fqdn}${this.path(className, objectId)}${query ? '?' + query : ''}`;
  }
}

exports.NcmbDS = NcmbDS;
