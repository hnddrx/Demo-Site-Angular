import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { OvertimeApplicationComponent } from '../app/overtime-application/overtime-application.component';


@NgModule({
  declarations: [OvertimeApplicationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
  
     SweetAlert2Module.forRoot()
  
  ],
  providers: [],
  bootstrap: [OvertimeApplicationComponent]
})
export class AppModule { }
