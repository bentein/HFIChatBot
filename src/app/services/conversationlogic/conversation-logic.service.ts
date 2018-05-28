import { Injectable } from '@angular/core';
import { prototype } from 'events';
import { ContextManagerService } from '../contextmanager/contextmanager.service';
import { HttpService } from '../http/http.service';

@Injectable()
export class ConversationLogicService {
  actions;

  /**
   * Sets action methods. 
   * "hasProvided" checks if given parameter is defined. 
   * If defined, call event_one, else call event_two. 
   * "attributeIs" check if given parameter value is as expected. 
   * If it is as expected, call an event, else call another event. 
   */
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
   * Get action from msg(string) as $action. 
   * Get event and action from msg(string) as $events.
   * If $action from msg(string) is found, call method $action with $event as parameter from this.actions.
   * Remove action from msg(string) and return.  
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
  * Get event from msg(string). If msg(string) has event and the event is not an empty string, 
  * call event from Dialogflow agent.
  * Remove event from msg(string).
  * @param {string} msg A message containing an event.
  * @param {Function} callback
  */
  doEvent(msg:string, callback) {
    let $event = this.getEventFromMessage(msg);
    if ($event && $event !== "") this.http.sendEvent($event).subscribe(callback);
    return this.removeEventFromMessage(msg);
  }

  /**
   * Get event from msg(string). If msg(string) has event and the event is not an empty string, return true.
   * Else return false.
   * @param {string} msg A message from Dialogflow
   */
  hasEvent(msg:string) {
    let $event = this.getEventFromMessage(msg);
    if ($event && $event !== "") return true;
    return false;
  }

  /**
   * If given msg(string) includes ".action", remove action(s) from msg(string), return msg.
   * Else return msg(string).
   * @param {string} msg A message from Dialogflow.
   */
  private removeActionFromMessage(msg: string) {
    if (msg.includes('.action')) msg = msg.substr(0, msg.indexOf(".action"));
    return msg.trim();
  }

  /**
   * If given msg(string) includes ".event", remove event(s) from msg(string), return msg. 
   * Else return msg(string).
   * @param {string} msg A message from Dialogflow. 
   */
  private removeEventFromMessage(msg: string) {
    if (msg.includes('.event')) msg = msg.substr(0, msg.indexOf(".event"));
    return msg.trim();
  }

  /**
   * Find given action(string), return action(method).
   * @param {string} action The name of an action.
  */ 
  private getActionFunction(action: string) {
    return this.actions[action];
  }

  /**
   * If given message(string) includes ".event", return event.
   * Else return empty string.
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
   * If given message(string) includes ".action", return action.
   * Else return empty string. 
   * @param {strng} msg A message from Dialogflow. 
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
   * If given message(string) includes ".action", return action and events as an array.
   * Else return empty array. 
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
