import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { OfflineService } from './offline.service';
import { ConnectionService } from '../connection.service';
import { NOMAD_OPTIONS, NomadOptions } from '../nomad.options';

@Injectable()
export class OfflineInterceptor implements HttpInterceptor {

    private options: NomadOptions = { ...new NomadOptions(), ...this.appNomadOptions };

    constructor(
        private connectionService: ConnectionService,
        private offlineService: OfflineService,
        @Inject(NOMAD_OPTIONS) private appNomadOptions: NomadOptions,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.offlineService.isPendingRequest(req)) {
            const clone = req.clone({ headers: req.headers.delete('fromOfflineService') });
            // TODO: manage header 'Authorization'
            return next.handle(clone);
        }

        if (
            this.queryUpdateData(req) && !this.isIgnoredUrl(req) &&
            (!this.connectionService.isOnline$.getValue() || this.offlineService.hasPendingRequest())
        ) {
            this.offlineService.addRequestToQueue(req);
            return of(new HttpResponse({ status: 200 }));
        }

        return next.handle(req);

    }

    private queryUpdateData(req: HttpRequest<any>): boolean {
        return !['GET', 'HEAD', 'OPTIONS'].some(idempotentMethod => req.method === idempotentMethod);
    }

    private isIgnoredUrl(req: HttpRequest<any>): boolean {
        return this.options.offlineIgnoredPaths.some(url => req.url.includes(url));
    }

}
