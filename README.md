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

Generate swagger model definitions with Joi Schema

```js
import * as swaggerGenerator from 'swagger-model-generator-ts';

/**
 * In this example Sample is Joi Schema
 */

swaggerGenerator.generate([Sample], {
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
