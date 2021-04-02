import {Component, OnDestroy, OnInit} from '@angular/core';

import {Subscription} from 'rxjs';

import {User} from '../models/user';
import {SessionService} from '../services/session.service';

@Component({template: ''})
export abstract class SessionSupportComponent implements OnInit, OnDestroy {

  protected userChangeSubscription: Subscription;

  get currentUser() {
    return this.sessionService.currentUser;
  }

  protected constructor(protected sessionService: SessionService) {

  }

  protected onInit() {
  }

  protected withSession(user: User) {
  }

  protected onUserFistLogin(user: User) {
    console.log('OUFL ' + user);
  }

  ngOnInit() {

    this.onInit();

    let login = true;
    this.userChangeSubscription = this.sessionService.currentUserSubject
      .subscribe((user: User) => {
        if (!user) {
          login = false;
          return;
        }
        if (!login) {
          login = true;
          this.onUserFistLogin(user);
        }

        this.withSession(user);
      });

  }

  ngOnDestroy(): void {
    if (this.userChangeSubscription) {
      this.userChangeSubscription.unsubscribe();
    }
  }
}
