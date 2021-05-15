import {Component, OnInit, Renderer2} from '@angular/core';
import {UserStateService} from '../../services/user-state.service';
import {BehaviorSubject} from 'rxjs';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {AuthenticationService} from '../../services/http/authentication.service';
import {FormBuilder, FormControl} from '@angular/forms';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styles: []
})
export class NavBarComponent implements OnInit {
  user$: BehaviorSubject<ConnectedUser>;
  toggleThemeCtrl: FormControl;

  constructor(private userStateService: UserStateService,
              private authService: AuthenticationService,
              private readonly _fb: FormBuilder,
              private readonly _renderer: Renderer2,
              private readonly _themeService: ThemeService) {
  }

  ngOnInit(): void {
    this.toggleThemeCtrl = this._fb.control(this._themeService.theme === 'dark');
    this.user$ = this.userStateService.userSubject$;
    this.toggleThemeCtrl.valueChanges.subscribe(isDark => {
      if (isDark === true) {
        this._themeService.updateTheme('dark');
      } else {
        this._themeService.updateTheme('light');
      }
      this._themeService.publishTheme();
    });
  }

  onLogout(): void {
    this.userStateService.updateUser(null);
    this.authService.clearLocalUserData();
  }
}
