import { Injectable } from '@angular/core';
import { prototype } from 'events';
import { ContextManagerService } from '../contextmanager/contextmanager.service';
import { HttpService } from '../http/http.service';
//import { DataManagerService } from './datamanager.service';

@Injectable()
export class ConversationLogicService {
  actions;

  constructor(private context: ContextManagerService, private http: HttpService) {
    this.actions = {
      "hasProvided" : ($parameters, callback) => {
        if(this.context.hasContextAttribute($parameters[0])) {
          this.http.sendEvent($parameters[1]).subscribe(callback);
        } else {
          this.http.sendEvent($parameters[2]).subscribe(callback);
        }
      },
      "attributeIs" : ($parameters, callback) => {
        if(this.context.contextAttributeIs($parameters[0],$parameters[1])) {
          this.http.sendEvent($parameters[2]).subscribe(callback);
        } else {
          this.http.sendEvent($parameters[3]).subscribe(callback);
        }
      }
    }

  }

  /**
   * Find action and events in the message. Execute action request
   * if avaiable and return message without action. 
   * @param {string} msg A message containing action and events.
   * @param {Function} callback
   */
  doAction(msg: string, callback: Function) {
    let $action = this.getActionFromMessage(msg);
    let $events = this.getActionEventsFromMessage(msg);
    if (this.actions[$action]) this.actions[$action]($events,callback);
    return this.removeActionFromMessage(msg);
  }

  /**
   * Find event in message and execute request if available. Return message without event. 
   * @param {string} msg A message containing action and events.
   * @param {Function} callback
   */
  doEvent(msg:string, callback) {
    let $event = this.getEventFromMessage(msg);
    if ($event && $event !== "") this.http.sendEvent($event).subscribe(callback);
    return this.removeEventFromMessage(msg);
  }

  /**
   * Check if their is an event in the message. If it is, return true, else false.
   * @param {string} msg A message from Dialogflow
   */
  hasEvent(msg:string) {
    let $event = this.getEventFromMessage(msg);
    if ($event && $event !== "") return true;
    return false;
  }

  /**
   * Removes action from message and returns it. 
   * @param {string} msg A message from Dialogflow.
   */
  private removeActionFromMessage(msg: string) {
    if (msg.includes('.action')) msg = msg.substr(0, msg.indexOf(".action"));
    return msg.trim();
  }

  /**
   * Removes event from message and returns it.
   * @param {string} msg A message from Dialogflow. 
   */
  private removeEventFromMessage(msg: string) {
    if (msg.includes('.event')) msg = msg.substr(0, msg.indexOf(".event"));
    return msg.trim();
  }

  /**  
   * Returns action method with given name(action: string).
   * @param {strng} msg A message from Dialogflow. 
   */ 
  private getActionFunction(action: string) {
    return this.actions[action];
  }

  /** 
   * Returns a string with event. 
   * @param {string} msg A message from Dialogflow. 
  */
  private getEventFromMessage(msg: string) {
    if (msg.includes('.event')) {
      let index = msg.indexOf(".event");
      index += 7;
      return msg.substr(index);
    }
    return "";
  }

  /** 
   * Returns a event string if it exist.
   * @param {string} msg A message from Dialogflow. 
  */
  private getActionFromMessage(msg: string) {
    if (msg.includes('.action')) {
      let index = msg.indexOf(".action");
      index += 8;
      return msg.substr(index).split(" ")[0];
    }
    return "";
  }

  /** 
   * Returns an array with all events included in the action if exist. 
   * @param {string} msg A message from Dialogflow. 
  */
  private getActionEventsFromMessage(msg: string) {
    if (msg.includes('.action')) {
      let index = msg.indexOf(".action");
      index += 8;
      return msg.substr(index).split(" ").splice(1);
    }
    return [""];
  }
  
}
