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
import {UserEditComponent} from './user/user-edit.component';
import {UserPwdResetComponent} from './user/user-pwd-reset.component';
import {MessageDialogComponent} from './common/message-dialog/message-dialog.component';
import {CameraService} from './services/camera.service';
import {CamerasComponent} from './camera/cameras.component';
import {CameraDebugComponent} from './camera-debug/camera-debug.component';
import {DateStringPipe} from './common/date-string.pipe';
import {CameraEditComponent} from './camera/camera-edit.component';
import {CameraApiService} from './services/camera-api.service';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
import {AicScreenInitComponent} from './camera-debug/aic-screen-init.component';
import {AicTemplatesComponent} from './camera-debug/aic-templates.component';
import {AicScreenLiveComponent} from './camera-debug/aic-screen-live.component';
import {AicCheckerComponent} from './camera-debug/aic-checker.component';
import {AicCheckRecordsComponent} from './camera-debug/aic-check-records.component';
import {AicConfigComponent} from './camera-debug/aic-config.component';
import {AicCfgFileComponent} from './camera-debug/aic-cfg-file.component';

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
    LoginDialogComponent,
    ChangePwdComponent,
    UsersComponent,
    UserDetailComponent,
    UserEditComponent,
    UserPwdResetComponent,
    MessageDialogComponent,
    CamerasComponent,
    CameraDebugComponent,
    DateStringPipe,
    CameraEditComponent,
    AicScreenInitComponent,
    AicTemplatesComponent,
    AicScreenLiveComponent,
    AicCheckerComponent,
    AicCheckRecordsComponent,
    AicConfigComponent,
    AicCfgFileComponent
  ],
  entryComponents: [LoginDialogComponent, ChangePwdComponent,
    UserDetailComponent, UserPwdResetComponent,
    MessageDialogComponent,
    CameraEditComponent],
  providers: [
    UserService,
    SessionService,
    AccountService,
    CameraService,
    CameraApiService,
    {provide: MatPaginatorIntl, useValue: PaginatorIntl},
    {provide: MAT_DATE_LOCALE, useValue: 'zh-cn'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2000, verticalPosition: 'top'}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
