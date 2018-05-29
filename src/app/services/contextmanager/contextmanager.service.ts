import { Injectable } from '@angular/core';
import { DataManagerService } from '../datamanager/datamanager.service';

@Injectable()
export class ContextManagerService {
  contexts;

  constructor() { }

  hasContextName() { 

  }

  /** 
   * Check if given attribute is available and not empty. If it is, return true, else false. 
   * @param {string} attribute Name of an context
   */
  hasContextAttribute(attribute: string) {
    for (let i = 0; i < this.contexts.length; i++) {
      if (this.contexts[i].parameters[attribute] !== "") return true;
    }
    return false;
  }

  /**
   * Check if given attribute is expected value. If it is, return true, else false.
   * @param {string} attribute Name of an context
   * @param {string} value Value of an context
   */
  contextAttributeIs(attribute: string, value: string) {
    for (let i = 0; i < this.contexts.length; i++) {
      if (this.contexts[i].parameters[attribute] === value) return true;
    }
    return false;
  }

  /**
   * Set "context" data. 
   * @param contexts 
   */
  setContexts(contexts) {
    this.contexts = contexts;
  }

}
