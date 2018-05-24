import { Injectable } from '@angular/core';
import { DataManagerService } from '../datamanager/datamanager.service';
import * as $ from 'jquery';
import * as Cookie from 'js-cookie';

@Injectable()
export class AlternativButtonLogicService {

  alternatives;
  show: boolean;

  constructor() { 
    this.alternatives = Cookie.getJSON('alternatives') ? Cookie.getJSON('alternatives') : [];
    this.show = this.alternatives === [] ? false : true;
  }

  //Delete all alternatives
  deleteAllAlternatives() {
    this.alternatives = [];
    Cookie.set('alternatives', this.alternatives);
    if(this.show) { this.toggleShow() };
  }

  //Create new Alternatives and delete old ones
  receiveNewAlternatives(newAlternatives) {
    this.deleteAllAlternatives();
    this.parseAlternatives(newAlternatives);
    if(!this.show) { this.toggleShow() };
  }

  //Parse all alternatives and set cookie
  parseAlternatives(newAlternatives) {
    newAlternatives = newAlternatives.trim();
    let allAlternatives = newAlternatives.split("|");
    for(let i = 0; i < allAlternatives.length; i++) {
      this.alternatives.push(allAlternatives[i].trim());
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

  // Toggle alt-btns
  toggleShow() {
    this.show = this.toggleShow ? true : false;
  }

}
