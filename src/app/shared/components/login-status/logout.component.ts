import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

    public isLogged$ = this.authService.isLogged$;

    constructor(private authService: AuthService) { }

    public logout() {
        this.authService.isLogged$.next(false);
    }
}
