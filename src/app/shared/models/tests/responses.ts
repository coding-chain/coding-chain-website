export interface ITestNavigation {
  id: string;
  stepId: string;
  outputValidator: string;
  inputGenerator: string;
  score: number;
}

export function cloneTestNavigation(test: ITestNavigation): ITestNavigation {
  return {
    stepId: test.stepId,
    inputGenerator: test.inputGenerator,
    id: test.id,
    outputValidator: test.outputValidator,
    score: test.score
  };
}
