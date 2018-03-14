import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ChatcontainerComponent } from './components/chatcontainer/chatcontainer.component';
import { TitlebarComponent } from './components/titlebar/titlebar.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { DataManagerService } from './services/datamanager.service';
import { ChatinputComponent } from './components/chatinput/chatinput.component';
import { AlternativComponent } from './components/alternativ/alternativ.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatcontainerComponent,
    TitlebarComponent,
    ChatboxComponent,
    ChatinputComponent,
    AlternativComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [DataManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
