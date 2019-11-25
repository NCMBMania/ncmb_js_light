const hmacSHA256 = require('crypto-js/hmac-sha256');
const Base64 = require('crypto-js/enc-base64');

class Signature {
  constructor(ncmb, applicationKey, clientKey) {
    this.ncmb = ncmb;
    this.applicationKey = applicationKey;
    this.clientKey = clientKey;
    this.signatureMethodName = 'SignatureMethod';
    this.signatureMethodValue = 'HmacSHA256';
    this.signatureVersionName = 'SignatureVersion';
    this.signatureVersionValue = '2';
  }
  create(method, time, className, queries = {}, objectId = null) {
    const path = this.ncmb.path(className, objectId);
    queries[this.signatureMethodName] = this.signatureMethodValue;
    queries[this.signatureVersionName] = this.signatureVersionValue;
    queries[this.ncmb.applicationKeyName] = this.applicationKey;
    queries[this.ncmb.timestampName] = time;
    const query = Object.keys(queries).sort().map(k => `${k}=${encodeURI(JSON.stringify(queries[k]))}`).join('&');
    const string = [method, this.ncmb.fqdn, path, query].join("\n");
    return Base64.stringify(hmacSHA256(string, this.clientKey));
  }
}

exports.Signature = Signature;