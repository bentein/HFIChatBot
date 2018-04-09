import { Injectable } from '@angular/core';
import { DataManagerService } from '../datamanager/datamanager.service';

@Injectable()
export class ContextManagerService {
  contexts;

  constructor() { }

  hasContextName() { 

  }

  hasContextAttribute(attribute: string) {
    for (let i = 0; i < this.contexts.length; i++) {
      if (this.contexts[i].parameters[attribute] !== "") return true;
    }
    return false;
  }

  contextAttributeIs(attribute: string, value: string) {
    for (let i = 0; i < this.contexts.length; i++) {
      if (this.contexts[i].parameters[attribute] === value) return true;
    }
    return false;
  }

  setContexts(contexts) {
    this.contexts = contexts;
  }

}
