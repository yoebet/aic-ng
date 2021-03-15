import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MatPaginatorIntl} from '@angular/material/paginator';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LayoutModule} from '@angular/cdk/layout';

import {AppMaterialModule} from './app-material.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DATE_FORMATS, PaginatorIntl} from './config';
import {UserService} from './services/user.service';
import {HomeComponent} from './home/home.component';
import {UsersComponent} from './user/users.component';
import {LoginDialogComponent} from './account/login-dialog.component';
import {AccountService} from './services/account.service';
import {SessionService} from './services/session.service';
import {UserDetailComponent} from './user/user-detail.component';
import {ChangePwdComponent} from './account/change-pwd.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LayoutModule,
    AppMaterialModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    UsersComponent,
    LoginDialogComponent,
    UserDetailComponent,
    ChangePwdComponent
  ],
  entryComponents: [LoginDialogComponent, UserDetailComponent, ChangePwdComponent],
  providers: [
    UserService,
    SessionService,
    AccountService,
    {provide: MatPaginatorIntl, useValue: PaginatorIntl},
    {provide: MAT_DATE_LOCALE, useValue: 'zh-cn'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
