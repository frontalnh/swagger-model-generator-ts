const path = require('path');
class STRING {}
const generator = require('../index');

generator.generate(path.resolve('./example/schemas'), {
  path: './example/swagger/schemas.js',
  type: 'joi'
});
