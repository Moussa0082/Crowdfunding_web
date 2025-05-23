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
import { Contact } from 'src/app/models/contact';
import { ContactService } from 'src/app/services/contact.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-list',
  imports: [
    MatTableModule,
    CommonModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent implements OnInit{

  // table 1
  tempStatus!: boolean; // Variable temporaire pour stocker l'état
  displayedColumns: string[] = ['nomComplet', 'email', 'telephone', 'message','dateAjout' , 'action' ];
  dataSource = new MatTableDataSource<Contact>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  contacts: Contact[] = [];
  loading: boolean = true;

  constructor(private dialog: MatDialog , private cd: ChangeDetectorRef, private contactService: ContactService) { }


  ngOnInit(): void {
      this.contactService.getAllContact().subscribe(data => {

        this.contacts = data;
        this.dataSource.data = this.contacts;
        // this.dataSource = new MatTableDataSource(this.utilisateurs);
        this.loading = false; // Fin du chargement
        
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log("liste des contact: ", this.contacts);
      },
      (error) => {
        console.error('Erreur lors du chargement de la liste des contacts:', error);
        this.loading = false; // Fin du chargement même en cas d'erreur
      });
  }

  chargerDonner(): void {
    this.contactService.getAllContact().subscribe(data => {

      this.contacts = data;
      this.dataSource.data = this.contacts;
      // this.dataSource = new MatTableDataSource(this.utilisateurs);
      this.loading = false; // Fin du chargement
      
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste des contacts : ", this.contacts);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des contact:', error);
      this.loading = false; // Fin du chargement même en cas d'erreur
    });
  }
  
  
  
    onDelete(element:Contact):void{
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
          this.contactService.deleteContact(element.idContact).subscribe(
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
