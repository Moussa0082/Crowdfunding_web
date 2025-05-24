import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { UtilisateurService } from 'src/app/services/utilisateur.service';

@Component({
  selector: 'app-side-login',
  // imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
   imports: [
      FormsModule,
      MaterialModule,
      RouterModule,
        ReactiveFormsModule,
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
              MatCardModule,
              MatIconModule,
              MatButtonModule,
        ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnInit{

  constructor( private router: Router, private utilisateurService:UtilisateurService) {}

  hidePassword = true;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    // email: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.loginForm.controls;
  }


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    const { email, password } = this.loginForm.value;
  
    if (this.loginForm.valid) {
      this.utilisateurService.loginUtilisateur(email, password).subscribe(
        (response) => {
          // Gérer la connexion réussie ici
          console.log(response);
          this.utilisateurService.setutilisateurConnect(response);
  
          // Rediriger vers la page appropriée
          // if(response.utilisateur.roleUtilisateur.toLocaleLowerCase()=== 'admin'){
            this.router.navigate(['/dashboard']);
          // }
          // else{
          //   this.router.navigate(['/vlpart']);
          // }
          this.loginForm.reset();
        },
        error => {
          // console.error("Erreur lors de la connexion :", error);
          
          // Vérifier si `error.error` et `error.error.message` existent avant de les utiliser
          const errorMessage = error.error?.message || 'Une erreur est survenue';
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: errorMessage,
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs requis.',
      });
    }
  }
  

  submit() {
    // console.log(this.form.value);
    this.router.navigate(['/dashboard']);
  }
}
