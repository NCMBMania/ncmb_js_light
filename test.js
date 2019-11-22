require('dotenv').config();
const {NcmbDS} = require('./');
const ncmb = new NcmbDS(process.env.APPLICATION_KEY, process.env.CLIENT_KEY);
(async () => {
  const Hello = ncmb.Query('Group');
  const res = await Hello.fetchAll();
  console.log(res);
})();
