import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { ConversationLogicService } from '../conversationlogic/conversation-logic.service';

import * as $ from 'jquery';
import * as Cookie from 'js-cookie';
import * as uuid from 'uuid';
import { ContextManagerService } from '../contextmanager/contextmanager.service';

@Injectable()
export class DataManagerService {
  messages;
  sessionId;
  newMessages: boolean;
  show: boolean;
  actions;

  headers;
  url;

  // sets data from cookies if available
  constructor(private http: HttpClient, private convo: ConversationLogicService, private context: ContextManagerService) {
    this.messages = Cookie.getJSON('messages') ? Cookie.getJSON('messages') : [];
    this.sessionId = Cookie.get('sessionId') ? Cookie.get('sessionId') : this.generateNewSessionId();
    this.newMessages = false;
    this.show = false;
    
    this.actions = {
      "hasProvided" : ($events, parameter) => {
        if(this.context.hasContextAttribute(parameter)) {
          this.doEvent($events[0]);
        } else {
          this.doEvent($events[1]);
        }
      }
    }
    
    this.headers = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer 35ab7ad584cb4e2ba60341cd01f35d86'
      })
    };
    this.url = "https://api.dialogflow.com/v1/query?v=20150910&lang=no";
    
    Cookie.set('sessionId', this.sessionId);
  }
  
  // toggles whether chat box is visible
  toggleChatBox() {
    this.separateMessages();
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

  // calls DialogFlow api
  sendQuery(query: string) {
    const url = this.url + "&query=" + query + "&sessionId=" + this.sessionId;

    this.http.get(url, this.headers).subscribe((ret: any) => {
      let responses: any = ret.result.fulfillment.messages;
      this.context.setContexts(ret.result.contexts);
      this.addMessages(responses);
      if (ret.result.metadata.endConversation) this.generateNewSessionId();

      console.log(ret);
    });
  }

  detectEvent(message: string) {
    let $event = this.convo.filterEventFromMessage(message);
    if ($event !== "") {
      message = message.substr(0, message.indexOf(".event"));
      message.trim();
      this.doEvent($event);
    }
    return message;
  }

  doEvent($event: string) {
    const url = this.url + "&e=" + $event + "&sessionId=" + this.sessionId;

    this.http.get(url, this.headers).subscribe((ret: any) => {
      let responses: any = ret.result.fulfillment.messages;
      this.addMessages(responses);
      if (ret.result.metadata.endConversation) this.generateNewSessionId();
    });
  }

  detectAction(message: string) {
    let $action = this.convo.filterActionFromMessage(message);
    if ($action[0] !== "") {
      message = message.substr(0, message.indexOf(".action"));
      message.trim();
      this.doAction($action[0],[$action[2],$action[3]],$action[1] ? $action[1] : undefined);
    }
    return message;
  }

  doAction($action: string, $events: string[], parameter?: string) {
    if(parameter) this.actions[$action]($events,parameter);
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
      Cookie.set('messages', this.messages.slice(Math.max(this.messages.length - 20, 0)));
    }
  }

  addMessages(responses) {
    for (let i = 0; i < responses.length; i++) {
      let message: string = responses[i].speech;
      message = this.detectEvent(message);
      message = this.detectAction(message);

      this.addMessage({
        type: 'received',
        content: message
      });
    }
  }

  separateMessages() {
    let messageGroupArray = [new Array()];
    let l = this.messages.length;
    let pushIndex = 0;

    if (l > 0) {
      messageGroupArray[0].push(this.messages[pushIndex]);
      for (let i = 1; i < l; i++) {
        let message = this.messages[i];
        if (message.type === messageGroupArray[pushIndex][0].type) {
          messageGroupArray[pushIndex].push(message);
        } else {
          messageGroupArray[++pushIndex] = new Array();
          messageGroupArray[pushIndex].push(message);
        }
      }
    }
    return messageGroupArray;
  }

  // generate session ID as uuid
  generateNewSessionId() {
    this.sessionId = uuid.v4();
    Cookie.set('sessionId', this.sessionId);
  }
}
