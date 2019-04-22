/**
 * @param {any[]|string} models
 * @param {Object} option
 * @param {('sequelize'|'mongoose'|'joi')} option.type - which ORM you use
 * @param {string} option.path - where to write model definitions
 */
async function generate(target, option) {
  const fs = require('fs');
  const mkdirp = require('mkdirp');
  let parts = option.path.split('/');
  parts.pop();
  let dir = parts.join('/');
  mkdirp(dir);
  fs.writeFileSync(option.path, '');

  switch (option.type) {
    case 'sequelize': {
      await genFromSequelize(target, option);
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
    const requiredList = [];
    for (let attr in model.children) {
      let type = model.children[attr].type;
      let description = '';
      if (model.children[attr].description) description = model.children[attr].description;
      const flags = model.children[attr].flags;
      const required = flags && flags.presence === 'required' ? true : false;
      if (required) requiredList.push(attr);

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
        case 'array': {
          content += '\n *       ' + attr + ':';
          content += '\n *         type: array';
          content += '\n *         description: ' + description + '';
          content += '\n *         items: ' + description + '';
          content += '\n *           type: ' + model.children[attr].items[0].type + '';
        }
        default: {
        }
      }
    }
    content += '\n *     required:';
    for (let req of requiredList) {
      content += `\n *       - ${req}`;
    }
  }

  content += `\n*/`;

  fs.writeFileSync(option.path, content);
}

async function genFromSequelize(seq, option) {
  let fs = require('fs');
  let content = `
/**
 * @swagger
 * definitions:
`;
  for (let model in seq.models) {
    // console.log(seq.models[model]);
    let _modelName = model;
    let modelName = '';
    let _parts =
      _modelName.split('-').length >= _modelName.split('_').length ? _modelName.split('-') : _modelName.split('_');

    for (let part of _parts) {
      modelName += part[0].toUpperCase();
      modelName += part.slice(1, part.length);
    }
    content += '\n *   ' + modelName + ':\n' + ' *     type: object';
    content += '\n *     properties:';
    const attributes = await seq.models[model].describe();

    for (let attr in attributes) {
      let type = attributes[attr].type;
      let comment = attributes[attr].comment ? attributes[attr].comment : '';
      switch (true) {
        case /VARCHAR/.test(type): {
          content += '\n *       ' + attr + ':';
          content += '\n *         type: ' + 'string' + '';
          content += '\n *         description: ' + comment + '';
          break;
        }
        case /TINYINT/.test(type): {
          content += '\n *       ' + attr + ':';
          content += '\n *         type: boolean';
          content += '\n *         description: ' + comment + '';
          break;
        }
        case /INT/.test(type): {
          content += '\n *       ' + attr + ':';
          content += '\n *         type: ' + 'integer' + '';
          content += '\n *         description: ' + comment + '';
          break;
        }
        case /ENUM/.test(type): {
          const values = type
            .split('ENUM')[1]
            .slice(1, -1)
            .split(',');

          content += '\n *       ' + attr + ':';
          content += '\n *         type: string';
          content += '\n *         description: ' + comment + '';
          content += '\n *         enum:';

          for (let value of values) {
            content += '\n *           - ' + value;
          }
          break;
        }
        case /JSONTYPE/.test(type): {
          content += '\n *       ' + attr + ':';
          content += '\n *         type: object';
          content += '\n *         description: ' + comment + '';
          break;
        }
        case /TEXT/.test(type): {
          content += '\n *       ' + attr + ':';
          content += '\n *         type: string';
          content += '\n *         description: ' + comment + '';
          break;
        }
        case /DATETIME/.test(type): {
          content += '\n *       ' + attr + ':';
          content += '\n *         type: string';
          content += '\n *         description: ' + comment + '';
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
