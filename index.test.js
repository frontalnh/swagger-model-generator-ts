const Joi = require('joi');
const swaggerGenerator = require('./index');
describe('', () => {
  it('Generate from joi schema', async () => {
    const RegisterSchema = Joi.object()
      .tags('RegisterSchema')
      .keys({
        email: Joi.string().required()
      });
    console.log(RegisterSchema.describe().children.email.flags);
    swaggerGenerator.generate([RegisterSchema], { path: 'test/models.js', type: 'joi' });
  });
});
