import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HomeComponent } from './pages/home/home.component';
import { NavComponent } from './shared/components/nav/nav.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { PreloadItem, PreloadService } from './nomad/preload/preload.service';
import { PreloadDialogComponent } from './nomad/preload/preload-dialog/preload-dialog.component';
import { MatProgressBarModule } from '@angular/material';
import { CitiesService } from './shared/services/cities.service';
import { CustomersService } from './shared/services/customers.service';
import { StoreService } from './shared/services/store.service';

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        HomeComponent,
        NavComponent,
        PreloadDialogComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        BrowserAnimationsModule,
        FormsModule,
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatProgressBarModule,
    ],
    providers: [{
        provide: APP_INITIALIZER,
        useFactory: preload,
        deps: [PreloadService, StoreService, CitiesService, CustomersService],
        multi: true
    }],
    bootstrap: [AppComponent],
    entryComponents: [
        PreloadDialogComponent,
    ]
})
export class AppModule {
}

export function preload(
    preloadService: PreloadService,
    store: StoreService,
    citiesService: CitiesService,
    customersService: CustomersService,
): () => Promise<any> {

    const preloadList: PreloadItem[] = [
        {
            cacheKey: 'cities',
            data$: citiesService.getAll(),
            storeData: (cities) => store.cities$.next(cities),
            maxAge: 2 * 60 * 60 * 1000,
        },
        {
            cacheKey: 'customers',
            data$: customersService.getAll(),
            storeData: (customers) => store.customers$.next(customers),
            maxAge: 2 * 60 * 60 * 1000,
        },
    ];

    return () => preloadService.preload(preloadList, { retry: 2 }).catch(err => alert(err));

}
