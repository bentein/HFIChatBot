import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { findLast } from '@angular/compiler/src/directive_resolver';

import { AlternativButtonLogicService } from '../alternativbuttonlogic/alternativ-button-logic.service';
import { ConversationLogicService } from '../conversationlogic/conversation-logic.service';
import { ContextManagerService } from '../contextmanager/contextmanager.service';
import { HttpService } from '../http/http.service';

import { AlternativbuttonComponent } from '../../components/alternativbutton/alternativbutton.component';

import { Message } from '../../classes/message';
import { MESSAGE_DELAY } from '../../classes/constants';

import * as $ from 'jquery';
import * as Cookie from 'js-cookie';
import * as uuid from 'uuid';
import * as tippy from 'tippy.js';
import { ImageLogicService } from '../imagemanager/image-logic.service';

@Injectable()
export class DataManagerService {
  messages;
  separatedMessages;

  newMessages: boolean;
  show: boolean;
  hideApplication: boolean;

  timeout: number;
  receivingMessages: boolean;

  /**
   * this.message - Set cookie data or empty if there is none. 
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
  constructor(private http: HttpService, private imgManager: ImageLogicService, private convo: ConversationLogicService, private context: ContextManagerService, private alternativesHandler:AlternativButtonLogicService, private _sanitizer:DomSanitizer) {
    this.messages = Cookie.getJSON('messages') ? Cookie.getJSON('messages') : [];
    this.separatedMessages = this.separateMessages();
    this.newMessages = false;
    this.show = false;
    this.hideApplication = false;
    this.timeout = MESSAGE_DELAY;
    this.receivingMessages = false;
  }

  /** 
   * Toggle visibility of chatbox.
   * If chatbox is visible, show is true, otherwise false. 
   */
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

  /**
   * Send an event to Dialogflow. 
   * When respond is received, set context(s) and add message(s) to the chatbox. 
   * If endConversation, get new sessionId. 
   * @param {string} query Name of the event
   */
  sendEvent(query: string) {
    this.http.sendEvent(query).subscribe((ret: any) => {
      let responses: any = ret.result.fulfillment.messages;
      this.context.setContexts(ret.result.contexts);
      this.addMessages(responses);
      if (ret.result.metadata.endConversation) this.http.generateNewSessionId();
    });
    this.receivingMessages = true;
  }

  /**
   * Send a string to Dialogflow. 
   * When respond is received, set context(s) and add message(s) to the chatbox.
   * If endConversation, get new sessionId.
   * @param {string} query 
   */
  sendQuery(query: string) {
    this.http.sendQuery(query).subscribe((ret: any) => {
      let responses: any = ret.result.fulfillment.messages;
      this.context.setContexts(ret.result.contexts);
      this.addMessages(responses);
      if (ret.result.metadata.endConversation) this.http.generateNewSessionId();
    });

    this.receivingMessages = true;
  }

  /**
   * Create object Message if "message" is a string. 
   * Set timeout between each messge. When timer goes out, push message to this.messages. 
   * @param {string} message A message sent from Dialogflow
   * @param {Message} message Message object containing message from Dialgflow, date, type and time. 
   * @param {any} last? 
   */
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

  /**
   * Clear cookie data for cookie "messages".
   * Delete all messages by deleting data in this.messages and this.saparetedMessages. 
   * Get new sessionId.
   */
  clearMessages() {
    Cookie.set('messages', {});
    this.messages = [];
    this.separatedMessages = [];
    this.http.generateNewSessionId();
  }

  /**
   * Save data from responses in this.messages and this.separatedMessage based on message state. 
   * Message state is defines by event, action, alternativ-buttons, images, received and sent. 
   * @param {any} responses 
   */
  addMessages(responses) {
    this.receivingMessages = true;

    for (let i = 0; i < responses.length; i++) {
      let message = responses[i].speech;

      let hasEvent = this.convo.hasEvent(message);

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

  /**
   * Add message to this.messages.
   * Add message to this.separatedMessages based on it's type and previous group type. 
   * @param {Message} message Containing message, time, date, and type. 
   */
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

  /**
   * Enable tooltips.
   */
  enableTooltips() {
    let tip:any = document.querySelectorAll(".sent");
    tip.forEach((el) => {
      if (el._tippy) el._tippy.enable();
    });
  }

  /**
   * Disable tooltips
   */
  disableTooltips() {
    let tip:any = document.querySelectorAll(".sent");
    tip.forEach((el) => {
      if (el._tippy) el._tippy.disable();
    });
  }

  /** 
   * Return time, hh:mm
   */
  getTime() {
    let d = new Date();
    let hh = (d.getHours() < 10 ? '0' : '') + d.getHours();
    let mm = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    let ret = hh + ":" + mm;
    return ret;
  }

  /**
   * Separate messages in this.message into groups. Based on type and previous group type.
   * Return grouping.
   */
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
