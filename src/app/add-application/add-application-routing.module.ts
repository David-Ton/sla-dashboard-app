import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { AddApplicationComponent } from './add-application.component';

const routes: Routes = [
  // Module is lazy loaded, see app-routing.module.ts
  { path: 'addapplication/:id', component: AddApplicationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AddApplicationRoutingModule {}
