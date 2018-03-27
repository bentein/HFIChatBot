import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ContextManagerService } from '../contextmanager/contextmanager.service';

import * as Cookie from 'js-cookie';
import * as uuid from 'uuid';

@Injectable()
export class HttpService {
  sessionId;
  headers;
  url;

  constructor(private http: HttpClient, private context: ContextManagerService) {
    this.sessionId = Cookie.get('sessionId') ? Cookie.get('sessionId') : this.generateNewSessionId();
    this.headers = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer 35ab7ad584cb4e2ba60341cd01f35d86'
      })
    };
    this.url = "https://api.dialogflow.com/v1/query?v=20150910&lang=no";
  }

  sendQuery(query: string) {
    const url = this.url + "&query=" + query + "&sessionId=" + this.sessionId;
    return this.http.get(url, this.headers);
  }

  sendEvent($event: string) {
    const url = this.url + "&e=" + $event + "&sessionId=" + this.sessionId;
    return this.http.get(url, this.headers);
  }

  // generate session ID as uuid
  generateNewSessionId() {
    this.sessionId = uuid.v4();
    Cookie.set('sessionId', this.sessionId);
  }

}
