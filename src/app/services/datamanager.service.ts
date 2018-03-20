import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import * as $ from 'jquery';
import * as Cookie from 'js-cookie';
import * as uuid from 'uuid';

@Injectable()
export class DataManagerService {
  
  messages;
  newMessages: boolean;
  show: boolean;
  sessionId;

  // sets data from cookies if available
  constructor(private http: HttpClient) {
    this.messages = Cookie.getJSON('messages') ? Cookie.getJSON('messages') : [];
    this.newMessages = false;
    this.show = false;
    this.sessionId = Cookie.get('sessionId') ? Cookie.get('sessionId') : this.generateNewSessionId();
    Cookie.set('sessionId',this.sessionId);
  }

  // toggles whether chat box is visible
  toggleChatBox() {
    this.show = this.show ? false : true;
  }

  // calls DialogFlow api
  sendQuery(query: string) {
    const headers = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer 35ab7ad584cb4e2ba60341cd01f35d86'
      })
    };
    const url = "https://api.dialogflow.com/v1/query?v=20150910&lang=no&query=" + query + "&sessionId=" + this.sessionId;

    this.http.get(url, headers).subscribe((ret: any) => {
      let responses: any = ret.result.fulfillment.messages;
      for (let i = 0; i < responses.length; i++) {
        this.addMessage({
          type: 'received',
          content: responses[i].speech
        });
      }
      if (ret.result.metadata.endConversation) {
        this.generateNewSessionId();
      }
      this.newMessages = true;
    });
  }

  // adds message to data array
  addMessage(message) {
    if (typeof message === "string") {
      message = {
        type: 'sent',
        content: message
      }
    }
    if (message.content !== "") {
      this.messages.push(message);
      this.newMessages = true;
      Cookie.set('messages',this.messages);
    }
  }

  // generate session ID as uuid
  generateNewSessionId() {
    this.sessionId = uuid.v4();
    Cookie.set('sessionId',this.sessionId);
  }

}
