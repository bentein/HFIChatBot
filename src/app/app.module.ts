import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { ChatcontainerComponent } from './components/chatcontainer/chatcontainer.component';
import { TitlebarComponent } from './components/titlebar/titlebar.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { DataManagerService } from './services/datamanager/datamanager.service';
import { ChatinputComponent } from './components/chatinput/chatinput.component';
import { ConversationLogicService } from './services/conversationlogic/conversation-logic.service';
import { ContextManagerService } from './services/contextmanager/contextmanager.service';
import { HttpService } from './services/http/http.service'

@NgModule({
  declarations: [
    AppComponent,
    ChatcontainerComponent,
    TitlebarComponent,
    ChatboxComponent,
    ChatinputComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FlexLayoutModule
  ],
  providers: [
    HttpService,
    DataManagerService,
    ConversationLogicService,
    ContextManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
