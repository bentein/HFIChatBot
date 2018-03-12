import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import * as $ from 'jquery';

@Injectable()
export class DataManagerService {
  messages: any[];
  newMessages: boolean;
  show: boolean;

  constructor(private http: HttpClient) {
    this.messages = [{
      type: 'received',
      content: 'Hei! Jeg er Torsk. Hva kan jeg hjelpe deg med?'
    }, {
      type: 'sent',
      content: 'Hei.'
    }, {
      type: 'sent',
      content: 'Jeg husker ikke mitt passord.'
    }, {
      type: 'sent',
      content: 'Kan du hjelpe meg med å gjenopprette det?'
    }, {
      type: 'received',
      content: 'Selvsagt! Hvilken bruker gjelder det?'
    }, {
      type: 'received',
      content: 'Hallo? Er du der fortsatt?'
    }];
    this.newMessages = false;
    this.show = false;
  }

  toggleChatBox() {
    this.show = this.show ? false : true;
  }

  sendQuery(query: string) {
    const headers = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer 35ab7ad584cb4e2ba60341cd01f35d86'
      })
    };
    const url = "https://api.dialogflow.com/v1/query?v=20150910&lang=no&query=" + query + "&sessionId=12345";

    this.http.get(url, headers).subscribe((ret: any) => {
      let responses: any = ret.result.fulfillment.messages;
      console.log(responses);
      for (let i = 0; i < responses.length; i++) {
        this.addMessage({
          type: 'received',
          content: responses[i].speech
        });
      }
      console.log(ret);
      this.newMessages = true;
    });
  }

  addMessage(message) {
    if (typeof message === "string") {
      message = {
        type: 'sent',
        content: message
      }
    }
    this.messages.push(message);
    this.newMessages = true;
  }

}
