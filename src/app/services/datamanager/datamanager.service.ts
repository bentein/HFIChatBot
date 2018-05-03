import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { ConversationLogicService } from '../conversationlogic/conversation-logic.service';
import { ContextManagerService } from '../contextmanager/contextmanager.service';
import { HttpService } from '../http/http.service';

import { Message } from '../../classes/message';

import * as $ from 'jquery';
import * as Cookie from 'js-cookie';
import * as uuid from 'uuid';
import * as tippy from 'tippy.js';
import { AlternativbuttonComponent } from '../../components/alternativbutton/alternativbutton.component';
import { AlternativButtonLogicService } from '../alternativbuttonlogic/alternativ-button-logic.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { findLast } from '@angular/compiler/src/directive_resolver';

@Injectable()
export class DataManagerService {
  messages;
  imageURLs;
  separatedMessages;

  newMessages: boolean;
  newImage: boolean;
  show: boolean;
  hideApplication: boolean;

  // sets data from cookies if available
  constructor(private http: HttpService, private convo: ConversationLogicService, private context: ContextManagerService, private alternativesHandler:AlternativButtonLogicService, private _sanitizer:DomSanitizer) {
    this.messages = Cookie.getJSON('messages') ? Cookie.getJSON('messages') : [];
    this.imageURLs = Cookie.getJSON('imageURLs') ? Cookie.getJSON('imageURLs') : [];
    this.separatedMessages = this.separateMessages();
    this.newMessages = false;
    this.newImage = false;
    this.show = false;
    this.hideApplication = false;
  }

  // toggles whether chat box is visible
  toggleChatBox() {

    if(this.messages.length == 0) {
      this.sendEvent("Welcome");
    }

    this.disableTooltips();
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

  sendEvent(query: string) {
    this.http.sendEvent(query).subscribe((ret: any) => {
      console.log(ret);
      let responses: any = ret.result.fulfillment.messages;
      this.context.setContexts(ret.result.contexts);
      this.addMessages(responses);
      if (ret.result.metadata.endConversation) this.http.generateNewSessionId();
    });
  }

  // calls DialogFlow api and delete alternativ-btns
  sendQuery(query: string) {
    this.alternativesHandler.deleteAllAlternatives();
    this.http.sendQuery(query).subscribe((ret: any) => {
      console.log(ret);
      let responses: any = ret.result.fulfillment.messages;
      this.context.setContexts(ret.result.contexts);
      this.addMessages(responses);
      if (ret.result.metadata.endConversation) this.http.generateNewSessionId();
    });
  }

  // adds message to data array
  addMessage(message) {
    if (typeof message === "string") {
      let d = new Date();
      message = new Message(message, 'sent');
      console.log("TTTTT");
    }

    if (message.content !== "") {
      this.pushMessage(message);
      this.newMessages = true;
      Cookie.set('messages', this.messages.slice(Math.max(this.messages.length - 20, 0)));
    }
  }

  // check for image
  haveImage(message) {
    let re = /.image/gi;
    if(message.search(re) != -1) {
      return true;
    } else return false;
  }

  //split image and text
  splitImageAndText(message) {
    let splitt = message.split(/.image/gi);
    if(splitt[0].length !== 0) {
      this.addMessage(new Message(splitt[0].trim(), 'received'));
    };
    this.addMessage(new Message(splitt[1].trim(), 'image-received'));
  }

  getImg(img) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(img);
  }

  addMessages(responses) {
    for (let i = 0; i < responses.length; i++) {
      let message = responses[i].speech;

      message = this.alternativesHandler.checkForAlternatives(message);

      message = this.convo.doEvent(message, (ret: any) => {
        let responses: any = ret.result.fulfillment.messages;
        this.addMessages(responses);
        if (ret.result.metadata.endConversation) this.http.generateNewSessionId();
      });

      message = this.convo.doAction(message, (ret: any) => {
        let responses: any = ret.result.fulfillment.messages;
        this.addMessages(responses);
        if (ret.result.metadata.endConversation) this.http.generateNewSessionId();

        console.log(ret);
      });

      if(this.haveImage(message)) {
        this.splitImageAndText(message);
      } else {
        this.addMessage(new Message(message, 'received'));
      }
    }
  }

  private pushMessage(message:Message) {
    this.messages.push(message);

    let outerLength = this.separatedMessages.length;
    if (outerLength === 0)  {
      this.separatedMessages[0] = (new Array());
      let innerArray = this.separatedMessages[outerLength];
      innerArray.push(message);
    } else {
      let innerArray = this.separatedMessages[outerLength-1];
      if(innerArray[0].type === message.type) {
        innerArray.push(message);
      } else if(innerArray[0].type !== 'sent' && message.type === 'image-received') {
        innerArray.push(message);
      } else if(message.type === 'received' && innerArray[0].type !== 'sent') {
        innerArray.push(message);
      } else {
        this.separatedMessages[outerLength] = (new Array());
        this.separatedMessages[outerLength].push(message);
      }
    }
  }

  updateTooltips() {
    tippy('.sent', {
      arrow: 'small',
      placement: 'right',
      duration: 0,
      popperOptions: {
        modifiers: {
          preventOverflow: {
            enabled: false
          },
          hide: {
            enabled: false
          }
        }
      }
    });
  }

  enableTooltips() {
    let tip:any = document.querySelectorAll(".sent");
    tip.forEach((el) => {
      if (el._tippy) el._tippy.enable();
    });
  }

  disableTooltips() {
    let tip:any = document.querySelectorAll(".sent");
    tip.forEach((el) => {
      if (el._tippy) el._tippy.disable();
    });
  }

  getTime() {
    let d = new Date();
    let hh = (d.getHours() < 10 ? '0' : '') + d.getHours();
    let mm = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    let ret = hh + ":" + mm;

    return ret;
  }

  separateMessages() {
    let messageGroupArray = [];
    let l = this.messages.length;
    let pushIndex = 0;

    if (l > 0) {
      messageGroupArray[0] = new Array();
      messageGroupArray[0].push(this.messages[pushIndex]);
      for (let i = 1; i < l; i++) {
        let message = this.messages[i];

        if(message.type === messageGroupArray[pushIndex][0].type) {
          messageGroupArray[pushIndex].push(message);
        } else if(message.type === 'image-received' && messageGroupArray[pushIndex][0].type !== 'sent') {
          messageGroupArray[pushIndex].push(message);
        } else if(message.type === 'received' && messageGroupArray[pushIndex][0].type !== 'sent') {
          messageGroupArray[pushIndex].push(message);
        } else {
          messageGroupArray[++pushIndex] = new Array();
          messageGroupArray[pushIndex].push(message);
        }
      }
    }

    return messageGroupArray;
  }

}
