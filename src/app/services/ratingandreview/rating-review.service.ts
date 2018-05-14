import { Injectable } from '@angular/core';
import * as email from 'emailjs';


@Injectable()
export class RatingReviewService {

  constructor() {}


  sendMail() {
    
   

    var server 	= email.server.connect({
      user:	"hi_chatbot@outlook.com", 
      password:"HI2018Chatbot", 
      host:	"smtp.gmail.com", 
      tls: true
    });
    
    var message	= {
      text:	"i hope this works", 
      from:	"Chatbot_HI <hi_chatbot@outlook.com>", 
      to:		"someone <chrisian-normando@hotmail.com>",
      cc:		"",
      subject:	"testing emailjs"
    };
    
    // send the message and get a callback with an error or details of the message that was sent
    server.send(message, function(err, message) { console.log(err || message); });

  }

}
