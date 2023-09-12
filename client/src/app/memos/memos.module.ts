import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MemosRoutingModule } from './memos-routing.module';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MemosRoutingModule],
  declarations: [ListComponent, AddEditComponent],
})
export class MemosModule {}
