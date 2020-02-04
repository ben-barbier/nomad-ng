import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { delay, finalize, retry, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { PreloadDialogComponent } from './preload-dialog/preload-dialog.component';
import { ConnectionService } from './connection.service';

export interface PreloadItem {
    cacheKey: string;
    data$: Observable<any>;
    storeData: (data: any) => void;
    maxAge: number;
}

export interface PreloadConfig {
    retry: number;
}

@Injectable({
    providedIn: 'root'
})
export class PreloadService {

    private DEFAULT_CONFIG = { retry: 0 };

    constructor(
        private dialog: MatDialog,
        private connectionService: ConnectionService
    ) { }

    public preload(preloadList: PreloadItem[], preloadConfig?: PreloadConfig): Promise<any> {

        const config = { ...this.DEFAULT_CONFIG, ...preloadConfig };

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
            return this.loadFromNetworkAndDisplayProgressDialog(toLoadFromNetwork, config);
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

    private loadFromNetworkAndDisplayProgressDialog(toLoadFromNetwork: any[], config: PreloadConfig): Promise<any> {

        const progress$ = new BehaviorSubject<{ success: number, total: number }>({ success: 0, total: toLoadFromNetwork.length });

        const preloadDialog = this.dialog.open(PreloadDialogComponent, {
            disableClose: true,
            data: { progress$ },
        });

        return forkJoin(toLoadFromNetwork.map(preloadItem => preloadItem.data$.pipe(
            retry(config.retry),
            tap(data => preloadItem.storeData(data)),
            tap(data => localStorage.setItem(preloadItem.cacheKey, JSON.stringify({
                data,
                expirationDate: new Date().getTime() + preloadItem.maxAge,
            }))),
            tap(() => this.increaseProgress(progress$)),
        ))).pipe(
            delay(150), // To display 100% value
            finalize(() => preloadDialog.close()),
        ).toPromise();

    }

    private increaseProgress = (progress$) => progress$.next({ ...progress$.getValue(), success: progress$.getValue().success + 1 });

}
