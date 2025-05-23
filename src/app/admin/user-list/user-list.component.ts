import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Utilisateur } from 'src/app/models/utilisateur';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import Swal from 'sweetalert2';
import { AddUpUserComponent } from '../add-up-user/add-up-user.component';

@Component({
  selector: 'app-user-list',
  imports: [
     MatTableModule,
        CommonModule,
        MatCardModule,
        MaterialModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit{

    // table 1
    tempStatus!: boolean; // Variable temporaire pour stocker l'état
    displayedColumns: string[] = ['actif', 'prenom', 'nom', 'numero','roleUtilisateur' , 'nonStructure',  'photo' ,  'email', 'refreshToken' , 'dateInscription', 'dateModif', 'action' ];
    dataSource = new MatTableDataSource<Utilisateur>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    utilisateurs: Utilisateur[] = [];
    loading: boolean = true;

    constructor(private dialog: MatDialog , private cd: ChangeDetectorRef, private utilisateurService: UtilisateurService) { }


    ngOnInit(): void {
        this.utilisateurService.getAllUtilisateur().subscribe(data => {
          console.log("RAW DATA: ", data);
          console.log("Nombre d’utilisateurs :", data.length);
          this.utilisateurs = data;
          this.dataSource.data = this.utilisateurs;
          // this.dataSource = new MatTableDataSource(this.utilisateurs);
          this.loading = false; // Fin du chargement
          
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log("liste des users: ", this.utilisateurs);
        },
        (error) => {
          console.error('Erreur lors du chargement de la liste des users:', error);
          this.loading = false; // Fin du chargement même en cas d'erreur
        });
    }

    chargerDonner(): void {
      this.utilisateurService.getAllUtilisateur().subscribe(data => {
 
        this.utilisateurs = data;
        this.dataSource.data = this.utilisateurs;
        // this.dataSource = new MatTableDataSource(this.utilisateurs);
        this.loading = false; // Fin du chargement
        
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log("liste des users: ", this.utilisateurs);
      },
      (error) => {
        console.error('Erreur lors du chargement de la liste des users:', error);
        this.loading = false; // Fin du chargement même en cas d'erreur
      });
    }

    onDesActivate(element: Utilisateur) {
      // Sauvegardez l'état initial du switch
      this.tempStatus = element.actif;
      
      Swal.fire({
        title: 'Êtes-vous sûr de vouloir désactiver cette personne?',
        text: 'Il ne pourra plus accéder à la plateforme!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, désactive-le!',
        cancelButtonText: 'Non, garde-le'
      }).then((result) => {
        if (result.isConfirmed) {
          this.utilisateurService.desactiverUtilisateur(element.idUtilisateur).subscribe(
            () => {
              Swal.fire(
                'Désactivation!',
                `${element.nom} a été désactivé.`,
                'success'
              );
              // Mettre à jour l'état dans le composant ou le tableau
              this.chargerDonner(); // Recharger les données si nécessaire
            },
            (error) => {
              console.error('Erreur lors de la désactivation : ', error);
              element.actif = this.tempStatus; // Réinitialiser l'état en cas d'erreur
              Swal.fire(
                'Erreur!',
                'Une erreur est survenue lors de la désactivation.',
                'error'
              );
              this.chargerDonner(); // Recharger les données si nécessaire
            }
          );
        } else if (result.isDismissed) {
          element.actif = this.tempStatus; // Réinitialisez l'état si l'action est annulée
          Swal.fire(
            'Annulé',
            'Désactivation annulée',
            'error'
          );
          this.chargerDonner(); // Recharger les données si nécessaire
        }
      });
    }

    openDialog(utilisateur?: Utilisateur): void {
      const dialogRef = this.dialog.open(AddUpUserComponent, {
        width: '500px',
        data: { utilisateur }
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
  
    editElement(utilisateur: Utilisateur): void {
      this.openDialog(utilisateur);
      // console.log("user open dialog: ", user);
    }

  
    onActivate(element: Utilisateur) {
      // Sauvegardez l'état initial du switch
      this.tempStatus = element.actif;
    
      Swal.fire({
        title: 'Êtes-vous sûr de vouloir activer cette personne?',
        text: 'Il pourra accéder à la plateforme!',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Oui, active-le!',
        cancelButtonText: 'Non, garde-le'
      }).then((result) => {
        if (result.isConfirmed) {
          this.utilisateurService.activerUtilisateur(element.idUtilisateur).subscribe(
            () => {
              Swal.fire(
                'Activation!',
                `${element.nom} a été activé.`,
                'success'
              );
              // Mettre à jour l'état dans le composant ou le tableau
              this.chargerDonner(); // Recharger les données si nécessaire
            },
            (error) => {
              console.error('Erreur lors de l\'activation : ', error);
              element.actif = this.tempStatus; // Réinitialiser l'état en cas d'erreur
              Swal.fire(
                'Erreur!',
                'Une erreur est survenue lors de l\'activation.',
                'error'
              );
              this.chargerDonner(); // Recharger les données si nécessaire
            }
          );
        } else if (result.isDismissed) {
          element.actif = this.tempStatus; // Réinitialisez l'état si l'action est annulée
          Swal.fire(
            'Annulé',
            'Activation annulée',
            'error'
          );
          this.chargerDonner(); // Recharger les données si nécessaire
    
        }
      });
    }
    
    
    
      onDelete(element:Utilisateur):void{
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
            this.utilisateurService.deleteUtilisateur(element.idUtilisateur).subscribe(
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
