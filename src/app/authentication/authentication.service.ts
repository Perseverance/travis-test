import { RestClientService } from './../shared/rest-client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationServiceService {

  constructor(private restClient: RestClientService) { }

}
