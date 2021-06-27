import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {UsersComponent} from './user/users.component';
import {CamerasComponent} from './camera/cameras.component';
import {CameraDebugComponent} from './camera-debug/camera-debug.component';
import {ProductTestsComponent} from './product-test/product-tests.component';
import {AutomatedTestComponent} from './product-test-flow/automated-test.component';
import {ProductTestsCompletedComponent} from './product-test/product-tests-completed.component';
import {ProductCheckRecordsComponent} from './check-records/product-check-records.component';

const routes: Routes = [
  // {path: '', component: HomeComponent},
  {path: 'users', component: UsersComponent},
  {path: 'cameras', component: CamerasComponent},
  {path: 'tests', component: ProductTestsComponent},
  {path: 'tests/:tid', component: AutomatedTestComponent},
  {path: 'c-tests', component: ProductTestsCompletedComponent},
  {path: 'c-tests/:tid/c-records', component: ProductCheckRecordsComponent},
  {path: 'cameras/:cid/pt', component: AutomatedTestComponent},
  {path: 'cameras/:id/db', component: CameraDebugComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // enableTracing: true,
    // useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
