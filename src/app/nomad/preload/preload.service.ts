import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { delay, finalize, retry, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { PreloadDialogComponent } from './preload-dialog/preload-dialog.component';
import { CacheService } from './cache.service';
import { ConnectionService } from '../connection.service';

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
    private preloadList: PreloadItem[] = [];

    constructor(
        private dialog: MatDialog,
        private connectionService: ConnectionService,
        private cacheService: CacheService,
    ) { }

    public configPreload(preloadList: PreloadItem[]): void {
        this.preloadList = preloadList;
    }

    public preload(preloadConfig?: PreloadConfig): Promise<any> {

        const config = { ...this.DEFAULT_CONFIG, ...preloadConfig };

        const { toLoadFromNetwork, toLoadFromCache } = this.getPreloadOrigins(this.preloadList);

        const isOffline = this.connectionService.isOnline$.getValue() === false;

        if (isOffline) {
            const preloadListContainsUncachedItem = this.preloadList.some(item => !this.cacheService.isInCache(item.cacheKey));
            if (preloadListContainsUncachedItem) {
                return Promise.reject('Preload list contains uncached item and device is offline.');
            }
            this.preloadList.forEach(item => item.storeData(this.cacheService.getItem(item.cacheKey)));
        } else {
            toLoadFromCache.forEach(item => item.storeData(this.cacheService.getItem(item.cacheKey)));
        }

        if (toLoadFromNetwork.length > 0) {
            return this.loadFromNetworkAndDisplayProgressDialog(toLoadFromNetwork, config);
        } else {
            return Promise.resolve();
        }

    }

    private getPreloadOrigins(preloadList: PreloadItem[]): { toLoadFromNetwork: PreloadItem[], toLoadFromCache: PreloadItem[] } {

        return preloadList.reduce((acc, preloadItem) => {
            if (!this.cacheService.isInCache(preloadItem.cacheKey)) {
                return { ...acc, toLoadFromNetwork: [...acc.toLoadFromNetwork, preloadItem] };
            } else if (!this.cacheService.isValid(preloadItem.cacheKey)) {
                return { ...acc, toLoadFromNetwork: [...acc.toLoadFromNetwork, preloadItem] };
            } else {
                return { ...acc, toLoadFromCache: [...acc.toLoadFromCache, preloadItem] };
            }
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
            tap(data => this.cacheService.setItem(preloadItem.cacheKey, data, preloadItem.maxAge)),
            tap(() => this.increaseProgress(progress$)),
        ))).pipe(
            delay(150), // To display 100% value
            finalize(() => preloadDialog.close()),
        ).toPromise();

    }

    private increaseProgress = (progress$) => progress$.next({ ...progress$.getValue(), success: progress$.getValue().success + 1 });

}
