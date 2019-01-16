interface SwaggerGenerateOption {
  type: string;
  path: string;
}

export function generate(models: any[], option: SwaggerGenerateOption): any;
