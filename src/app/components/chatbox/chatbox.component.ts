import { Component, AfterViewInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager/datamanager.service';

import { Message, getDay } from '../../classes/message';

import * as tippy from 'tippy.js';
import { AlternativButtonLogicService } from '../../services/alternativbuttonlogic/alternativ-button-logic.service';
import { ImageLogicService } from '../../services/imagemanager/image-logic.service';

@Component({
  selector: 'chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements AfterViewInit {

  constructor(private data: DataManagerService, private imgManager: ImageLogicService, private alternativHandler: AlternativButtonLogicService) {}

  /**
   * Scroll to bottom of the chatbox. 
   * Tooltips initiate.
   * Set timeout for scrolling to buttom.
  */
  ngAfterViewInit() {
    this.scrollToBottom(true);

    document.querySelector(".chat-box").addEventListener("scroll", () => {
      const elems:any = document.querySelectorAll('.tippy-popper');
      for (let i = 0; i < elems.length; i++ ) {
        const instance = elems[i]._tippy;
        if (instance.state.visible) {
          instance.popperInstance.disableEventListeners();
          instance.hide();
        }
      }
    });

    setTimeout(() => { 
      this.scrollToBottom(true); 
    }, 100);
  }

  /**
   * Scroll chatbox to bottom.
   * @param {any} force?
  */
  scrollToBottom(force?) {
    var container = document.querySelector('.chat-box');
    if (force) {
      container.scrollTop = container.scrollHeight;
    } else if (this.data.newMessages) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
        this.setMessagesRead();
      },0);
    }
    this.data.updateTooltips();
  }
  
  /**
   * Return title. Day and Time
   * @param {Message} message Message object.
  */
  getTitle(message:Message) {
    let ret = "";

    if (getDay() === message.day) {
      ret = message.time;
    } else {
      ret = message.day + " " + message.time;
    }

    if (message.type === "sent") return ret;
  }

  /**
   * New Message Read. Set newMessage to false. 
  */
  setMessagesRead() {
    this.data.newMessages = false;
  }

  /**
   * Set Modal Image Source and show modal.
   * @param {string} src URL for an image.
  */
  imgFullscreen(src) {
    document.getElementById('modalImg').setAttribute('src', src);
    document.getElementById('myModal').style.display = "block";
  }

  /**
   * Find URLs in message, make hyperlink element as a string and set tekst. 
   * @param {string} message A message displayed in the chatbox. 
  */
  detectURLInMessage(message) {
    while(message.search(/\[\[/gi) != -1 && message.search(/\]\]/gi) != -1) {
      let linkInfo = message.match(/\[\[(.+?)\]\]/)[1];    
      let split1 = linkInfo.split(",");
      message = message.replace("[[" + linkInfo + "]]", "<a target=\"_blank\" href=" + split1[1].trim() + ">" + split1[0].trim() + "</a>");
    }
    return decodeURIComponent(message);
  }
}
