import { Injectable } from '@angular/core';
import { DataManagerService } from '../datamanager/datamanager.service';
import * as $ from 'jquery';
import * as Cookie from 'js-cookie';

@Injectable()
export class AlternativButtonLogicService {

  alternatives;

  constructor() { 
    this.alternatives = Cookie.getJSON('alternatives') ? Cookie.getJSON('alternatives') : [];
  }

  /**
   * Delete all alternatives data. Update cookie. 
   */
  deleteAllAlternatives() {
    this.alternatives = [];
    Cookie.set('alternatives', this.alternatives);
  }

  /**
   * Delete all alternatives data and Update cookie. 
   * Find all alternatives. Push them to "alternatives". Update cookie. 
   * @param {string} newAlternatives A string containing message and new alternatives.
   */
  receiveNewAlternatives(newAlternatives) {
    this.deleteAllAlternatives();
    this.parseAlternatives(newAlternatives);
  }

  /**
   * Splita all alternatives and push them to "alternatives".
   * Update cookie. 
   * @param {string} newAlternatives A string containing message and new alternatives
   */
  parseAlternatives(newAlternatives) {
    newAlternatives = newAlternatives.trim();
    let allAlternatives = newAlternatives.split("|");
    for(let i = 0; i < allAlternatives.length; i++) {
      this.alternatives.push(allAlternatives[i].trim());
    }
    Cookie.set('alternatives', this.alternatives);
  }

  /**
   * If their is alternatives, create them, remove them from message, and return message.
   * Else return message
   * @param {string} message A string containing message and new alternatives.
   */
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
