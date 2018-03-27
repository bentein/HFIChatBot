import { Injectable } from '@angular/core';
import { prototype } from 'events';
//import { DataManagerService } from './datamanager.service';

@Injectable()
export class ConversationLogicService {
  constructor() {}
  
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
