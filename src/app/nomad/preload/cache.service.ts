import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CacheService {

    public isInCache(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    public getItem(key: string): any {
        return JSON.parse(localStorage.getItem(key)).data;
    }

    public isValid(key: string): boolean {
        return this.isInCache(key) && this.getExpirationTime(key) >= new Date().getTime();
    }

    public getExpirationTime(key: string): number {
        return JSON.parse(localStorage.getItem(key)).expirationDate;
    }

    public setItem(key: string, data: any, maxAge: number): void {
        return localStorage.setItem(key, JSON.stringify({
            data,
            expirationDate: new Date().getTime() + maxAge,
        }));
    }

}
