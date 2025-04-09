declare const isInValiData: (rulesArray: string[], data: Record<string, any>) => string | false;
declare const ValiData: (rulesArray: string[], data: Record<string, any>) => string | false;

export { ValiData, isInValiData };
