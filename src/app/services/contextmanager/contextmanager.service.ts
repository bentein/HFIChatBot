import { Injectable } from '@angular/core';
import { DataManagerService } from '../datamanager/datamanager.service';

@Injectable()
export class ContextManagerService {
  contexts;

  constructor() { }

  hasContextName() { 

  }

  // Find context attribute
  hasContextAttribute(attribute: string) {
    for (let i = 0; i < this.contexts.length; i++) {
      if (this.contexts[i].parameters[attribute] !== "") return true;
    }
    return false;
  }

  // Check context attribute and value
  contextAttributeIs(attribute: string, value: string) {
    for (let i = 0; i < this.contexts.length; i++) {
      if (this.contexts[i].parameters[attribute] === value) return true;
    }
    return false;
  }

  // Set action
  setContexts(contexts) {
    this.contexts = contexts;
  }

}
