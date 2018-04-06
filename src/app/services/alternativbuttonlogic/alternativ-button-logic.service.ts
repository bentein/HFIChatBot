import { Injectable } from '@angular/core';
import { DataManagerService } from '../datamanager/datamanager.service';
import * as $ from 'jquery';
import * as Cookie from 'js-cookie';

@Injectable()
export class AlternativButtonLogicService {

  message: string;
  alternatives;
  show: boolean;

  constructor() { 
    this.message = "";
    this.alternatives = Cookie.getJSON('alternatives') ? Cookie.getJSON('alternatives') : [];
    this.show = this.alternatives === [] ? false : true;
  }

  toggleShow() {
    this.show = this.show ? false : true;
  }

  deleteAllAlternatives() {
    this.alternatives = [];
    Cookie.set('alternatives', this.alternatives);
  }

  receiveNewAlternatives(message) {
    this.parseMessage(message);
    if(!this.show) {
      this.toggleShow();
    }
    console.log(this.alternatives);
  }

  parseMessage(message) {
    if(typeof message === "string" && message !== "") {
      let splitt = message.split(".options");
      let allAlternatives = splitt[1].split(" ");
      for(let i = 1; i < allAlternatives.length; i++) {
        this.alternatives.push(allAlternatives[i]);
        console.log(allAlternatives[i]);
      }
    }
    Cookie.set('alternatives', this.alternatives);
  }

}
