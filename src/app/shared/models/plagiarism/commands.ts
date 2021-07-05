export interface IPlagiarizedFunctionValidity {
  plagiarizedFunctionId: string;
  isValid: boolean;
}

export interface IUpdateSuspectFunctionValidity {
  plagiarizedFunctions: IPlagiarizedFunctionValidity[];
}
