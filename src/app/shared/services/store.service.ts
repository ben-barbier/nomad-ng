import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    public cities$ = new BehaviorSubject([]);
    public customers$ = new BehaviorSubject([]);

}
