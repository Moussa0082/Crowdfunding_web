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
import { Contribution } from 'src/app/models/contribution';
import { ContributionService } from 'src/app/services/contribution.service';
import { AddUpContributionComponent } from '../add-up-contribution/add-up-contribution.component';

@Component({
  selector: 'app-contribution-list',
  imports: [
    MatTableModule,
    CommonModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './contribution-list.component.html',
  styleUrl: './contribution-list.component.scss'
})
export class ContributionListComponent 
implements OnInit{

  // table 1
  tempStatus!: boolean; // Variable temporaire pour stocker l'état
  displayedColumns: string[] = ['montant','prenom' , 'nom', 'campagneMtActuel' , 'campagneMtCible', 'campagneDateLimite' , 'description', 'dateContribution', 'campagne'  ];
  dataSource = new MatTableDataSource<Contribution>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  contributions: Contribution[] = [];
  loading: boolean = true;

  constructor(private dialog: MatDialog , private cd: ChangeDetectorRef, private contributionService: ContributionService) { }


  ngOnInit(): void {
      this.contributionService.getAllContribution().subscribe(data => {
        console.log("RAW DATA: ", data);
        console.log("Nombre de contributions :", data.length);
        this.contributions = data;
        this.dataSource.data = this.contributions;
        // this.dataSource = new MatTableDataSource(this.utilisateurs);
        this.loading = false; // Fin du chargement
        
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log("liste des contributions: ", this.contributions);
      },
      (error) => {
        console.error('Erreur lors du chargement de la liste des contributions:', error);
        this.loading = false; // Fin du chargement même en cas d'erreur
      });
  }

  chargerDonner(): void {
    this.contributionService.getAllContribution().subscribe(data => {

      this.contributions = data;
      this.dataSource.data = this.contributions;
      // this.dataSource = new MatTableDataSource(this.utilisateurs);
      this.loading = false; // Fin du chargement
      
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("liste des contributions: ", this.contributions);
    },
    (error) => {
      console.error('Erreur lors du chargement de la liste des contributions:', error);
      this.loading = false; // Fin du chargement même en cas d'erreur
    });
  }

  

  openDialog(contribution?: Contribution): void {
    const dialogRef = this.dialog.open(AddUpContributionComponent, {
      width: '500px',
      data: { contribution }
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

  editElement(contribution: Contribution): void {
    this.openDialog(contribution);
    // console.log("user open dialog: ", user);
  }


 
  
  
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}





}
