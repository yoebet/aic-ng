import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {UsersComponent} from './user/users.component';
import {CamerasComponent} from './camera/cameras.component';
import {CameraDebugComponent} from './camera-debug/camera-debug.component';
import {ProductTestsComponent} from './product-test/product-tests.component';
import {AutomatedTestComponent} from './product-test/automated-test.component';

const routes: Routes = [
  // {path: '', component: HomeComponent},
  {path: 'users', component: UsersComponent},
  {path: 'cameras', component: CamerasComponent},
  {path: 'tests', component: ProductTestsComponent},
  {path: 'tests/:id', component: AutomatedTestComponent},
  {path: 'aic-d/:id', component: CameraDebugComponent},
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
