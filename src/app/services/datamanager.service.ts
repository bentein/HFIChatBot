import { Injectable } from '@angular/core';

@Injectable()
export class DataManagerService {
  messages :any[];

  constructor() {
    this.messages = [{
      type: 'received',
      content: 'Hei! Jeg er Torsk. Hva kan jeg hjelpe deg med?'
    },{
      type: 'sent',
      content: 'Hei. Jeg husker ikke mitt passord. Kan du hjelpe meg med å gjenopprette det?'
    },{
      type: 'received',
      content: 'Selvsagt! Hvilke bruker gjelder det?'
    }]
  }

  add(message) {
    this.messages.push(message);
  }

}
