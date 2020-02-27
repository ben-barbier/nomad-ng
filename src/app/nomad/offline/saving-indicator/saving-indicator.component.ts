import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { SavingStatusEnum } from '../saving-status.enum';
import { SavingIndicatorService } from './saving-indicator.service';
import { OfflineService } from '../offline.service';

@Component({
    selector: 'app-saving-indicator',
    templateUrl: 'saving-indicator.component.html',
    styleUrls: ['./saving-indicator.component.scss'],
    animations: [
        trigger('appearAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('400ms', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                style({ opacity: 0 }),
            ]),
        ]),
    ],
})
export class SavingIndicatorComponent {

    public SavingStatusEnum = SavingStatusEnum;
    public savingStatus = SavingStatusEnum.NOT_SAVING;

    constructor(
        private savingIndicatorService: SavingIndicatorService,
        private offlineService: OfflineService,
    ) {
        this.savingIndicatorService.savingStatus.subscribe(savingIndicator => {
            if (savingIndicator === SavingStatusEnum.SUCCESS) {
                setTimeout(() => this.savingStatus = SavingStatusEnum.SUCCESS, 1000);
                setTimeout(() => this.savingStatus = SavingStatusEnum.NOT_SAVING, 5000);
            } else {
                this.savingStatus = savingIndicator;
            }
        });
    }

    public resume(): void {
        this.offlineService.resumeLoading();
    }
}
