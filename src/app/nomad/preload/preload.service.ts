import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { delay, finalize, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { PreloadDialogComponent } from './preload-dialog/preload-dialog.component';
import { ConnectionService } from './connection.service';

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
        private connectionService: ConnectionService
    ) { }

    public preload(preloadList: PreloadItem[]): Promise<any> {

        const { toLoadFromNetwork, toLoadFromCache } = this.getPreloadOrigins(preloadList);

        const isOffline = this.connectionService.isOnline$.getValue() === false;

        if (isOffline) {
            const preloadListContainsUncachedItem = preloadList.some(preloadItem => localStorage.getItem(preloadItem.cacheKey) === null);
            if (preloadListContainsUncachedItem) {
                return Promise.reject('Preload list contains uncached item and device is offline.');
            }
            preloadList.forEach(preloadItem => preloadItem.storeData(JSON.parse(localStorage.getItem(preloadItem.cacheKey)).data));
        } else {
            toLoadFromCache.forEach(item => item.storeData(JSON.parse(localStorage.getItem(item.cacheKey)).data));
        }

        if (toLoadFromNetwork.length > 0) {
            return this.loadFromNetworkAndDisplayProgressDialog(toLoadFromNetwork);
        } else {
            return Promise.resolve();
        }

    }

    private getPreloadOrigins(preloadList: PreloadItem[]): { toLoadFromNetwork: PreloadItem[], toLoadFromCache: PreloadItem[] } {

        return preloadList.reduce((acc, preloadItem) => {
            const cachedItemStr = localStorage.getItem(preloadItem.cacheKey);
            if (!cachedItemStr) {
                return { ...acc, toLoadFromNetwork: [...acc.toLoadFromNetwork, preloadItem] };
            }
            const cachedItem = JSON.parse(cachedItemStr);
            if (cachedItem.expirationDate <= new Date().getTime()) {
                return { ...acc, toLoadFromNetwork: [...acc.toLoadFromNetwork, preloadItem] };
            }
            return { ...acc, toLoadFromCache: [...acc.toLoadFromCache, preloadItem] };
        }, { toLoadFromNetwork: [], toLoadFromCache: [] });

    }

    private loadFromNetworkAndDisplayProgressDialog(toLoadFromNetwork: any[]): Promise<any> {

        this.progress$ = new BehaviorSubject<{ success: number, total: number }>({ success: 0, total: toLoadFromNetwork.length });

        const preloadDialog = this.dialog.open(PreloadDialogComponent, {
            disableClose: true,
            data: { progress$: this.progress$ },
        });

        return forkJoin(toLoadFromNetwork.map(preloadItem => preloadItem.data$.pipe(
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
