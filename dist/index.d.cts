declare const Validata: (rulesArray: string[], data: Record<string, any>) => string | false;

declare const isInValiData: (rulesArray: string[], data: Record<string, any>) => string | false;

export { Validata as default, isInValiData };
