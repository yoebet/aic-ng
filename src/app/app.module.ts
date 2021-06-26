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
import {AicScreenInitComponent} from './aic-init/aic-screen-init.component';
import {AicTemplatesComponent} from './templates/aic-templates.component';
import {AicStatusComponent} from './aic-status/aic-status.component';
import {AicCheckerComponent} from './camera-debug/aic-checker.component';
import {AicCheckRecordsComponent} from './check-records/aic-check-records.component';
import {AicConfigComponent} from './aic-config/aic-config.component';
import {AicCfgFileComponent} from './aic-config/aic-cfg-file.component';
import {ImageViewerComponent} from './viewer/image-viewer.component';
import {CheckVideosComponent} from './check-records/check-videos.component';
import {TimeSpanPipe} from './common/time-span.pipe';
import {CheckRecordsComponent} from './check-records/check-records.component';
import {CheckRecordService} from './services/check-record.service';
import {CheckTemplateService} from './services/check-template.service';
import {TemplateViewerComponent} from './templates/template-viewer.component';
import {AicTemplateSelectorComponent} from './camera-debug/aic-template-selector.component';
import {ProductTestService} from './services/product-test.service';
import {ProductTestEditComponent} from './product-test/product-test-edit.component';
import {ProductTestsComponent} from './product-test/product-tests.component';
import {AutomatedTestComponent} from './product-test/automated-test.component';
import {CameraDebugDialogComponent} from './camera-debug/camera-debug-dialog.component';
import {ProductTestsCompletedComponent} from './product-test/product-tests-completed.component';
import {DateSearchComponent} from './common/date-search/date-search.component';

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
    TimeSpanPipe,
    CameraEditComponent,
    AicScreenInitComponent,
    AicTemplatesComponent,
    AicStatusComponent,
    AicCheckerComponent,
    AicCheckRecordsComponent,
    AicConfigComponent,
    AicCfgFileComponent,
    ImageViewerComponent,
    CheckVideosComponent,
    CheckRecordsComponent,
    TemplateViewerComponent,
    AicTemplateSelectorComponent,
    ProductTestEditComponent,
    ProductTestsComponent,
    AutomatedTestComponent,
    CameraDebugDialogComponent,
    ProductTestsCompletedComponent,
    DateSearchComponent
  ],
  entryComponents: [
  ],
  providers: [
    UserService,
    SessionService,
    AccountService,
    CameraService,
    CameraApiService,
    CheckRecordService,
    CheckTemplateService,
    ProductTestService,
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
