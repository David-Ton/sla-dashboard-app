import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';
import { ClientsDialogModule } from '../clients-dialog/clients-dialog.module';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    HistoryRoutingModule,
    ClientsDialogModule,
    NgxChartsModule
  ],
  declarations: [HistoryComponent]
})
export class HistoryModule {}
