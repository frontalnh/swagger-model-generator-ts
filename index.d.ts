interface SwaggerGenerateOption {
  type: string;
  path: string;
}

export function generate(models: any[] | Sequelize, option: SwaggerGenerateOption): any;
