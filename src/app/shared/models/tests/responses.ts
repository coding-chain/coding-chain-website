export interface ITestNavigation {
  id: string;
  name: string;
  stepId: string;
  outputValidator: string;
  inputGenerator: string;
  score: number;
}

export interface IPublicTestNavigation {
  id: string;
  name: string;
  stepId: string;
  inputType: string;
  outputType: string;
}



export function cloneTestNavigation(test: ITestNavigation): ITestNavigation {
  return {
    stepId: test.stepId,
    name: test.name,
    inputGenerator: test.inputGenerator,
    id: test.id,
    outputValidator: test.outputValidator,
    score: test.score
  };
}
