import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(
        private snackBar: MatSnackBar,
    ) { }

    public success(message: string): void {
        this.snackBar.open(`✅ ${message}`);
    }

    public error(message: string): void {
        this.snackBar.open(`☠️ ${message}`);
    }

}
