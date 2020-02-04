import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { PreloadDialogComponent } from './preload-dialog/preload-dialog.component';

export interface PreloadItem {
    data: Observable<any>;
    saveAction: (data: any) => void;
}

@Injectable({
    providedIn: 'root'
})
export class PreloadService {

    public progress$: BehaviorSubject<{ success: number, total: number }>;

    private increaseProgress = () => this.progress$.next({ ...this.progress$.getValue(), success: this.progress$.getValue().success + 1 });

    constructor(
        private dialog: MatDialog,
    ) { }

    public preload(preloadList: PreloadItem[]): Promise<any> {

        this.progress$ = new BehaviorSubject<{ success: number, total: number }>({ success: 0, total: preloadList.length });

        const preloadDialog = this.dialog.open(PreloadDialogComponent, {
            disableClose: true,
            data: { progress$: this.progress$ },
        });

        return forkJoin(preloadList.map(dataToPreload => dataToPreload.data.pipe(
            tap(data => dataToPreload.saveAction(data)), // apply function
            tap(this.increaseProgress),
        ))).pipe(
            delay(150), // To display 100% value
            tap(() => preloadDialog.close())
        ).toPromise();

    }

}
