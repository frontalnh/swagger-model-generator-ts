const path = require('path');
const fs = require('fs');
const generator = require('../../index');
const mkdirp = require('mkdirp');

// generate from directories
let files = fs.readdirSync('./schemas');
let schemas = [];
for (let file of files) {
  let fileObj = require('./schemas/' + file);

  for (let key in fileObj) {
    if (typeof fileObj[key] === 'object') {
      let model = fileObj[key];
      model = model.tags(file.split('.')[0]);

      schemas.push(model);
    }
  }
}

mkdirp.sync('./example/fromJoi/swagger');
generator.generate(schemas, {
  path: './example/fromJoi/swagger/schemas.js',
  type: 'joi'
});
