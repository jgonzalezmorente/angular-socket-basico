import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  texto = '';
  mensajesSubscription = new Subscription();
  elemento: any;
  mensajes: any[] = [];

  constructor( private chatService: ChatService ) {}

  ngOnInit(): void {

    this.elemento = document.getElementById( 'chat-mensajes' );

    // tslint:disable-next-line: deprecation
    this.mensajesSubscription = this.chatService.getMessages().subscribe( msg => {
      console.log( msg );
      this.mensajes.push( msg );
      this.elemento.scrollTop = this.elemento.scrollHeight;
    });
  }

  ngOnDestroy(): void {
    this.mensajesSubscription.unsubscribe();
  }


  enviar(): void {

    if ( this.texto.trim().length === 0) {
      return;
    }

    this.chatService.sendMessage( this.texto );
    this.texto = '';
  }

}
