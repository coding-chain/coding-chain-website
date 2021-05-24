import {Component, OnInit} from '@angular/core';
import {PublicUser} from '../../../shared/models/users/responses';
import {connectedUserWithTeamToMember, IMemberResume, ITeamWithMembersResume} from '../../../shared/models/teams/responses';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {IUsersFilter} from '../../../shared/models/users/filters';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {TeamService} from '../../../core/services/http/team.service';
import {UserService} from '../../../core/services/http/user.service';
import {GetParams} from '../../../shared/models/http/get.params';
import {switchMap} from 'rxjs/operators';
import * as _ from 'lodash';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {UserStateService} from '../../../core/services/user-state.service';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {FormBuilder, FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';
import {SwalUtils} from '../../../shared/utils/swal.utils';

export interface IMovableMember extends IMemberResume {
  canMove: boolean;
}

@Component({
  selector: 'app-teams-edit',
  templateUrl: './teams-edit.component.html',
  styles: []
})
export class TeamsEditComponent implements OnInit {

  teamId: string;
  team: ITeamWithMembersResume;
  originalTeam: ITeamWithMembersResume =  {name: '', members: []} as ITeamWithMembersResume;
  users: IMovableMember[] = [];
  team$ = new BehaviorSubject<ITeamWithMembersResume>(this.originalTeam);
  teamMembers: IMovableMember[] = [];
  userCursor: PageCursor<PublicUser, IUsersFilter>;
  users$ = new BehaviorSubject<IMemberResume[]>([]);
  connectedUser: ConnectedUser;
  teamGrp: FormGroup;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly teamService: TeamService,
    private readonly userService: UserService,
    private readonly _userStateService: UserStateService,
    private readonly _fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.teamGrp = this._fb.group({});
    this.userCursor = this.userService.getUserResumeCursor();
    this._userStateService.userSubject$.subscribe(user => {
      this.connectedUser = user;
      this.searchUser({filterObj: {}});
    });
    this.route.params.pipe(switchMap(params => {
        if (params.id) {
          return this.teamService.getOneResumeById(params.id);
        }
        return of(null);
      }
    )).subscribe(team => {
      this.setTeam(team);
    });
    this.userCursor.resultsSubject$.subscribe(users => {
      this.users = users.map(u => ({canMove: true, ...u, userId: u.id, teamId: this.team?.id, isAdmin: false}) as IMovableMember);
      this.users$.next(this.users);
    });
    this._userStateService.loadUser();
  }

  searchUser($filter: GetParams<PublicUser, IUsersFilter>): void {
    if (!this.connectedUser || !this.team) {
      return;
    }
    $filter.filterObj.withoutIds = this.teamMembers.map(m => m.id);
    $filter.filterObj.withoutIds.push(this.connectedUser.id);
    this.userCursor.updateFilter($filter);
    this.userCursor.current();
  }

  drop(event: CdkDragDrop<IMemberResume[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  onMemberDeleted(i: number): void {
    this.teamMembers.splice(i, 1);
    this.teamMembers = [...this.teamMembers];
  }

  onMemberElevated(member: IMovableMember): void {
    this.teamMembers.forEach(m => m.isAdmin = false);
    member.isAdmin = true;
  }

  deleteTeam(): void {
    this.teamService.deleteTeam(this.team.id).subscribe(res =>
        Swal.fire(SwalUtils.successOptions('Equipe supprimée')).then(closed => this.router.navigate(['/teams'])),
      err => Swal.fire(SwalUtils.errorOptions('Impossible de supprimer l\'équipe'))
    );
  }

  saveTeam(): void {
    const editedTeam = _.cloneDeep(this.team) as ITeamWithMembersResume;
    editedTeam.members = this.teamMembers;
    this.teamService.upsertFullTeam(this.originalTeam, editedTeam).subscribe(team => {
      Swal.fire(SwalUtils.successOptions('Modifications d\'équipe sauvegardées')).then(closed => {
        if (!this.team?.id) {
          this._userStateService.reloadUser$().subscribe(user => {
            this.router.navigate(['/teams', team.id, 'edit']);
          });
        }
        if (!team.members.find(m => m.isAdmin && m.userId === this.connectedUser.id)) {
          this.router.navigate(['/teams']);
          this._userStateService.reloadUser();
        }
        this.setTeam(team);
      });
    }, err => Swal.fire(SwalUtils.errorOptions('Erreur lors de la sauvegarde de l\'équipe.')));
  }

  private setTeam(team?: ITeamWithMembersResume): void {
    team = team ?? this.originalTeam;
    if (!team.id) {
      team.members.push(connectedUserWithTeamToMember(this.connectedUser, team));
    }
    this.team = _.cloneDeep(team);
    this.team$.next(team);
    this.originalTeam = team;
    this.teamMembers = this.team.members.map(m => ({canMove: false, ...m}));
    this.searchUser({filterObj: {}});
  }
}
