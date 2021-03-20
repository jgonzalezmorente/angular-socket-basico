import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client/build/index';
import { Observable } from 'rxjs';
import { Usuario } from '../classes/usuario';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  public usuario: any;
  private socket: Socket;

  constructor( private router: Router ) {
    this.socket = io( environment.wsUrl );
    this.checkStatus();
    this.cargarStorage();
  }

  checkStatus(): void {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor!');
      this.socketStatus = true;
      this.cargarStorage();
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor!');
      this.socketStatus = false;
    });

  }

  emit( evento: string, payload?: any, callback?: ( resp?: string ) => void ): void {

    this.socket.emit( evento, payload, callback );

  }

  listen( evento: string ): Observable<any> {

    return new Observable( subs => {

      this.socket.on( evento, ( data: any ) => subs.next( data ) );

    });

  }


  loginWS( nombre: string ): Promise<void> {

    return new Promise(  (resolve, reject) => {

      this.emit( 'configurar-usuario', { nombre }, resp => {

        this.usuario = new Usuario( nombre );
        this.guardarStorage();

        resolve();

      });

    });
  }

  logoutWS(): void {

    this.usuario = null;
    localStorage.removeItem( 'usuario' );

    const payload = {
      nombre: 'sin-nombre'
    };

    this.emit( 'configurar-usuario', payload, () => {} );
    this.router.navigateByUrl('');

  }

  getUsuario(): Usuario {
    return this.usuario;
  }

  guardarStorage(): void {
    localStorage.setItem( 'usuario', JSON.stringify( this.usuario ) );
  }


  cargarStorage(): void {

    const usuarioStorage = localStorage.getItem( 'usuario' );

    if ( usuarioStorage ) {
      this.usuario = JSON.parse( usuarioStorage );
      this.loginWS( this.usuario.nombre );
    }

  }

}
