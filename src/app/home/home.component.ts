import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {BreakpointObserver, MediaMatcher} from '@angular/cdk/layout';

import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {SessionService} from '../services/session.service';
import {LoginDialogComponent} from '../account/login-dialog.component';
import {Result, ValueResult} from '../models/result';
import {User} from '../models/user';
import {SessionSupportComponent} from '../common/session-support.component';
import {UserService} from '../services/user.service';
import {UserDetailComponent} from '../user/user-detail.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends SessionSupportComponent implements OnDestroy {

  mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;


  beenLogin = false;


  constructor(protected sessionService: SessionService,
              private userService: UserService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private breakpointObserver: BreakpointObserver,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher) {
    super(sessionService);

    this.mobileQuery = media.matchMedia('(max-width: 800px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('a', this.mobileQueryListener);
  }

  onInit() {
    if (!this.currentUser) {
      this.sessionService.checkLogin()
        .subscribe((result: ValueResult<User>) => {
          if (result && result.code === Result.CODE_SUCCESS && !result.value) {
            if (!this.beenLogin) {
              this.userService.openLoginDialog();
            }
          }
        });
    }
  }

  showDetail() {
    const cu = this.currentUser;
    if (!cu) {
      // alert("尚未登录!")
      this.userService.showMessage('尚未登录');
      return;
    }
    UserDetailComponent.ShowDetail(cu, this.dialog);
  }


  onUserChange(user: User) {
    this.beenLogin = true;
  }


  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.mobileQuery.removeEventListener('a', this.mobileQueryListener);
  }

  openLoginDialog() {
    this.dialog.open(
      LoginDialogComponent, {
        width: '350px',
        data: {}
      });
  }

  logout() {
    this.sessionService.logout()
      .subscribe((opr: Result) => {
      });
  }
}
