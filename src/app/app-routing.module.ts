import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AboutComponent } from './about/about.component';
import { ClientsDialogComponent } from './clients-dialog/clients-dialog.component';
import { HomeComponent } from './home/home.component';
import { AddApplicationComponent } from './add-application/add-application.component';
import { HistoryComponent } from './history/history.component';
import { AddRequirementComponent } from './add-requirement/add-requirement.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'clients', component: AboutComponent },
    { path: 'dashboard', component: HomeComponent },
    { path: 'addclient', component: ClientsDialogComponent },
    { path: 'addapplication/:id', component: AddApplicationComponent },
    { path: 'addrequirement/:id', component: AddRequirementComponent },
    { path: 'history', component: HistoryComponent }
  ]),

  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
