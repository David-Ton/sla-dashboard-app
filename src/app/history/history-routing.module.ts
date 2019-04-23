import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { HistoryComponent } from './history.component';

const routes: Routes = [
  // Module is lazy loaded, see app-routing.module.ts
  //{ path: '', redirectTo: '/history', pathMatch: 'full' },
  { path: 'history', component: HistoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HistoryRoutingModule {}
