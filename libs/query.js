const { NCMBObject } = require('./object');

class Query {
  constructor(ncmb, name) {
    this.ncmb = ncmb;
    this.className = name;
    this.queries = {}
  }
  where(params) {
    this.queries.where = params;
    return this;
  }
  limit(number) {
    this.queries.limit = number;
    return this;
  }
  offset(number) {
    this.queries.offset = number;
    return this;
  }
  async fetchAll() {
    return await this.ncmb.request.get(this.className, this.queries);
  }
  async fetch() {
    return await this.fetchAll()[0];
  }
}

exports.Query = Query;