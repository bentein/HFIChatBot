import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

  constructor() {}

  toggleClass(id: string, className: string) {
    var element = document.querySelector(id);

    if (element.classList) {
      element.classList.toggle(className);
    } else {
      // For IE9
      var classes = element.className.split(" ");
      var i = classes.indexOf(className);

      if (i >= 0) {
        classes.splice(i, 1);
      } else {
        classes.push(className);
        element.className = classes.join(" ");
      }
    }
  }
}
