import {IUserSessionNavigation} from '../user-session/responses';
import {IStepNavigation} from '../steps/responses';
import {IProgrammingLanguage} from '../programming-languages/responses';
import {PublicUser} from '../users/responses';
import {IPublicTestNavigation} from '../tests/responses';
import {IParticipationSessionNavigation} from './responses';
import {AppFunction} from '../function-session/app-function';

export interface TournamentStepParticipation {
  id?: string;
  teamId: string;
  stepId: string;
  tournamentId: string;
  order: number;
  isOptional: boolean;
}

export class ParticipationSession implements IParticipationSessionNavigation {
  functions: AppFunction[];
  users: IUserSession[];
  step: IStepSession;
  allParticipations: TournamentStepParticipation[];
  endDate?: Date;
  calculatedScore: number;
  functionsIds: string[];
  id: string;
  passedTestsIds: string[];
  startDate: Date;
  stepId: string;
  teamId: string;
  tournamentId: string;
  lastError?: string;
  lastOutput?: string;
  processStartTime?: Date;
  private _order = 0;

  constructor(props: Partial<ParticipationSession>) {
    this.functions = props.functions ?? [];
    this.users = props.users ?? [];
    this.step = props.step;
    this.allParticipations = props.allParticipations;
    this.calculatedScore = props.calculatedScore;
    this.functionsIds = props.functionsIds ?? [];
    this.id = props.id;
    this.passedTestsIds = props.passedTestsIds ?? [];
    this.startDate = props.startDate;
    this.stepId = props.stepId;
    this.teamId = props.teamId;
    this.tournamentId = props.tournamentId;
    this.lastError = props.lastError;
    this.lastOutput = props.lastOutput;
    this.processStartTime = props.processStartTime;
    this.endDate = props.endDate;
    this.init();
  }

  private _previousParticipationStep: TournamentStepParticipation;

  get previousParticipationStep(): TournamentStepParticipation | undefined {
    return this._previousParticipationStep;
  }

  private _nextParticipationStep: TournamentStepParticipation;

  get nextParticipationStep(): TournamentStepParticipation | undefined {
    return this._nextParticipationStep;
  }

  private init(): void {
    this.allParticipations = this.allParticipations.sort((p1, p2) => p1.order - p2.order);
    this._order = this.allParticipations.find(p => p.id === this.id)?.order - 1 ?? 0;

    if (this._order > 0) {
      this._previousParticipationStep = this.allParticipations[this._order - 1];
    }
    if (this.allParticipations.length > this._order + 1) {
      this._nextParticipationStep = this.allParticipations[this._order + 1];
    }
  }


}

export interface IParticipationExecutionResult {
  passedTestsIds: string[];
  lastError?: string;
  lastOutput?: string;
  processStartTime?: Date;
  endDate?: Date;
}

export interface IParticipationExecutionStart {
  processStartTime?: Date;
}

export interface IStepSession extends IStepNavigation {
  language: IProgrammingLanguage;
  tests: IPublicTestNavigation[];
  isOptional: boolean;
  order: number;
}

export interface IUserSession extends IUserSessionNavigation, PublicUser {

}
