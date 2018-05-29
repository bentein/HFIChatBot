import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ContextManagerService } from '../contextmanager/contextmanager.service';

import * as Cookie from 'js-cookie';
import * as uuid from 'uuid';
import { API_KEY } from '../../classes/secrets';

@Injectable()
export class HttpService {
  sessionId;
  queryHeaders;
  eventHeaders;
  url;
  eventurl;

  /**
   * this.sessionId - get value from Cookie or get a new sessionID.
   * this.headers - Holds API KEY for the bot.
   * this.url - root URL for the API request.
   * @param http 
   * @param context 
   */
  constructor(private http: HttpClient, private context: ContextManagerService) {
    this.sessionId = Cookie.get('sessionId') ? Cookie.get('sessionId') : this.generateNewSessionId();
    this.queryHeaders = {
      headers: new HttpHeaders({
        'Content-type': 'application/json; charset=utf-8'
      })
    }
    this.eventHeaders = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + API_KEY
      })
    };
    this.url = "https://pjjkc7v3qg.execute-api.eu-west-1.amazonaws.com/test";
    this.eventurl = "https://api.dialogflow.com/v1/query?v=20150910&lang=no";
  }

  /**
   * Send message request.
   * @param {string} query Message which are to be sent to Dialogflow
   */
  sendQuery(query: string) {
    const url = this.url + "?query=" + query + "&sessionId=" + this.sessionId;
    return this.http.get(url, this.queryHeaders);
  }

  /**
   * Send event request.
   * @param {string} $event Name of the event whch are to be requested.
   */
  sendEvent($event: string) {
    const url = this.eventurl + "&e=" + $event + "&sessionId=" + this.sessionId;
    return this.http.get(url, this.eventHeaders);
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
