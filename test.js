class STRING {}
let mine = require('./index');
let models = [
  {
    attributes: {
      a: {
        type: new STRING()
      },
      b: {
        type: new STRING()
      }
    }
  }
];

mine.generate(models, { dbType: 'sequelize', path: './namhoon/hey.js' });
