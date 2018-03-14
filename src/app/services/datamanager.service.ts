import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import * as $ from 'jquery';
import * as Cookie from 'js-cookie';
import { AlternativesService } from './alternatives.service';

@Injectable()
export class DataManagerService {
  
  messages;
  newMessages: boolean;
  show: boolean;
  sessionId;
  alternativesHandler:AlternativesService

  constructor(private http: HttpClient) {
    this.messages = Cookie.getJSON('messages') ? Cookie.getJSON('messages') : [];
    this.newMessages = false;
    this.show = false;
    this.sessionId = Cookie.get('sessionId') ? Cookie.get('sessionId') : this.generateNewSessionId();
    Cookie.set('sessionId',this.sessionId);
    this.alternativesHandler = new AlternativesService();
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
    const url = "https://api.dialogflow.com/v1/query?v=20150910&lang=no&query=" + query + "&sessionId=" + this.sessionId;

    this.http.get(url, headers).subscribe((ret: any) => {
      let responses: any = ret.result.fulfillment.messages;
      for (let i = 0; i < responses.length; i++) {

        let re = /.option/gi;
        let str = responses[i].speech;
        if(str.search(re) != -1) {
          this.alternativesHandler.sendNewAlternatives(str);
          
        }

        this.addMessage({
          type: 'received',
          content: responses[i].speech
        });
      }
      if (ret.result.metadata.endConversation) {
        this.generateNewSessionId();
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
    if (message.content !== "") {
      this.messages.push(message);
      this.newMessages = true;
      Cookie.set('messages',this.messages);
    }
  }

  generateNewSessionId() {
    this.sessionId = Math.floor(Math.random()*900000000) + 100000000;
    Cookie.set('sessionId',this.sessionId);
  }

}
