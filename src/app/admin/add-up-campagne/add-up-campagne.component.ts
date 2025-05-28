import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { Campagne } from 'src/app/models/campagne';
import { Categorie } from 'src/app/models/categorie';
import { Utilisateur } from 'src/app/models/utilisateur';
import { CampagneService } from 'src/app/services/campagne.service';
import { CategorieService } from 'src/app/services/categorie.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-up-campagne',
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
  templateUrl: './add-up-campagne.component.html',
  styleUrl: './add-up-campagne.component.scss'
})
export class AddUpCampagneComponent implements OnInit{

  campagneForm!: FormGroup;
  campagne:Campagne | any;
  campagnes: Campagne[] = [];
  categories: Categorie[] = [];
  isEditMode: boolean;
  photo!:File;
  selectedUtilisateur!:Utilisateur

  // public imagePreview: string | ArrayBuffer | null = '../../../assets/images/preview.jpeg';
   
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  // imagePreview: string | ArrayBuffer | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  hidePassword = true;
  userRecup!:any | null;
  minDate!:any;
  private userSubscription!: Subscription;
  minDateTime!: string;

  
  constructor(
    public dialogRef: MatDialogRef<AddUpCampagneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route:Router,
    private campagneService:CampagneService,
    private utilisateurService:UtilisateurService,
    private categorieService:CategorieService, private fb: FormBuilder
  ){
    
  }
  
  ngOnInit(): void {
    this.minDateTime = this.getMinDateTime();
    this.userSubscription = this.utilisateurService.getUtilisateurConnect().subscribe(user => {
   this.userRecup = user;
   // Si nécessaire, actualiser la vue ou effectuer des actions spécifiques ici
   console.log("user recup :" , this.userRecup)
 });
    this.isEditMode = !!this.data.campagne; // Si une campagne est passé, alors c'est le mode édition
    this.campagneForm = this.fb.group({
      idCampagne: [ this.isEditMode ? this.data.campagne?.idCampagne : '', this.isEditMode ? Validators.required : null],
      titre: [this.data?.campagne?.titre || '', Validators.required],
      imageUrl: [null],
      description: [this.data?.campagne?.description || '', Validators.required],
      lieu: [this.data?.campagne?.lieu || '', Validators.required],
      montantCible: [this.data?.campagne?.montantCible || '', Validators.required],
      dateLimite: [this.data?.campagne?.dateLimite || '', Validators.required],
      createur: [this.userRecup.utilisateur, Validators.required],
      categorie: [this.data?.campagne?.categorie || '', Validators.required],
      active: [this.data?.utilisateur?.active ?? true],
    });
    if (this.isEditMode && this.data?.campagne?.imageUrl) {
      this.imagePreview = this.data.campagne.imageUrl;
    }
     
    this.categorieService.getAllCategorie().subscribe(
      data => {
        this.categories = data;
        // console.log("liste des categories: ", this.categories);
      },
      error => {
        console.error('Erreur lors du chargement de la liste des vcategories :', error);
      }
    );
    this.isEditMode ? this.loadSelectOptions() : null;

  }


  private loadSelectOptions(): void {
    this.categorieService.getAllCategorie().subscribe(
      (categroies: Categorie[]) => {
        this.categories = categroies;
        
        // Pour le mode édition, assurez-vous que la valeur du formulaire est correctement définie
        if (this.isEditMode && this.data.campagne?.categorie) {
          const categorie = this.categories.find(r => r.idCategorie === this.data.campagne.categorie.idCategorie);
          if (categorie) {
            this.campagneForm.patchValue({ categorie: categorie });
            console.log("voiture louer pour la livrason  mcll:", categorie.nomCategorie);
          }
        }
      },
      error => {
        console.error('Erreur lors du chargement de la categorie de la campagne :', error);
      }
    );

  }

  
  getMinDateTime(): string {
    const now = new Date();
    now.setDate(now.getDate() + 2);
    return now.toISOString().slice(0, 16); // Format 'YYYY-MM-DDTHH:mm'
  }

  // Validator personnalisé pour le contrôle de date
  dateMinValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
       this.minDate = new Date();
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      // this.minDate.setDate(this.minDate.getDate() + 2);
      return selectedDate >= this.minDate ? null : { dateMin: true };
    };
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
    this.campagneService.getAllCampagne().subscribe(data => {
      this.campagnes = data;
      console.log("liste des campagnes: ", this.campagnes);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des campagnes:', error);
    });
   
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
   

  onSaves(): void {

    
      if (this.campagneForm.valid) {
        const campagne = this.campagneForm.value;
        console.log("campagne value :" ,campagne);
        if (this.isEditMode) {
          // const formData = { ...campagne };
        // Supprimer le champ `password` s’il est vide
       
        // Modifier campagne
        this.campagneService.modifierCampagne(this.data.campagne.idCampagne, campagne, this.photo).subscribe(
          response => {
            Swal.fire('Succès !', 'Projet modifié avec succès', 'success');
            this.dialogRef.close(response);
          },
          error => {
            console.log("campagne error simple :" ,error);
            Swal.fire('Erreur !', 'Erreur lors de la modification', error);
          }
        );
      } else {
        // Ajouter une campagne 
        const newCampagne: Campagne = this.campagneForm.value;
        this.campagneService.ajouterCampagne(newCampagne, this.photo).subscribe(
          (response) => {
            this.campagneForm.reset();
            Swal.fire('Succès !', 'Campagne ajouté avec succès', 'success');
            this.dialogRef.close(response);
          },
          (error) => {
            console.error("Erreur lors de l'ajout de la campagne :", error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error,
            });
          }
        );
      }
    }else {
      // this.showValidationErrors(); 
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs requis.',
      });
    }
  }

  private showValidationErrors() {
    Object.keys(this.campagneForm.controls).forEach(key => {
      const control = this.campagneForm.get(key);
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

