import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {trigger, state, style, transition, animate} from '@angular/animations';

import * as $ from 'jquery';
import * as Cookie from 'js-cookie';
import { AlternativesService } from './alternatives.service';

@Injectable()
export class DataManagerService {
  
  messages;
  newMessages: boolean;
  show: boolean;
  sessionId;

  constructor(private http: HttpClient, private alternativesHandler:AlternativesService) {
    this.messages = Cookie.getJSON('messages') ? Cookie.getJSON('messages') : [];
    this.newMessages = false;
    this.show = false;
    this.sessionId = Cookie.get('sessionId') ? Cookie.get('sessionId') : this.generateNewSessionId();
    Cookie.set('sessionId',this.sessionId);
  }

  toggleChatBox() {
    if (this.show) {
      let $elem = $("#chat-container").toggleClass("slideUp");
      $elem.toggleClass("slideDown");
      setTimeout(() => {
        this.show = this.show ? false : true;
      }, 200);
    } else {
      this.show = this.show ? false : true;
    }
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
          this.alternativesHandler.receiveNewAlternatives(str);
          str = this.removeAlternativeFromMessage(str);
        }

        this.addMessage({
          type: 'received',
          content: str
        });
      }
      if (ret.result.metadata.endConversation) {
        this.generateNewSessionId();
      }
      console.log(ret);
      this.newMessages = true;
    });
  }

  removeAlternativeFromMessage(message) {
    if(typeof message === "string" && message !== "") {
      let splitt = message.split(".options");
      return splitt[0];
    }
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
