import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { Categorie } from 'src/app/models/categorie';
import { CategorieService } from 'src/app/services/categorie.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-up-categorie',
  imports: [
     FormsModule,
          MaterialModule,
          RouterModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
          MatCardModule,
          MatIconModule,
          MatButtonModule,
  ],
  templateUrl: './add-up-categorie.component.html',
  styleUrl: './add-up-categorie.component.scss'
})
export class AddUpCategorieComponent
implements OnInit{

  categorieForm!: FormGroup;
  categorie:Categorie | any;
  categories: Categorie[] = [];
  isEditMode: boolean;
  image!:File;

  // public imagePreview: string | ArrayBuffer | null = '../../../assets/images/preview.jpeg';
   
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  // imagePreview: string | ArrayBuffer | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  hidePassword = true;
  
  constructor(
    public dialogRef: MatDialogRef<AddUpCategorieComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route:Router,
    private categorieService:CategorieService, private fb: FormBuilder
  ){
    
  }
  
  ngOnInit(): void {
    this.isEditMode = !!this.data.categorie; // Si une categorie est passé, alors c'est le mode édition
    this.categorieForm = this.fb.group({
      idCategorie: [ this.isEditMode ? this.data.categorie?.idCategorie : '', this.isEditMode ? Validators.required : null],
      nomCategorie: [this.data?.categorie?.nomCategorie || '', Validators.required],
      image: [null],
      description: [this.data?.categorie?.description || '', Validators.required],
    });
    if (this.isEditMode && this.data?.categorie?.image) {
      this.imagePreview = this.data.categorie.image;
    }
  }


  chargerDonner():void{
    this.categorieService.getAllCategorie().subscribe(data => {
      this.categories = data;
      console.log("liste des categories: ", this.categories);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des categories:', error);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
   

  onSaves(): void {
   
    if (this.categorieForm.valid) {
      // const formData = { ...categorie };
      if (this.isEditMode) {
          const categorie = this.categorieForm.value;
          console.log("categorie value :" ,categorie);

        // Modifier categorie
        this.categorieService.modifierCategorie(this.data.categorie.idCategorie, categorie, this.image).subscribe(
          response => {
            Swal.fire('Succès !', 'Categorie modifié avec succès', 'success');
            this.dialogRef.close(response);
          },
          error => {
            console.log("categorie error simple :" ,error);
            Swal.fire('Erreur !', 'Erreur lors de la modification', error);
          }
        );
      } else {
        // Ajouter une categorie   
        const newCategorie: Categorie = this.categorieForm.value;
        // console.log("marque value :" ,newMarque);

        this.categorieService.ajouterCategorie(newCategorie, this.image).subscribe(
          (response) => {
            // console.log('Marque ajouté avec succès :', response);
            this.categorieForm.reset();
            Swal.fire('Succès !', 'Categorie ajouté avec succès', 'success');
            this.dialogRef.close(response);
          },
          (error) => {
            console.error("Erreur lors de l'ajout de la categorie :", error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error,
            });
          }
        );
      }
  }  else {
    this.showValidationErrors();
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs requis.',
      });
    }
  }

  

  private showValidationErrors() {
    Object.keys(this.categorieForm.controls).forEach(key => {
      const control = this.categorieForm.get(key);
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

