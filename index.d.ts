interface SwaggerGenerateOption {
  type: string;
  path: string;
}

export function generate(
  models: any[] | string,
  option: SwaggerGenerateOption
): any;
