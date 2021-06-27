import {SortOrder} from '../../types/sort-order';

export interface ITeamFilter {
  name?: string;
  memberId?: string;
}

export interface ITeamsLeaderBoardsFilter {
  hasFinished?: boolean;
}
