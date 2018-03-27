import { Injectable } from '@angular/core';
import { prototype } from 'events';
//import { DataManagerService } from './datamanager.service';

@Injectable()
export class ConversationLogicService {

  messages;

  constructor() {}

  processMessageObject = {
    "test_event" : true
  }

  processMessage(activeContexts, message) : Boolean {
    if (message == "epost_tlf_event" && this.findContext(activeContexts, "supportepost_tlf-followup"))
      return true;
    else if (message == "EVENT_NAME" && this.findContext(activeContexts, "ACTIVE_CONTEXT_NAME"))
      return true;
    else
      return false;
  }

  findContext(activeContexts, contextName) : Boolean {
    for(var i = 0; i < activeContexts.length; i++){
      if (activeContexts[i].name == contextName)
        return true;
      else
        return false;
    }
  }

  filterEventFromMessage(msg: string) {
    if (msg.includes('.event')) {
      let index = msg.indexOf(".event");
      index += 7;
      return msg.substr(index);
    }
    return "";
  }

  filterActionFromMessage(msg: string) {
    if (msg.includes('.action')) {
      let index = msg.indexOf(".action");
      index += 8;
      return msg.substr(index).split(" ");
    }
    return [""];
  }
}
