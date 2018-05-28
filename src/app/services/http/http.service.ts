import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ContextManagerService } from '../contextmanager/contextmanager.service';

import * as Cookie from 'js-cookie';
import * as uuid from 'uuid';
import { API_KEY } from '../../classes/secrets';

@Injectable()
export class HttpService {
  sessionId;
  headers;
  url;

  /**
   * this.sessionId - get value from Cookie or get a new sessionID.
   * this.headers - Holds API KEY for the bot.
   * this.url - root URL for the API request.
   * @param http 
   * @param context 
   */
  constructor(private http: HttpClient, private context: ContextManagerService) {
    this.sessionId = Cookie.get('sessionId') ? Cookie.get('sessionId') : this.generateNewSessionId();
    this.headers = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + API_KEY
      })
    };
    this.url = "https://api.dialogflow.com/v1/query?v=20150910&lang=no";
  }

  /**
   * Send message request.
   * @param {string} query Message which are to be sent to Dialogflow
   */
  sendQuery(query: string) {
    const url = this.url + "&query=" + query + "&sessionId=" + this.sessionId;
    return this.http.get(url, this.headers);
  }

  /**
   * Send event request.
   * @param {string} $event Name of the event whch are to be requested.
   */
  sendEvent($event: string) {
    const url = this.url + "&e=" + $event + "&sessionId=" + this.sessionId;
    return this.http.get(url, this.headers);
  }

  /**
   * Generates a new sessionId and then return it. 
   * Update cookie.
   */
  generateNewSessionId() {
    this.sessionId = uuid.v4();
    Cookie.set('sessionId', this.sessionId);
    return this.sessionId;
  }

}
