import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { ClientsDialogRoutingModule } from './clients-dialog-routing.module';
import { ClientsDialogComponent } from './clients-dialog.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FlexLayoutModule, MaterialModule],
  declarations: [ClientsDialogComponent],
  exports: [ClientsDialogComponent],
  entryComponents: [ClientsDialogComponent]
})
export class ClientsDialogModule {}
