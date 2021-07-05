import {ITournamentNavigation, ITournamentNavigationWithImage} from './responses';
import {ITournamentResumeStep} from './tournament-resume';

export interface ITournamentDetail extends ITournamentNavigationWithImage {
  steps: ITournamentResumeStep[];
}
