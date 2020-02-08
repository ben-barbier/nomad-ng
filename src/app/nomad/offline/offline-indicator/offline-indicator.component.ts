import { Component } from '@angular/core';
import { ConnectionService } from '../../connection.service';

@Component({
    selector: 'app-offline-indicator',
    templateUrl: './offline-indicator.component.html',
    styleUrls: ['./offline-indicator.component.scss']
})
export class OfflineIndicatorComponent {

    public isOnline$ = this.connectionService.isOnline$;

    constructor(private connectionService: ConnectionService) { }

}
