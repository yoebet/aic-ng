import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {UsersComponent} from './user/users.component';
import {CamerasComponent} from './camera/cameras.component';

const routes: Routes = [
  // {path: '', component: HomeComponent},
  {path: 'users', component: UsersComponent},
  {path: 'cameras', component: CamerasComponent},
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
