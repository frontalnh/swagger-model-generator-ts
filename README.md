# swagger-model-generator-ts

Generate swagger model definition from orm model

This module reads model schema which is created from orm model and generate swagger model definition document

## Install

`npm install swagger-model-generator-ts`

## Usage

Generate swagger model definitions with orm model

```js
import * as swaggerGenerator from 'swagger-model-generator-ts';

/**
 * Below code must be executed after synchronizing and initiating ORM models
 * In this example we will use model name Sample with sequelize orm
 */

swaggerGenerator.generate([Sample], {
  path: 'path/to/models.js',
  dbType: 'sequelize'
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