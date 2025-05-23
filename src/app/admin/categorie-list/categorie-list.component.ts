import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { Categorie } from 'src/app/models/categorie';
import { CategorieService } from 'src/app/services/categorie.service';
import { AddUpCategorieComponent } from '../add-up-categorie/add-up-categorie.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorie-list',
  imports: [
    MatTableModule,
        CommonModule,
        MatCardModule,
        MaterialModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
  ],
  templateUrl: './categorie-list.component.html',
  styleUrl: './categorie-list.component.scss'
})
export class CategorieListComponent implements OnInit{

  // table 1
  tempStatus!: boolean; // Variable temporaire pour stocker l'état
  displayedColumns: string[] = ['nomCategorie', 'description', 'image', 'dateCreation','dateModif' , 'action' ];
  dataSource = new MatTableDataSource<Categorie>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  categories: Categorie[] = [];
  loading: boolean = true;

  constructor(private dialog: MatDialog , private cd: ChangeDetectorRef, private categorieService: CategorieService) { }


  ngOnInit(): void {
      this.categorieService.getAllCategorie().subscribe(data => {
        console.log("RAW DATA: ", data);
        console.log("Nombre de categories :", data.length);
        this.categories = data;
        this.dataSource.data = this.categories;
        // this.dataSource = new MatTableDataSource(this.utilisateurs);
        this.loading = false; // Fin du chargement
        
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log("liste des categories: ", this.categories);
      },
      (error) => {
        console.error('Erreur lors du chargement de la liste des categories:', error);
        this.loading = false; // Fin du chargement même en cas d'erreur
      });
  }

  chargerDonner(): void {
    this.categorieService.getAllCategorie().subscribe(data => {

      this.categories = data;
      this.dataSource.data = this.categories;
      // this.dataSource = new MatTableDataSource(this.utilisateurs);
      this.loading = false; // Fin du chargement
      
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste des categories: ", this.categories);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des users:', error);
      this.loading = false; // Fin du chargement même en cas d'erreur
    });
  }

 

  openDialog(categorie?: Categorie): void {
    const dialogRef = this.dialog.open(AddUpCategorieComponent, {
      width: '500px',
      data: { categorie }
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

  editElement(categorie: Categorie): void {
    this.openDialog(categorie);
    // console.log("user open dialog: ", user);
  }


  
  
  
    onDelete(element:Categorie):void{
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
          this.categorieService.deleteCategorie(element.idCategorie).subscribe(
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
