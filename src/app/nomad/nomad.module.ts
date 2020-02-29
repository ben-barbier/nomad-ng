import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { PreloadDialogComponent } from './preload/preload-dialog/preload-dialog.component';
import { SavingIndicatorComponent } from './offline/saving-indicator/saving-indicator.component';
import { OfflineIndicatorComponent } from './offline/offline-indicator/offline-indicator.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { OfflineInterceptor } from './offline/offline.interceptor';

@NgModule({
    declarations: [
        PreloadDialogComponent,
        SavingIndicatorComponent,
        OfflineIndicatorComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatDialogModule,
        MatTooltipModule,
    ],
    exports: [
        OfflineIndicatorComponent,
        SavingIndicatorComponent,
    ],
    providers: [],
})
export class NomadModule {
    constructor(@Optional() @SkipSelf() parentModule?: NomadModule) {
        if (parentModule) {
            throw new Error('NomadModule is already loaded. Import it in the AppModule only.');
        }
    }

    static forRoot(): ModuleWithProviders<NomadModule> {
        return {
            ngModule: NomadModule,
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: OfflineInterceptor,
                    multi: true,
                },
            ]
        };
    }
}
