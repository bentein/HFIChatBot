import { Injectable } from '@angular/core';
import { DataManagerService } from '../datamanager/datamanager.service';

@Injectable()
export class AlternativButtonLogicService {
  alternatives;

  sessionStorage: Storage;

  constructor() { 
    this.sessionStorage = window.sessionStorage;

    this.alternatives = this.sessionStorage.getItem("alternatives") ? JSON.parse(this.sessionStorage.getItem("alternatives")) : [];
  }

  //Delete all alternatives
  deleteAllAlternatives() {
    this.alternatives = [];
    this.sessionStorage.setItem("alternatives", JSON.stringify([]));
  }

  //Create new Alternatives and delete old ones
  receiveNewAlternatives(newAlternatives) {
    this.deleteAllAlternatives();
    this.parseAlternatives(newAlternatives);
  }

  //Parse all alternatives and save to session
  parseAlternatives(newAlternatives) {
    newAlternatives = newAlternatives.trim();
    let allAlternatives = newAlternatives.split("|");
    for(let i = 0; i < allAlternatives.length; i++) {
      this.alternatives.push(allAlternatives[i].trim());
    }
    this.sessionStorage.setItem('alternatives', JSON.stringify(this.alternatives));
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
