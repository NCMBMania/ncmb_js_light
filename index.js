const hmacSHA256 = require('crypto-js/hmac-sha256');
const Base64 = require('crypto-js/enc-base64');
const fetch = require('node-fetch');

class NcmbDS {
  constructor(applicationKey, clientKey) {
    this.applicationKey = applicationKey;
    this.clientKey = clientKey;
    this.fqdn = 'mbaas.api.nifcloud.com';
    this.version = '2013-09-01';
    this.signature = new Signature(this, applicationKey, clientKey);
    this.applicationKeyName = 'X-NCMB-Application-Key';
    this.timestampName = 'X-NCMB-Timestamp';
  }
  Query(name) {
    return new Query(this, name);
  }
  path(className) {
    return `/${this.version}/classes/${className}/`;
  }
  url(className) {
    return `https://${this.fqdn}${this.path(className)}`;
  }
}

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
  create(method, time, className, queries = {}) {
    const path = this.ncmb.path(className);
    queries[this.signatureMethodName] = this.signatureMethodValue;
    queries[this.signatureVersionName] = this.signatureVersionValue;
    queries[this.ncmb.applicationKeyName] = this.applicationKey;
    queries[this.ncmb.timestampName] = time;
    const query = Object.keys(queries).sort().map(k => `${k}=${encodeURI(queries[k])}`).join('&');
    const string = [method, this.ncmb.fqdn, path, query].join("\n");
    return Base64.stringify(hmacSHA256(string, this.clientKey));
  }
}

class Query {
  constructor(ncmb, name) {
    this.ncmb = ncmb;
    this.className = name;
    this.queries = {}
  }
  async fetchAll() {
    const time = (new Date).toISOString()
    const sig = this.ncmb.signature.create('GET', time, this.className, this.queries);
    const headers = {};
    headers[this.ncmb.applicationKeyName] = this.ncmb.applicationKey;
    headers[this.ncmb.timestampName] = time;
    headers['X-NCMB-Signature'] = sig;
    headers['Content-Type'] = 'application/json';
    const res = await fetch(this.ncmb.url(this.className, this.queries), {
      headers: headers
    });
    const result = await res.json();
    return result.results.map(o => {
      const obj = new NCMBObject(this.ncmb, this.className);
      obj.sets(o);
      return obj;
    });
  }
}

class NCMBObject {
  constructor(ncmb, name) {
    this.ncmb = ncmb;
    this.className = name;
    this.fields = {};
  }
  sets(obj) {
    for (let k in obj) {
      if (['createDate', 'updateDate'].indexOf(k) > -1) {
        this.fields[k] = new Date(obj[k]);
      } else {
        this.fields[k] = obj[k];
      }
    }
  }
  get(k) {
    return this.fields[k];
  }
}

exports.NcmbDS = NcmbDS;