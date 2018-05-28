import { Injectable } from '@angular/core';
import { DataManagerService } from '../datamanager/datamanager.service';

@Injectable()
export class ContextManagerService {
  contexts;

  constructor() { }

  hasContextName() {}

  //Find given "attribute(string)" in "contexts".
  //If found, check if "attribute" is not empty. 
  //If not empty, return true. Else return false. 
  hasContextAttribute(attribute: string) {
    for (let i = 0; i < this.contexts.length; i++) {
      if (this.contexts[i].parameters[attribute] !== "") return true;
    }
    return false;
  }

  //Find given "attribute(string)" in "contexts".
  //If found, check if "attribute" value is equal to given "value(string)".
  //If so, return true. Else return false. 
  contextAttributeIs(attribute: string, value: string) {
    for (let i = 0; i < this.contexts.length; i++) {
      if (this.contexts[i].parameters[attribute] === value) return true;
    }
    return false;
  }

  // Set "context" data. 
  setContexts(contexts) {
    this.contexts = contexts;
  }

}
