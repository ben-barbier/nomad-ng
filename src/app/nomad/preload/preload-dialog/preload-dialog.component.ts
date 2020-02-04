import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-preload-dialog',
    templateUrl: './preload-dialog.component.html',
    styleUrls: ['./preload-dialog.component.scss']
})
export class PreloadDialogComponent {

    public progress = 0;

    constructor(
        @Inject(MAT_DIALOG_DATA) data: { progress$ },
    ) {
        data.progress$.subscribe(progress => this.progress = progress.success / progress.total * 100);
    }

}
