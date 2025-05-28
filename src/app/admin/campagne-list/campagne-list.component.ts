import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Campagne } from 'src/app/models/campagne';
import { CampagneService } from 'src/app/services/campagne.service';
import Swal from 'sweetalert2';
import { AddUpCampagneComponent } from '../add-up-campagne/add-up-campagne.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-campagne-list',
  imports: [
    MatTableModule,
        CommonModule,
        MatCardModule,
        MaterialModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
  ],
  templateUrl: './campagne-list.component.html',
  styleUrl: './campagne-list.component.scss'
})
export class CampagneListComponent implements OnInit{

  // table 1
  tempStatus!: boolean; // Variable temporaire pour stocker l'état
  displayedColumns: string[] = ['active', 'prenom','lieu' , 'jourRestant' ,'nom', 'titre','description' , 'montantCible',  'montantActuel' ,  'pourcentage', 'dateLimite' , 'imageUrl' , 'validee' , 'categorie' , 'dateCreation', 'dateModif', 'action' ];
  dataSource = new MatTableDataSource<Campagne>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  campagnes: Campagne[] = [];
  loading: boolean = true;



  constructor(private dialog: MatDialog , private cd: ChangeDetectorRef, private campagneService: CampagneService) { }


  ngOnInit(): void {
      this.campagneService.getAllCampagne().subscribe(data => {
        console.log("RAW DATA: ", data);
        console.log("Nombre campagnes :", data.length);
        this.campagnes = data;
        this.dataSource.data = this.campagnes;
        // this.dataSource = new MatTableDataSource(this.utilisateurs);
        this.loading = false; // Fin du chargement
        
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log("liste des campagnes: ", this.campagnes);
      },
      (error) => {
        console.error('Erreur lors du chargement de la liste des campagnes:', error);
        this.loading = false; // Fin du chargement même en cas d'erreur
      });
  }

  chargerDonner(): void {
    this.campagneService.getAllCampagne().subscribe(data => {

      this.campagnes = data;
      this.dataSource.data = this.campagnes;
      // this.dataSource = new MatTableDataSource(this.utilisateurs);
      this.loading = false; // Fin du chargement
      
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste des campagnes: ", this.campagnes);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des campagnes:', error);
      this.loading = false; // Fin du chargement même en cas d'erreur
    });
  }

  onDesActivate(element: Campagne) {
    // Sauvegardez l'état initial du switch
    this.tempStatus = element.active;
    
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir désactiver cette campagne?',
      text: 'Elle ne sera plus visible sur la plateforme!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, désactive-la!',
      cancelButtonText: 'Non, garde-la'
    }).then((result) => {
      if (result.isConfirmed) {
        this.campagneService.desactiverCampagne(element.idCampagne).subscribe(
          () => {
            Swal.fire(
              'Désactivation!',
              `${element.titre} a été désactivé.`,
              'success'
            );
            // Mettre à jour l'état dans le composant ou le tableau
            this.chargerDonner(); // Recharger les données si nécessaire
          },
          (error) => {
            console.error('Erreur lors de la désactivation : ', error);
            element.active = this.tempStatus; // Réinitialiser l'état en cas d'erreur
            Swal.fire(
              'Erreur!',
              'Une erreur est survenue lors de la désactivation.',
              'error'
            );
            this.chargerDonner(); // Recharger les données si nécessaire
          }
        );
      } else if (result.isDismissed) {
        element.active = this.tempStatus; // Réinitialisez l'état si l'action est annulée
        Swal.fire(
          'Annulé',
          'Désactivation annulée',
          'error'
        );
        this.chargerDonner(); // Recharger les données si nécessaire
      }
    });
  }

  openDialog(campagne?: Campagne): void {
    const dialogRef = this.dialog.open(AddUpCampagneComponent, {
      width: '500px',
      data: { campagne }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log('Dialog closed with result:', result);
        this.chargerDonner();
      } else {
        // console.log('Dialog closed without result');
      }
    });
  }

  editElement(campagne: Campagne): void {
    this.openDialog(campagne);
    // console.log("user open dialog: ", user);
  }


  onActivate(element: Campagne) {
    // Sauvegardez l'état initial du switch
    this.tempStatus = element.active;
  
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir activer cette campagne?',
      text: 'Elle sera visible sur la plateforme!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Oui, active-la!',
      cancelButtonText: 'Non, garde-la'
    }).then((result) => {
      if (result.isConfirmed) {
        this.campagneService.activerCampagne(element.idCampagne).subscribe(
          () => {
            Swal.fire(
              'Activation!',
              `${element.titre} a été activé.`,
              'success'
            );
            // Mettre à jour l'état dans le composant ou le tableau
            this.chargerDonner(); // Recharger les données si nécessaire
          },
          (error) => {
            console.error('Erreur lors de l\'activation : ', error);
            element.active = this.tempStatus; // Réinitialiser l'état en cas d'erreur
            Swal.fire(
              'Erreur!',
              'Une erreur est survenue lors de l\'activation.',
              'error'
            );
            this.chargerDonner(); // Recharger les données si nécessaire
          }
        );
      } else if (result.isDismissed) {
        element.active = this.tempStatus; // Réinitialisez l'état si l'action est annulée
        Swal.fire(
          'Annulé',
          'Activation annulée',
          'error'
        );
        this.chargerDonner(); // Recharger les données si nécessaire
  
      }
    });
  }
  
  
  
    onDelete(element:Campagne):void{
      Swal.fire({
        title: "Etes vous supprimer?",
        text: "Voulez - vous supprimer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText:"Non",
        confirmButtonText: "Oui, je veux supprimer!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.campagneService.deleteCampagne(element.idCampagne).subscribe(
            (result) => {
              this.chargerDonner(); // Recharger la liste après la suppression réussie
              // console.log( "result delete : ", result);
            }
          );
          // console.log("id User", element.idUser);
          Swal.fire({
            title: "Supprimer!",
            text: "Suppression réussi.",
            icon: "success"
          });
        }else{
          Swal.fire(
            'Suppression annulée!',
            'Cette suppresion a été annulée.',
            'error'
          )
        }
      });
    }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}





}

