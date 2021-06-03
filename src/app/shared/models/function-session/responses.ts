export interface IFunctionSessionNavigation {
  id: string;
  userId: string;
  code: string;
  order?: number;
}

export type FunctionPlaceholder = '<inType>' | '<paramName>' | '<outType>' | '<code>' | '<functionName>';

