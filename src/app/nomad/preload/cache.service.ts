import { Injectable } from '@angular/core';

interface CacheItem {
    data: any;
    maxAge: number;
    expirationDate: number;
}

@Injectable({
    providedIn: 'root'
})
export class CacheService {

    public isInCache(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    private getCacheItem(key: string): CacheItem {
        return JSON.parse(localStorage.getItem(key));
    }

    public getItem(key: string): any {
        return this.getCacheItem(key).data;
    }

    public getMaxAge(key: string): number {
        return JSON.parse(localStorage.getItem(key)).maxAge;
    }

    public isValid(key: string): boolean {
        return this.isInCache(key) && this.getCacheItem(key).expirationDate >= new Date().getTime();
    }

    public setItem(key: string, data: any, maxAge: number): void {
        localStorage.setItem(key, JSON.stringify({
            data,
            maxAge,
            expirationDate: new Date().getTime() + maxAge,
        }));
    }

    public updateItem(key: string, data: any): void {
        const cacheItem = this.getCacheItem(key);
        localStorage.setItem(key, JSON.stringify({
            data,
            maxAge: cacheItem.maxAge,
            expirationDate: new Date().getTime() + cacheItem.maxAge,
        }));
    }

    public partialUpdateById(key: string, partialData: any, idValue: any, idKey = 'id'): void {
        const updatedItem = this.getItem(key)
            .filter(e => e[idKey] !== idValue)
            .concat(partialData);
        this.updateItem(key, updatedItem);
    }

    public partialUpdateByQuery(key: string, partialData: any, query: (item) => boolean): void {
        const updatedItem = this.getItem(key)
            .filter(query)
            .concat(partialData);
        this.updateItem(key, updatedItem);
    }

    public partialDeleteById(key: string, idValue: any, idKey = 'id'): void {
        const updatedItem = this.getItem(key)
            .filter(e => e[idKey] !== idValue);
        this.updateItem(key, updatedItem);
    }

    public partialDeleteByQuery(key: string, query: (item) => boolean): void {
        const updatedItem = this.getItem(key)
            .filter(query);
        this.updateItem(key, updatedItem);
    }

}
