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
  set(name, value) {
    this.fields[name] = value;
    return this;
  }
  get(k) {
    return this.fields[k];
  }
  async save() {
    const method = this.fields.objectId ? 'put' : 'post';
    const json = await this.ncmb.request[method](this.className, this.fields, this.fields.objectId);
    this.sets(json);
    return this;
  }
}

exports.NCMBObject = NCMBObject;