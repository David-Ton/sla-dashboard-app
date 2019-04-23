import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ClientsDialogModule } from '../clients-dialog/clients-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    AboutRoutingModule,
    ClientsDialogModule,
    MatDialogModule
  ],
  declarations: [AboutComponent]
})
export class AboutModule {}
