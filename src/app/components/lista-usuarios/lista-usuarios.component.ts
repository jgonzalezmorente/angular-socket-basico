import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {

  usuariosActivosObs: Observable<any> = new Observable();


  constructor( public chatService: ChatService ) {}

  ngOnInit(): void {

    this.usuariosActivosObs = this.chatService.getUsuariosActivos();
    this.chatService.emitirUsuariosActivos();

  }

}
