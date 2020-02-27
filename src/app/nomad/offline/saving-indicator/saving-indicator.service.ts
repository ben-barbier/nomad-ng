import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SavingStatusEnum } from '../saving-status.enum';

@Injectable({
    providedIn: 'root'
})
export class SavingIndicatorService {

    public savingStatus = new BehaviorSubject<SavingStatusEnum>(SavingStatusEnum.NOT_SAVING);

}
