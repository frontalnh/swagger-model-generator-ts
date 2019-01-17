/**
 * @param {any[]|string} models
 * @param {Object} option
 * @param {('sequelize'|'mongoose'|'joi')} option.type - which ORM you use
 * @param {string} option.path - where to write model definitions
 */
function generate(target, option) {
  const fs = require('fs');
  const mkdirp = require('mkdirp');
  let parts = option.path.split('/');
  parts.pop();
  let dir = parts.join('/');
  mkdirp(dir);
  fs.writeFileSync(option.path, '');

  switch (option.type) {
    case 'sequelize': {
      genFromSequelize(target, option);
      break;
    }
    case 'mongoose': {
    }
    case 'joi': {
      if (typeof target === 'object') {
        genFromJoiSchemas(target, option);
        break;
      } else if (typeof target === 'string') {
        genFromJoiSchemaDir(target, option);
        break;
      }
    }
  }
}

function genFromJoiSchemas(schemas, option) {
  let fs = require('fs');
  let content = `
/**
 * @swagger
 * definitions:`;

  for (let model of schemas) {
    model = model.describe();
    let modelName = model.tags[0];
    content += '\n *   ' + modelName + ':\n' + ' *     type: object';
    content += '\n *     properties:';
    for (let attr in model.children) {
      let type = model.children[attr].type;
      let description = '';
      if (model.children[attr].description)
        description = model.children[attr].description;

      switch (type) {
        case 'number': {
          content += '\n *       ' + attr + ':';
          content += '\n *         type: ' + 'integer' + '';
          content += '\n *         description: ' + description + '';
          break;
        }
        case 'string': {
          let values = model.children[attr].valids;

          content += '\n *       ' + attr + ':';
          content += '\n *         type: string';
          content += '\n *         description: ' + description + '';
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
        case 'JSONTYPE': {
          content += '\n *       ' + attr + ':';
          content += '\n *         type: object';
          break;
        }
        case 'BOOLEAN': {
          content += '\n *       ' + attr + ':';
          content += '\n *         type: boolean';
          break;
        }
        case 'DATE': {
          content += '\n *       ' + attr + ':';
          content += '\n *         type: string';
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
