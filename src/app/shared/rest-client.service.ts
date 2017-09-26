import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable()
export class RestClientService {

  public refreshToken: string;
  public accessToken: string;

  private restUrl: string = environment.apiUrl;
  private tokenExireTimestamp: number;


  constructor() {
    // TODO: Get tokens and expiration from localstorage and store them;
  }

  public get isTokenExpired(): boolean {
    return true;
  }

  public set tokenExpiresIn(expiersInSeconds: number) {
    const expiry: Date = new Date();
    expiry.setSeconds(expiry.getSeconds() + expiersInSeconds);
    this.tokenExireTimestamp = expiry.getTime();
  }

  private forgeUrl(endpoint: string): string {
    return `${this.restUrl}${endpoint}`;
  }

  /**
   * get makes a get request without token
   */
  public get(endpoint: string, config: object) {
    const url = this.forgeUrl(endpoint);
    return axios.get(url, config);
  }

  /**
   * post - makes a post request without token
   */
  public post(endpoint: string, data: object, config: object) {
    const url = this.forgeUrl(endpoint);
    return axios.post(url, data, config);
  }

  /**
   * put - makes a put requiest without token
   */
  public put(endpoint: string, data: object, config: object) {
    const url = this.forgeUrl(endpoint);
    return axios.put(url, data, config);
  }

  /**
   * patch - makes a patch requiest without token
   */
  public patch(endpoint: string, data: object, config: object) {
    const url = this.forgeUrl(endpoint);
    return axios.patch(url, data, config);
  }

  /**
   * delete makes a delete request without token
   */
  public delete(endpoint: string, config: object) {
    const url = this.forgeUrl(endpoint);
    return axios.delete(url, config);
  }

}
