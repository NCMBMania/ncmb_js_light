const fetch = require('node-fetch');

class Request {
  constructor(ncmb) {
    this.ncmb = ncmb;
  }
  
  async get(className, queries = {}) {
    const result = await this.exec('GET', className, queries);
    return result.results.map(o => {
      const obj = new this.ncmb.NCMBObject(this.ncmb, className);
      obj.sets(o);
      return obj;
    });
  }
  
  async post(className, data) {
    return await this.exec('POST', className, {}, data);
  }
  
  async put(className, data, objectId) {
    return await this.exec('PUT', className, {}, data, objectId);
  }
  
  data(data) {
    delete data.createDate;
    delete data.updateDate;
    delete data.objectId;
    return JSON.stringify(data);
  }
  
  async exec(method, className, queries, data = null, objectId = null) {
    const time = (new Date).toISOString()
    const sig = this.ncmb.signature.create(method, time, className, queries, objectId);
    const headers = {
      'X-NCMB-Signature': sig,
      'Content-Type': 'application/json'
    };
    headers[this.ncmb.applicationKeyName] = this.ncmb.applicationKey;
    headers[this.ncmb.timestampName] = time;
    
    const res = await fetch(this.ncmb.url(className, queries, objectId), {
      method: method,
      headers: headers,
      body: ['POST', 'PUT'].indexOf(method) > -1 ? this.data(data) : null
    });
    const json = await res.json();
    if (json.code) throw new Error(json.error);
    return json;
  }
}

exports.Request = Request;
