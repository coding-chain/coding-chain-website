import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TournamentService} from '../../../core/services/http/tournament.service';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';
import {TeamService} from '../../../core/services/http/team.service';
import {Theme, ThemeService} from '../../../core/services/states/theme.service';
import {BehaviorSubject, forkJoin, Subject} from 'rxjs';
import {ITeamNavigation} from '../../../shared/models/teams/responses';
import {switchMap} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {SwalUtils} from '../../../shared/utils/swal.utils';
import {UserStateService} from '../../../core/services/states/user-state.service';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import anime from 'animejs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['home-page.component.scss']
})
export class HomePageComponent implements OnInit, AfterViewInit {
  tournaments: ITournamentResume[];
  theme$ = new BehaviorSubject<Theme>(null);
  user$ = new BehaviorSubject<ConnectedUser>(null);
  user: ConnectedUser;
  theme: Theme;
  @ViewChild('letters') letters: ElementRef<HTMLSpanElement>;

  constructor(private readonly tournamentService: TournamentService,
              private readonly themeService: ThemeService,
              private readonly _teamService: TeamService,
              private readonly _userStateService: UserStateService) {
  }

  ngAfterViewInit(): void {
    this.animateTitle();
  }

  ngOnInit(): void {
    this.tournamentService.getTournamentResumeFiltered({
      descOrderColumns: ['startDate'],
      filterObj: {isPublished: true},
      size: 9
    }).subscribe(tournaments => {
      this.tournaments = tournaments.result.map(t => t.result);
    });
    this.themeService.themeSubject$.subscribe(theme => {
      this.theme = theme;
      this.theme$.next(theme);
    });
    this._userStateService.userSubject$.subscribe(user => {
      this.user = user;
      this.user$.next(user);
    });
    this._userStateService.loadUser();
    this.themeService.publishTheme();
  }

  private animateTitle(): void {
    this.letters.nativeElement.innerHTML = this.letters.nativeElement.textContent.replace(/([^\x00-\x80]|\w)/g, '<span class=\'letter\'>$&</span>');
    anime.timeline({loop: false})
      .add({
        targets: '.animated-title .line',
        scaleY: [0, 1],
        opacity: [0.5, 1],
        easing: 'easeOutExpo',
        duration: 700
      })
      .add({
        targets: '.animated-title .line',
        translateX: [0, this.letters.nativeElement.getBoundingClientRect().width + 10],
        easing: 'easeOutExpo',
        duration: 700,
        delay: 100
      }).add({
      targets: '.animated-title .letter',
      opacity: [0, 1],
      easing: 'easeOutExpo',
      duration: 600,
      offset: '-=775',
      delay: (el, i) => 34 * (i + 1)
    }).add({
      targets: '.line',
      opacity: 0,
      duration: 1000,
      easing: 'easeOutExpo',
      delay: 500
    });
  }

  onTournamentLeft(teams: ITeamNavigation[], tournament: ITournamentResume): void {
    forkJoin(teams.map(t => this._teamService.leaveTournament(t.id, tournament.id))).pipe(
      switchMap(res => this._userStateService.reloadUser$())
    ).subscribe(res => {
      Swal.fire(SwalUtils.successOptions(
        `Tournoi ${tournament.name} quitté pour les équipes suivantes ${teams.map(t => t.name).join(', ')}`
      ));
    }, err => Swal.fire(SwalUtils.errorOptions(`Erreur lors de la désinscription du tournoi ${tournament.name}`)));
  }
}
