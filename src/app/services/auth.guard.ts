// import { CanActivateFn } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilisateurService } from './utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private utlisateurService: UtilisateurService, private router: Router) {}

  canActivate(): boolean {
    if (this.utlisateurService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/authentication/login']); // Redirige vers la page de connexion
      return false;
    }
  }
}
