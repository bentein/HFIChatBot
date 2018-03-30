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
      "hasProvided" : ($events, callback) => {
        if(this.context.hasContextAttribute($events[0])) {
          return this.http.sendEvent($events[1]).subscribe(callback);
        } else {
          return this.http.sendEvent($events[2]).subscribe(callback);
        }
      }
    }

  }

  doAction(msg: string, callback: Function) {
    let $action = this.getActionFromMessage(msg);
    let $events = this.getActionEventsFromMessage(msg);
    if (this.actions[$action]) this.actions[$action]($events,callback);
    return this.removeActionFromMessage(msg);
  }

  doEvent(msg:string, callback) {
    let $event = this.getEventFromMessage(msg);
    if ($event && $event !== "") this.http.sendEvent($event).subscribe(callback);
    return this.removeEventFromMessage(msg);
  }

  private removeActionFromMessage(msg: string) {
    if (msg.includes('.action')) msg = msg.substr(0, msg.indexOf(".action"));
    return msg.trim();
  }

  private removeEventFromMessage(msg: string) {
    if (msg.includes('.event')) msg = msg.substr(0, msg.indexOf(".event"));
    return msg.trim();
  }

  private getActionFunction(action: string) {
    return this.actions[action];
  }

  private getEventFromMessage(msg: string) {
    if (msg.includes('.event')) {
      let index = msg.indexOf(".event");
      index += 7;
      return msg.substr(index);
    }
    return "";
  }

  private getActionFromMessage(msg: string) {
    if (msg.includes('.action')) {
      let index = msg.indexOf(".action");
      index += 8;
      return msg.substr(index).split(" ")[0];
    }
    return "";
  }

  private getActionEventsFromMessage(msg: string) {
    if (msg.includes('.action')) {
      let index = msg.indexOf(".action");
      index += 8;
      return msg.substr(index).split(" ").splice(1);
    }
    return [""];
  }
  
}
