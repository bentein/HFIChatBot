import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { findLast } from '@angular/compiler/src/directive_resolver';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { AlternativButtonLogicService } from '../alternativbuttonlogic/alternativ-button-logic.service';
import { ConversationLogicService } from '../conversationlogic/conversation-logic.service';
import { ImageLogicService } from '../imagemanager/image-logic.service';
import { UtilService } from '../util/util.service';
import { HttpService } from '../http/http.service';

import { AlternativbuttonComponent } from '../../components/alternativbutton/alternativbutton.component';

import { Message } from '../../classes/message';
import { MESSAGE_DELAY, NEW_SESSION_STRING } from '../../classes/constants';

import * as uuid from 'uuid';
import * as tippy from 'tippy.js';

@Injectable()
export class DataManagerService {
  messages;
  separatedMessages;

  newMessages: boolean;
  show: boolean;
  hideApplication: boolean;

  timeout: number;
  receivingMessages: boolean;

  sessionStorage: Storage;

  /**
   * this.sessionStorage - Storage 
   * this.message - Set data from storage or empty list if their is none.
   * this.separatedMessage - Divide messages into groups based on sent, received, and order. 
   * this.newMessage - True if last message is not "read". Otherwise false.
   * this.show - False to hide chatbox and inputbox. True to show chatbox and inputbox.
   * this.hideApplication - False to show application. True to hide application. 
   * this.timeout - Global time variable in seconds. 
   * this.receivingMessage  - True if message is received, but not displayed yet. Otherwise false. 
   * @param {HttpClient} http 
   * @param {ImageLogicService} imgManager 
   * @param {ConversationLogicService} convo 
   * @param {ContextManagerService} context 
   * @param {AlternativButtonLogicService} alternativesHandler 
   * @param {DomSanitizer} _sanitizer 
   */
  constructor(private http: HttpService, private imgManager: ImageLogicService, private convo: ConversationLogicService, private alternativesHandler:AlternativButtonLogicService, private _sanitizer:DomSanitizer, private util: UtilService) {
    this.sessionStorage = window.sessionStorage;
    this.messages = this.sessionStorage.getItem("messages") ? JSON.parse(this.sessionStorage.getItem("messages")) : [];
    this.separatedMessages = this.separateMessages();
    this.newMessages = false;
    this.show = false;
    this.hideApplication = false;
    this.timeout = MESSAGE_DELAY;
    this.receivingMessages = false;
  }

  /** 
   * Toggle visibility of chatbox.
   */
  toggleChatBox() {
    this.disableTooltips();
    if (this.show) {
      this.util.toggleClass("#chat-container", "slideUp");
      this.util.toggleClass("#chat-container", "slideDown");
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

   /**
   * Send an event to Dialogflow and waiting for callback.
   * When respond is received, add it to the chatbox.
   * @param {string} query Name of the event
   */
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

  prependToNextQuery(prepend: string) {
    this.http.prependToNextQuery(prepend);
  }

  // Add message, set timeout between messages
  addMessage(message, last?) {
    this.receivingMessages = true;

    if (typeof message === "string") {
      message = new Message(message, 'sent');
    }

    if (message.content.includes(NEW_SESSION_STRING)) {
      message.content = message.content.replace(NEW_SESSION_STRING, "").trim();
      this.http.generateNewSessionId();
    }

    if (message.content.includes(".feedback")) {
      message.content = message.content.replace(".feedback", "").trim();
      this.prependToNextQuery("feedback - ");
    }

    if (message.content !== "") {
      setTimeout(() => {
        this.pushMessage(message);
        this.newMessages = true;
        this.sessionStorage.setItem("messages", JSON.stringify(this.messages));
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
    this.sessionStorage.setItem("messages", JSON.stringify([]));
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

      if(this.imgManager.messageHasImage(message)) {
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
