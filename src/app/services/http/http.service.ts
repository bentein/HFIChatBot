import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ContextManagerService } from '../contextmanager/contextmanager.service';

@Injectable()
export class HttpService {
  headers;
  url;

  constructor(private http: HttpClient, private context: ContextManagerService) {
    this.headers = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer 35ab7ad584cb4e2ba60341cd01f35d86'
      })
    };
    this.url = "https://api.dialogflow.com/v1/query?v=20150910&lang=no";
  }

  sendQuery(query: string, sessionId: string) {
    const url = this.url + "&query=" + query + "&sessionId=" + sessionId;
    return this.http.get(url, this.headers);
  }

  sendEvent($event: string, sessionId: string) {
    const url = this.url + "&e=" + $event + "&sessionId=" + sessionId;
    return this.http.get(url, this.headers);
  }

}
