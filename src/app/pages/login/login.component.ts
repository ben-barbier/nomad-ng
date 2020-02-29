import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { PreloadService } from '../../nomad/preload/preload.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    constructor(
        private authService: AuthService,
        private router: Router,
        private preloadService: PreloadService,
        private snackBar: MatSnackBar,
    ) { }

    public login() {
        this.authService.isLogged$.next(true);

        // 🚀: If your API need athentication, we can launch the preload before redirection like this :
        this.preloadService.preload({ retry: 2 })
            .then(() => this.router.navigate(['']))
            .catch(err => this.snackBar.open(err.message || err));

    }

}
