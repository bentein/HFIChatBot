import { Component, AfterViewInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager/datamanager.service';
import * as $ from 'jquery';

@Component({
  selector: 'window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent implements AfterViewInit {

  constructor(private data:DataManagerService) { }

  ngAfterViewInit() {
    $(document).keydown((e) => {
      if (e.keyCode == 27) {
        this.closeModal();
      }
    });
  }

  //Close Modal
  closeModal() {
    document.getElementById('myModal').style.display = "none";
  }
}

