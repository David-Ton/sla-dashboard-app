import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { ClientsDialogComponent } from './clients-dialog.component';

const routes: Routes = [
  // Module is lazy loaded, see app-routing.module.ts
  { path: '', redirectTo: '/addclient', pathMatch: 'full' },
  { path: 'addclient', component: ClientsDialogComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ClientsDialogRoutingModule {}
