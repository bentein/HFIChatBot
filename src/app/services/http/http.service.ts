import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ContextManagerService } from '../contextmanager/contextmanager.service';

import * as Cookie from 'js-cookie';
import * as uuid from 'uuid';
import { API_KEY } from '../../classes/secrets';

@Injectable()
export class HttpService {
  sessionId;
  userId;

  queryHeaders;
  eventHeaders;
  url;
  eventurl;

  localStorage: Storage;
  sessionStorage: Storage;
  
  constructor(private http: HttpClient, private context: ContextManagerService) {
    this.localStorage = window.localStorage;
    this.sessionStorage = window.sessionStorage;

    this.sessionId = this.sessionStorage.getItem("sessionId") ? this.sessionStorage.getItem("sessionId") : this.generateNewSessionId();
    this.userId = this.localStorage.getItem("userId") ? this.localStorage.getItem("userId") : this.generateNewUserId();

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

  // Send message
  sendQuery(query: string) {
    const url = `${this.url}?query=${query}&sessionId=${this.sessionId}&userId=${this.userId}`;
    return this.http.get(url, this.queryHeaders);
  }

  // Send event
  sendEvent($event: string) {
    const url = this.eventurl + "&e=" + $event + "&sessionId=" + this.sessionId;
    return this.http.get(url, this.eventHeaders);
  }

  // generate session ID as uuid
  generateNewSessionId() {
    this.sessionId = uuid.v4();
    this.sessionStorage.setItem("sessionId", this.sessionId);
    return this.sessionId;
  }

  generateNewUserId() {
    this.userId = uuid.v4();
    this.localStorage.setItem("userId", this.userId);
    return this.userId;
  }

}
