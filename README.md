# swagger-model-generator-ts

Generate swagger model definition from orm model

This module reads model schema which is created from orm model and generate swagger model definition document

## CURRENT VERSION ONLY SUPPORTS SEQUELIZE ORM

## Install

`npm install swagger-model-generator-ts`

## Generate from sequlize

Generate swagger model definitions with orm model

```js
import * as swaggerGenerator from 'swagger-model-generator-ts';

/**
 * Below code must be executed after synchronizing and initiating ORM models
 * In this example we will use model name Sample with sequelize orm
 */

swaggerGenerator.generate([Sample], {
  path: 'path/to/models.js',
  type: 'sequelize'
});
```

Create swagger ui and execute swagger server with generated swagger documentation in given `path`

```js
import swaggerJSDoc from 'swagger-jsdoc';
const options = {
  swaggerDefinition: {},
  apis: ['given/path/in/option'] // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);

// swagger documentation router
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

## Generate from Joi

### Generate from models

Generate swagger model definitions with Joi Schema

```js
import * as swaggerGenerator from 'swagger-model-generator-ts';

/**
 * In this example Sample is Joi Schema
 */
let Sample = Joi.object()
  .tags('Sample')
  .keys({
    sample: Joi.string().required().description('sample datas')
  }));

swaggerGenerator.generate([Sample], {
  path: 'path/to/schemas.js',
  type: 'joi'
});
```

### Generate from directory

You can generate swagger model definitions from Joi schema directories

```js
let files = fs.readdirSync('absolute/path/to/joi/schemas');
let schemas = [];
for (let file of files) {
  let fileObj = require('relative/path/to/joi/schemas' + file);

  for (let key in fileObj) {
    if (typeof fileObj[key] === 'object') {
      let model = fileObj[key];
      model = model.tags(file.split('.')[0]);

      schemas.push(model);
    }
  }
}

swaggerGenerator.generate(schemas, {
  path: 'path/to/schemas.js',
  type: 'joi'
});
```

Create swagger ui and execute swagger server with generated swagger documentation in given `path`

```js
import swaggerJSDoc from 'swagger-jsdoc';
const options = {
  swaggerDefinition: {},
  apis: ['path/to/schemas.js'] // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);

// swagger documentation router
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

## Extend model definitions

You can extend your model definition generated from generator by swagger `allOf` keyword

extended.js

```js
/**
 * @swagger
 * definitions:
 *   ExtendedUser:
 *     allOf:
 *       - $ref: '#/definitions/User'
 *       - type: object
 *       - properties:
 *           examples:
 *             type: array
 *             items:
 *               $ref: '#/definitions/Example'
 */
```

add extended.js to the swagger configuration

```js
{
  swaggerDefinition: {
  },
  apis: [
    './src/server/infra/swagger/extended.js'
  ] // Path to the API docs
}
```

## Result

models.js

```js
/**
 * @swagger
 * definitions:
 *   Sample1:
 *     type: object
 *     required:
 *       - id
 *     properties:
 *       id:
 *         type: string
 *         description: sample data!
 *         enum:
 *           - Property
 *   Sample2:
 *     type: object
 *     required:
 *       - id
 *     properties:
 *       id:
 *         type: string
 *         enum:
 *           - Property
 */
```
