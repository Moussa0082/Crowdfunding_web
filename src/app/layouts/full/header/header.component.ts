import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Utilisateur } from 'src/app/models/utilisateur';
import { Subscription } from 'rxjs';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit{
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  
  userRecup!:any | null;
  private userSubscription!: Subscription;

  constructor(
    private router:Router,
    private utilisateurService:UtilisateurService
  ) { }

  ngOnInit(): void {
       this.userSubscription = this.utilisateurService.getUtilisateurConnect().subscribe(user => {
      this.userRecup = user;
    
      // Si nécessaire, actualiser la vue ou effectuer des actions spécifiques ici
      console.log("user recup :" , this.userRecup)
    });
  }

  ngOnDestroy(): void {
    // Se désabonner pour éviter les fuites de mémoire
    this.userSubscription.unsubscribe();
  }

  logout():void{
    Swal.fire({
      title: "Etes vous sûr?",
      text: "Voulez - vous , vous decconecter?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText:"Non",
      confirmButtonText: "Oui, je veux!"
    }).then((result) => {
      if (result.isConfirmed) {
            // Handle success
            this.utilisateurService.logout();
          // Réinitialiser userRecup
          this.userRecup = null;
          this.router.navigate(['/authentication/login']);
            console.log('User disabled successfully');
      }else{
        console.log( "deconnection annuler");

      }
    });

  }

}