import { Sequelize } from 'sequelize-typescript';

interface SwaggerGenerateOption {
  type: string;
  path: string;
}

export function generate(models: Sequelize | any, option: SwaggerGenerateOption): any;
