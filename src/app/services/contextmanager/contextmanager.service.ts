import { Injectable } from '@angular/core';
import { DataManagerService } from '../datamanager/datamanager.service';

@Injectable()
export class ContextManagerService {
  contexts;

  constructor() { }

  hasContextName() { 

  }

  hasContextAttribute(parameter: string) {
    for (let i = 0; i < this.contexts.length; i++) {
      if (this.contexts[i].parameters[parameter] !== "") return true;
    }
    return false;
  }

  setContexts(contexts) {
    this.contexts = contexts;
  }

}
