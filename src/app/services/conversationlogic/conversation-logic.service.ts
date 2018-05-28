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

  // Get action, send event, remove event and action from message.
  doAction(msg: string, callback: Function) {
    let $action = this.getActionFromMessage(msg);
    let $events = this.getActionEventsFromMessage(msg);
    if (this.actions[$action]) this.actions[$action]($events,callback);
    return this.removeActionFromMessage(msg);
  }

  // Send event and remove event from message.
  doEvent(msg:string, callback) {
    let $event = this.getEventFromMessage(msg);
    if ($event && $event !== "") this.http.sendEvent($event).subscribe(callback);
    return this.removeEventFromMessage(msg);
  }

  // Check if message have event
  hasEvent(msg:string) {
    let $event = this.getEventFromMessage(msg);
    if ($event && $event !== "") return true;
    return false;
  }

  // Remove action from message and return message
  private removeActionFromMessage(msg: string) {
    if (msg.includes('.action')) msg = msg.substr(0, msg.indexOf(".action"));
    return msg.trim();
  }

  // Remove given event from message and return message
  private removeEventFromMessage(msg: string) {
    if (msg.includes('.event')) msg = msg.substr(0, msg.indexOf(".event"));
    return msg.trim();
  }

  // Return action function
  private getActionFunction(action: string) {
    return this.actions[action];
  }

  // Return event 
  private getEventFromMessage(msg: string) {
    if (msg.includes('.event')) {
      let index = msg.indexOf(".event");
      index += 7;
      return msg.substr(index);
    }
    return "";
  }

  // Return action string
  private getActionFromMessage(msg: string) {
    if (msg.includes('.action')) {
      let index = msg.indexOf(".action");
      index += 8;
      return msg.substr(index).split(" ")[0];
    }
    return "";
  }

  // Return action attributes
  private getActionEventsFromMessage(msg: string) {
    if (msg.includes('.action')) {
      let index = msg.indexOf(".action");
      index += 8;
      return msg.substr(index).split(" ").splice(1);
    }
    return [""];
  }
  
}
