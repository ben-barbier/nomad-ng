import { NgModule } from '@angular/core';
import { PreloadDialogComponent } from './preload/preload-dialog/preload-dialog.component';
import { OfflineIndicatorComponent } from './offline/offline-indicator/offline-indicator.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        PreloadDialogComponent,
        OfflineIndicatorComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatDialogModule,
    ],
    exports: [
        OfflineIndicatorComponent,
    ],
})
export class NomadModule {}
