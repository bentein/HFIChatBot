import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { findLast } from '@angular/compiler/src/directive_resolver';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { AlternativButtonLogicService } from '../alternativbuttonlogic/alternativ-button-logic.service';
import { ConversationLogicService } from '../conversationlogic/conversation-logic.service';
import { ImageLogicService } from '../imagemanager/image-logic.service';
import { HttpService } from '../http/http.service';

import { AlternativbuttonComponent } from '../../components/alternativbutton/alternativbutton.component';

import { Message } from '../../classes/message';
import { MESSAGE_DELAY } from '../../classes/constants';

import * as $ from 'jquery';
import * as Cookie from 'js-cookie';
import * as uuid from 'uuid';
import * as tippy from 'tippy.js';

@Injectable()
export class DataManagerService {
  messages;
  imageURLs;
  separatedMessages;

  newMessages: boolean;
  newImage: boolean;
  show: boolean;
  hideApplication: boolean;

  timeout: number;
  receivingMessages: boolean;

  // sets data from cookies if available
  constructor(private http: HttpService, private imgManager: ImageLogicService, private convo: ConversationLogicService, private alternativesHandler:AlternativButtonLogicService, private _sanitizer:DomSanitizer) {
    this.messages = Cookie.getJSON('messages') ? Cookie.getJSON('messages') : [];
    this.imageURLs = Cookie.getJSON('imageURLs') ? Cookie.getJSON('imageURLs') : [];
    this.separatedMessages = this.separateMessages();
    this.newMessages = false;
    this.newImage = false;
    this.show = false;
    this.hideApplication = false;
    this.timeout = MESSAGE_DELAY;
    this.receivingMessages = false;
  }

  // toggles whether chat box is visible
  toggleChatBox() {
    this.disableTooltips();
    if (this.show) {
      let $elem = $("#chat-container").toggleClass("slideUp");
      $elem.toggleClass("slideDown");
      setTimeout(() => {
        this.show = this.show ? false : true;
      }, 200);
    } else {
      this.show = this.show ? false : true;
      if(this.messages.length == 0) {
        this.sendEvent("Welcome");
      }
    }
  }

  // Send event
  sendEvent(query: string) {
    this.http.sendEvent(query).subscribe((ret: any) => {
      let responses: any = ret.result.fulfillment.messages;
      this.addMessages(responses);
    });

  }

  // Send message
  sendQuery(query: string) {
    this.http.sendQuery(query).subscribe((ret: any) => {
      let responses: any = ret;
      this.addMessages(responses);
    });
  }

  // Add message, set timeout between messages
  addMessage(message, last?) {
    this.receivingMessages = true;

    let counter = message.length;

    if (typeof message === "string") {
      let d = new Date();
      message = new Message(message, 'sent');
    }

    if (message.content !== "") {
      setTimeout(() => {
        this.pushMessage(message);
        this.newMessages = true;
        Cookie.set('messages', this.messages.slice(Math.max(this.messages.length - 20, 0)));
        this.timeout -= MESSAGE_DELAY;
        if (last) {
          this.receivingMessages = false;
        }
      }, message.type == "sent"
         ? 0
         : this.timeout);
      this.timeout += MESSAGE_DELAY;
    }
  }

  // Clear all messages, set new session ID
  clearMessages() {
    Cookie.set('messages', []);
    this.messages = [];
    this.separatedMessages = [];
    this.http.generateNewSessionId();
  }

  // Add messages, check for alt-btns, images, event, action, etc.
  addMessages(responses) {
    this.receivingMessages = true;

    for (let i = 0; i < responses.length; i++) {
      let message = responses[i];
      if (typeof message !== "string") {
        message = responses[i].speech;
      }

      let hasEvent = this.convo.hasEvent(message);

      message = this.alternativesHandler.checkForAlternatives(message);

      message = this.convo.doEvent(message, (ret: any) => {
        let responses: any = ret.result.fulfillment.messages;
        this.addMessages(responses);
        if (ret.result.metadata.endConversation) this.http.generateNewSessionId();
      });

      if(this.imgManager.messageHaveImage(message)) {
        let tmp = this.imgManager.splitImageAndText(message);
        if(tmp.text !== undefined) {this.addMessage(tmp.text); }
        this.addMessage(tmp.image);
      } else if (i === responses.length - 1){
        this.addMessage(new Message(message, 'received'), hasEvent ? false : true);
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

  // Enable tooltips
  enableTooltips() {
    let tip:any = document.querySelectorAll(".sent");
    tip.forEach((el) => {
      if (el._tippy) el._tippy.enable();
    });
  }

  // Disable tooltips
  disableTooltips() {
    let tip:any = document.querySelectorAll(".sent");
    tip.forEach((el) => {
      if (el._tippy) el._tippy.disable();
    });
  }

  // Return time, hh:mm
  getTime() {
    let d = new Date();
    let hh = (d.getHours() < 10 ? '0' : '') + d.getHours();
    let mm = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    let ret = hh + ":" + mm;

    return ret;
  }

  // Separate Messages into groups. "mage-received, reveived, sent"
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
