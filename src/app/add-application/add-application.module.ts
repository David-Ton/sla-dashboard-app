import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { AddApplicationRoutingModule } from './add-application-routing.module';
import { AddApplicationComponent } from './add-application.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ClientsDialogModule } from '../clients-dialog/clients-dialog.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    AddApplicationRoutingModule,
    ClientsDialogModule,
    MatDialogModule
  ],
  declarations: [AddApplicationComponent]
})
export class AddApplicationModule {}
