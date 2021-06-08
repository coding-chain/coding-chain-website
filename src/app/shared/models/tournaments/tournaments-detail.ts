import {ITournamentNavigation} from './responses';
import {ITournamentResumeStep} from './tournament-resume';

export interface ITournamentDetail extends ITournamentNavigation {
  steps: ITournamentResumeStep[];
}
