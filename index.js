/**
 * @param {any[]} models
 * @param {Object} option
 * @param {('sequelize'|'mongoose'|'joi')} option.type - which ORM you use
 * @param {string} option.path - where to write model definitions
 */
function generate(models, option) {
  const fs = require('fs');
  const mkdirp = require('mkdirp');
  let parts = option.path.split('/');
  parts.pop();
  let dir = parts.join('/');
  mkdirp(dir);
  fs.writeFileSync(option.path, '');

  switch (option.type) {
    case 'sequelize': {
      genFromSequelize(models, option);
    }
    case 'mongoose': {
    }
    case 'joi': {
      genFromJoi(models, option);
    }
  }
}

function genFromJoi(models, option) {
  let fs = require('fs');
  let content = `
/**
 * @swagger
 * definitions:
`;

  for (let model of models) {
    let modelName = model.tags[0];
    content += '\n *   ' + modelName + ':\n' + ' *     type: object';
    content += '\n *     properties:';
    for (let attr in model.children) {
      let type = model.children[attr].type;
      switch (type) {
        case 'number': {
          content += '\n *       ' + attr + ':';
          content += '\n *         type: ' + 'integer' + '';
          break;
        }
        case 'string': {
          let values = model.children[attr].valids;

          content += '\n *       ' + attr + ':';
          content += '\n *         type: string';
          if (model.children[attr].valids) {
            content += '\n *         enum:';

            for (let value of values) {
              content += '\n *           - ' + value;
            }
          }
          break;
        }
        default: {
        }
      }
    }
  }

  content += `\n*/`;

  fs.writeFileSync(option.path, content);
}

function genFromSequelize(models, option) {
  let fs = require('fs');
  let content = `
/**
 * @swagger
 * definitions:
`;

  for (let model of models) {
    let _modelName = model.prototype.constructor.name;
    let modelName = '';
    let _parts = _modelName.split('-');
    for (let part of _parts) {
      modelName += part[0].toUpperCase();
      modelName += part.slice(1, part.length);
    }
    content += '\n *   ' + modelName + ':\n' + ' *     type: object';
    content += '\n *     properties:';
    for (let attr in model.attributes) {
      let type = model.attributes[attr].type.constructor.name;
      switch (type) {
        case 'STRING': {
          content += '\n *       ' + attr + ':';
          content += '\n *         type: ' + 'string' + '';
          break;
        }
        case 'INTEGER': {
          content += '\n *       ' + attr + ':';
          content += '\n *         type: ' + 'integer' + '';
          break;
        }
        case 'ENUM': {
          let values = model.attributes[attr].type.values;

          content += '\n *       ' + attr + ':';
          content += '\n *         type: string';
          content += '\n *         enum:';

          for (let value of values) {
            content += '\n *           - ' + value;
          }
          break;
        }
        default: {
        }
      }
    }
  }

  content += `\n*/`;

  fs.writeFileSync(option.path, content);
}

exports.generate = generate;
