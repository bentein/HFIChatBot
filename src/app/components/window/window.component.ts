import { Component, AfterViewInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager/datamanager.service';
import { AlternativButtonLogicService } from '../../services/alternativbuttonlogic/alternativ-button-logic.service';

@Component({
  selector: 'window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent implements AfterViewInit {

  constructor(private data:DataManagerService, private alternativHandler:AlternativButtonLogicService) { }

  ngAfterViewInit() {

  }

  closeModal() {
    document.getElementById('myModal').style.display = "none";
  }
}

