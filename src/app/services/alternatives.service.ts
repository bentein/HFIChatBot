import { Injectable } from '@angular/core';
import { DataManagerService } from '../services/datamanager.service';

import * as $ from 'jquery';
import * as Cookie from 'js-cookie';

@Injectable()
export class AlternativesService {

  message: string;
  alternatives: string[];
  show: boolean;

  constructor() { 
    this.message = "";
    this.alternatives = [];
    this.show = false;
  }

  toggleShow() {
    this.show = this.show ? false : true;
  }

  sendNewAlternatives(message) {
    this.parseMessage(message);
    this.toggleShow();
    console.log(this.alternatives)
  }

  parseMessage(message) {
    if(typeof message === "string" && message !== "") {
      let splitt = message.split(".options");
      let splitt2 = splitt[1].split(" ");
      for(let i = 1; i < splitt2.length; i++) {
        this.alternatives.push(splitt2[i]);
      }
    }
    console.log(this.alternatives);
  }
}
