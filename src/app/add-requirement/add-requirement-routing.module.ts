import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { AddRequirementComponent } from './add-requirement.component';

const routes: Routes = [
  // Module is lazy loaded, see app-routing.module.ts
  { path: 'addrequirement/:id', component: AddRequirementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AddRequirementRoutingModule {}
