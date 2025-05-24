import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { Utilisateur } from 'src/app/models/utilisateur';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-up-user',
   imports: [
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    MatDialogModule,
    MatFormFieldModule,
          MatCardModule,
          MatIconModule,
          MatButtonModule,
    ],
  templateUrl: './add-up-user.component.html',
  styleUrl: './add-up-user.component.scss'
})
export class AddUpUserComponent implements OnInit{

  userForm!: FormGroup;
  utilisateur:Utilisateur | any;
  utilisateurs: Utilisateur[] = [];
  isEditMode: boolean;
  photo!:File;

  // public imagePreview: string | ArrayBuffer | null = '../../../assets/images/preview.jpeg';
   
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  // imagePreview: string | ArrayBuffer | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  hidePassword = true;
  
  constructor(
    public dialogRef: MatDialogRef<AddUpUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route:Router,
    private utilisateurService:UtilisateurService, private fb: FormBuilder
  ){
    
  }
  
  ngOnInit(): void {
    this.isEditMode = !!this.data.utilisateur; // Si un utilisateur est passé, alors c'est le mode édition
    this.userForm = this.fb.group({
      idUtilisateur: [ this.isEditMode ? this.data.utilisateur?.idUtilisateur : '', this.isEditMode ? Validators.required : null],
      nonStructure: [this.data?.utilisateur?.nonStructure || '', Validators.required],
      photo: [null],
      prenom: [this.data?.utilisateur?.prenom || '', Validators.required],
      nom: [this.data?.utilisateur?.nom || '', Validators.required],
      numero: [this.data?.utilisateur?.numero || '', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      addresse: [this.data?.utilisateur?.addresse || '', Validators.required],
      email: [this.data?.utilisateur?.email || '', [Validators.required, Validators.email]],
      // password: ['', this.isEditMode ?  null : Validators.required],
      password: [''],  // Pas de Validators.required
      // roleUtilisateur:  [ '', Validators.required],
      roleUtilisateur: [this.data?.utilisateur?.roleUtilisateur || '', Validators.required],
      actif: [this.data?.utilisateur?.actif ?? true],
    });
    if (this.isEditMode && this.data?.utilisateur?.photo) {
      this.imagePreview = this.data.utilisateur.photo;
    }

  }


  // private loadExistingImage(imagePath: string): void {
  //   // Construct the URL for the existing image
  //   const imageUrl = `http://localhost/${imagePath}`;
  //   this.imagePreview = imageUrl;
  // }
  private loadExistingImage(imagePath: string): void {
    // Construct the URL for the existing image
    const imageUrl = `http://185.194.216.57:9000/marque/${imagePath}`;
    this.imagePreview = imageUrl;
  }


  // onFileChange(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files[0]) {
  //     const file = input.files[0];
  //     const reader = new FileReader();
      
  //     reader.onload = () => {
  //       this.imagePreview = reader.result;
  //     };
      
  //     reader.readAsDataURL(file);
  //     this.marqueForm.patchValue({
  //       logo: file
  //     });
  //   }
  // }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      
      reader.readAsDataURL(file);
      this.photo = file; // Mettre à jour la propriété locale
      // Reset the file input value to avoid issues
      input.value = '';
    }
  }

  //Afficher le lien de l'image
  ImageChange(event:any){
    this.photo = event.target.files[0];
    // console.log("Image uploiarder ", this.logo);
  }

  chargerDonner():void{
    this.utilisateurService.getAllUtilisateur().subscribe(data => {
      this.utilisateurs = data;
      console.log("liste des users: ", this.utilisateurs);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des users:', error);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
   

  onSaves(): void {

      if (this.userForm.valid) {
        if (this.isEditMode) {
          const utilisateur = this.userForm.value;
          console.log("utilisateur value :" ,utilisateur);
          const formData = { ...utilisateur };
        // Supprimer le champ `password` s’il est vide
        if (!formData.password?.trim()) {
          delete formData.password;
        }
        // Modifier utilisateur
        this.utilisateurService.modifierUtilisateur(this.data.utilisateur.idUtilisateur, utilisateur, this.photo).subscribe(
          response => {
            Swal.fire('Succès !', 'Utilisateur modifié avec succès', 'success');
            this.dialogRef.close(response);
          },
          error => {
            console.log("utilisateur error simple :" ,error);
            Swal.fire('Erreur !', 'Erreur lors de la modification', error);
          }
        );
      } else {
        // Ajouter un utilisateur 
        const newUtilisateur: Utilisateur = this.userForm.value;
        this.utilisateurService.ajouterUtilisateur(newUtilisateur, this.photo).subscribe(
          (response) => {
            this.userForm.reset();
            Swal.fire('Succès !', 'Utilisateur ajouté avec succès', 'success');
            this.dialogRef.close(response);
          },
          (error) => {
            console.error("Erreur lors de l'ajout de l'utilisateur :", error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error,
            });
          }
        );
      }
    }else {
      this.showValidationErrors();
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs requis.',
      });
    }
  }

  private showValidationErrors() {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control) {
        const controlErrors = control.errors as ValidationErrors | null; // Assertion de type
        if (controlErrors) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log(`Control ${key} has error: ${keyError}`);
          });
        }
      }
    });
  }

}

