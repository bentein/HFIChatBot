import { Injectable } from '@angular/core';
import { Message } from '../../classes/message';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Injectable()
export class ImageLogicService {

  constructor(private _sanitizer:DomSanitizer) { }

    /**
     * Check if message includes an image.
     * @param message 
     */
    messageHaveImage(message) {
      let re = /.image/gi;
      if(message.search(re) != -1) {
        return true;
      } else return false;
    }
  
    /**
     * Spits the message and the image into to its own Message object.
     * @param {string} message
     */
    splitImageAndText(message) {
      let splitt = message.split(/.image/gi);
      let text, image;
      if(splitt[0].length !== 0) { text = new Message(splitt[0].trim(), 'received'); };
      image = new Message(splitt[1].trim(), 'image-received');
      return {text, image};
    }

    /**
     * Senitize image URL
     * @param {string} img 
     */
    sanitizeImage(img) {
      return this._sanitizer.bypassSecurityTrustResourceUrl(img);
    }

}
