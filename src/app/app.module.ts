import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ChatcontainerComponent } from './components/chatcontainer/chatcontainer.component';
import { TitlebarComponent } from './components/titlebar/titlebar.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { AlternativesComponent } from './components/alternatives/alternatives.component';
import { DataManagerService } from './services/datamanager.service';
import { ChatinputComponent } from './components/chatinput/chatinput.component';
import { AlternativesService } from './services/alternatives.service';

@NgModule({
  declarations: [
    AppComponent,
    ChatcontainerComponent,
    TitlebarComponent,
    ChatboxComponent,
    AlternativesComponent,
    ChatinputComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [DataManagerService, AlternativesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
