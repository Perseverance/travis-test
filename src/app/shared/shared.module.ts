import { RestClientService } from './rest-client.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    RestClientService
  ],
  declarations: [],
  providers: [
    RestClientService
  ]
})
export class SharedModule { }
