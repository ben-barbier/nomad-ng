import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { delay, finalize, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { PreloadDialogComponent } from './preload-dialog/preload-dialog.component';

export interface PreloadItem {
    cacheKey: string;
    data$: Observable<any>;
    storeData: (data: any) => void;
    maxAge: number;
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

        const { toLoad, notToLoad } = preloadList.reduce((acc, preloadItem) => {
            const cachedItemStr = localStorage.getItem(preloadItem.cacheKey);
            if (!cachedItemStr) {
                return {...acc, toLoad: [...acc.toLoad, preloadItem]};
            }
            const cachedItem = JSON.parse(cachedItemStr);
            if (cachedItem.expirationDate <= new Date().getTime()) {
                return {...acc, toLoad: [...acc.toLoad, preloadItem]};
            }
            return {...acc, notToLoad: [...acc.notToLoad, preloadItem]};
        }, { toLoad: [], notToLoad: [] });

        notToLoad.forEach(item => item.storeData(JSON.parse(localStorage.getItem(item.cacheKey)).data));

        if (toLoad.length === 0) {
            return Promise.resolve();
        }

        this.progress$ = new BehaviorSubject<{ success: number, total: number }>({ success: 0, total: toLoad.length });

        const preloadDialog = this.dialog.open(PreloadDialogComponent, {
            disableClose: true,
            data: { progress$: this.progress$ },
        });

        return forkJoin(toLoad.map(preloadItem => preloadItem.data$.pipe(
            tap(data => preloadItem.storeData(data)),
            tap(data => localStorage.setItem(preloadItem.cacheKey, JSON.stringify({
                data,
                expirationDate: new Date().getTime() + preloadItem.maxAge,
            }))),
            tap(this.increaseProgress),
        ))).pipe(
            delay(150), // To display 100% value
            finalize(() => preloadDialog.close())
        ).toPromise();

    }

}
