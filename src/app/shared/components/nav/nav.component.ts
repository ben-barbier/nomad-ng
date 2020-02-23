import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ConnectionService } from '../../../nomad/connection.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent {

    constructor(
        private breakpointObserver: BreakpointObserver,
        private connection: ConnectionService,
    ) { }

    public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(result => result.matches),
        shareReplay(),
    );

    public toggleConnection() {
        // Used only for demo (do not change isOnline$ value on real app)
        this.connection.isOnline$.next(!this.connection.isOnline$.getValue());
    }
}
