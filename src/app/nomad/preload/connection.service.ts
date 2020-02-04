import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {

    public isOnline$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(navigator.onLine);

    constructor() {
        window.addEventListener('offline', () => this.isOnline$.next(navigator.onLine));
        window.addEventListener('online', () => this.isOnline$.next(navigator.onLine));
    }

}
