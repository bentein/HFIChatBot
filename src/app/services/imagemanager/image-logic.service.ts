import { Injectable } from '@angular/core';
import { Message } from '../../classes/message';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Injectable()
export class ImageLogicService {

  constructor(private _sanitizer:DomSanitizer) { }

    // check for image
    messageHaveImage(message) {
      let re = /.image/gi;
      if(message.search(re) != -1) {
        return true;
      } else return false;
    }
  
    // split image and text
    splitImageAndText(message) {
      let splitt = message.split(/.image/gi);
      let text, image;
      if(splitt[0].length !== 0) {
        text = new Message(splitt[0].trim(), 'received');
      };
      image = new Message(splitt[1].trim(), 'image-received');
      let both = {text, image}
      return both;
    }

    //Sanitize image
    sanitizeImage(img) {
      return this._sanitizer.bypassSecurityTrustResourceUrl(img);
    }

}
