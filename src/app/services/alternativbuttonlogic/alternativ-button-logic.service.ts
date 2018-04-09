import { Injectable } from '@angular/core';
import { DataManagerService } from '../datamanager/datamanager.service';
import * as $ from 'jquery';
import * as Cookie from 'js-cookie';

@Injectable()
export class AlternativButtonLogicService {

  message: string;
  alternatives;

  constructor() { 
    this.message = "";
    this.alternatives = Cookie.getJSON('alternatives') ? Cookie.getJSON('alternatives') : [];
  }

  //Delete all alternatives
  deleteAllAlternatives() {
    this.alternatives = [];
    Cookie.set('alternatives', this.alternatives);
  }

  //Create new Alternatives
  receiveNewAlternatives(newAlternatives) {
    this.parseAlternatives(newAlternatives);
  }

  //Parse all alternatives
  parseAlternatives(newAlternatives) {
    newAlternatives = newAlternatives.trim();
    let allAlternatives = newAlternatives.split(" ");
    for(let i = 0; i < allAlternatives.length; i++) {
      this.alternatives.push(allAlternatives[i]);
    }
    Cookie.set('alternatives', this.alternatives);
  }

  //Check if message contains alternatives. If so, make alternatives
  checkForAlternatives(message) {
    let re = /.options/gi;
      if(message.search(re) != -1) {
        let splitt = message.split(re);
        this.receiveNewAlternatives(splitt[1]);
        message = splitt[0];
      }
    return message;
  }

}
