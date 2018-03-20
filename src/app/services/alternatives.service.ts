import { Injectable } from '@angular/core';
import { DataManagerService } from '../services/datamanager.service';

import * as $ from 'jquery';
import * as Cookie from 'js-cookie';

@Injectable()
export class AlternativesService {

  message: string;
  alternatives;
  show: boolean;

  constructor() { 
    this.message = "";
    this.alternatives = Cookie.getJSON('alternatives') ? Cookie.getJSON('alternatives') : [];
    this.show = this.alternatives !== [] ? true : false;
  }

  toggleShow() {
    if(this.show) {
      let $elem = $("#alternatives-wrapper").toggleClass("slideUpAlternatives");
      $elem.toggleClass("slideDownAlternatives");
      console.log($elem)
      setTimeout(() => {
        this.show = false;
      }, 2000);
    } else {
      this.show = this.show ? false : true;
    }
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
  }

  parseMessage(message) {
    if(typeof message === "string" && message !== "") {
      let splitt = message.split(".options");
      let splitt2 = splitt[1].split(" ");
      for(let i = 1; i < splitt2.length; i++) {
        this.alternatives.push(splitt2[i]);
      }
    }
    Cookie.set('alternatives', this.alternatives);
  }
}