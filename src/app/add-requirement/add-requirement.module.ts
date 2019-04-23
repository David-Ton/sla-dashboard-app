import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { AddRequirementRoutingModule } from './add-requirement-routing.module';
import { AddRequirementComponent } from './add-requirement.component';
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
    AddRequirementRoutingModule,
    ClientsDialogModule,
    MatDialogModule
  ],
  declarations: [AddRequirementComponent]
})
export class AddRequirementModule {}
