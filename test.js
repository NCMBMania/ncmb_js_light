require('dotenv').config();
const {NcmbDS} = require('./');
const ncmb = new NcmbDS(process.env.APPLICATION_KEY, process.env.CLIENT_KEY);
(async () => {
  const Hello = ncmb.Query('Hello');
  // const res = await Hello.fetchAll();
  // console.log(res);
  
  const hello = ncmb.Object('Hello');
  await hello
    .set('text', 'hello, world!')
    .save();
  console.log(hello);
  await hello.set('text2', 'new text').save();
  console.log(hello);
})();
