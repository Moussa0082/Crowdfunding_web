import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Categorie } from 'src/app/models/categorie';
import { CategorieService } from 'src/app/services/categorie.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-up-categorie',
  imports: [],
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
      this.image = file; // Mettre à jour la propriété locale
      // Reset the file input value to avoid issues
      input.value = '';
    }
  }

  //Afficher le lien de l'image
  ImageChange(event:any){
    this.image = event.target.files[0];
    // console.log("Image uploiarder ", this.logo);
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
    // if (this.photo == null ) {
    //   Swal.fire({
    //     title: 'Erreur!',
    //     text: 'Une image est requise ',
    //     icon: 'error',
    //     confirmButtonText: 'OK'
    //   })
    //   return

    // }
   
      if (this.isEditMode) {
        const categorie = this.categorie.value;
        console.log("categorie value :" ,categorie);
        this.showValidationErrors();
        const formData = { ...categorie };
        if (this.categorieForm.valid) {

        // Modifier marque
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
            this.categorie.reset();
            Swal.fire('Succès !', 'Categorie ajouté avec succès', 'success');
            this.dialogRef.close(response);
          },
          (error) => {
            console.error("Erreur lors de l'ajout de la categorie :", error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.error.message,
            });
          }
        );
      }
    }else {
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

