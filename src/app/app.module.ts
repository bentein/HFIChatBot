import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { WindowComponent } from './components/window/window.component';
import { TitlebarComponent } from './components/titlebar/titlebar.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { DataManagerService } from './services/datamanager/datamanager.service';
import { ChatinputComponent } from './components/chatinput/chatinput.component';
import { ConversationLogicService } from './services/conversationlogic/conversation-logic.service';
import { ContextManagerService } from './services/contextmanager/contextmanager.service';
import { HttpService } from './services/http/http.service'
import { AlternativButtonLogicService } from './services/alternativbuttonlogic/alternativ-button-logic.service';
import { AlternativbuttonComponent } from './components/alternativbutton/alternativbutton.component';
import { ImageLogicService } from './services/imagemanager/image-logic.service';

@NgModule({
  declarations: [
    AppComponent,
    WindowComponent,
    TitlebarComponent,
    ChatboxComponent,
    ChatinputComponent,
    AlternativbuttonComponent
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
    ContextManagerService,
    AlternativButtonLogicService,
    ImageLogicService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
