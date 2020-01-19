import { Component } from '@angular/core';
import { ConnectionService } from './shared/services/connection.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public isOnline$ = this.connectionService.isOnline$;

    constructor(private connectionService: ConnectionService) {
    }

}
