import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';

import {
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexLegend,
    ApexStroke,
    ApexTooltip,
    ApexAxisChartSeries,
    ApexXAxis,
    ApexYAxis,
    ApexGrid,
    ApexPlotOptions,
    ApexFill,
    NgApexchartsModule,
} from 'ng-apexcharts';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { CampagneService } from 'src/app/services/campagne.service';
import { ContributionService } from 'src/app/services/contribution.service';

export interface SalesChartOption {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    grid: ApexGrid;
}

@Component({
    selector: 'app-sales-overview',
    imports: [MaterialModule,
        CommonModule,
        TablerIconsModule, NgApexchartsModule],
    templateUrl: './sales-overview.component.html',
})
export class AppSalesOverviewComponent implements OnInit{
  SalesChartOption: any;

    
    isLoading : boolean = true;
    totalMontantMobiliser: number | null = null;
    nombreCampagneEnCours: number | null = null;
    nombreCampagneValider: number | null = null;
    nombreContribution: number | null = null;

    
    constructor(
        private campagneService:CampagneService, 
        private contributionService:ContributionService, 

      ) { }
    
    ngOnInit(): void {
      
    
        this.campagneService.getMontantTotalMobiliserCampagne().subscribe(
            (amount) => {
              this.totalMontantMobiliser = amount;
              this.isLoading = false;
            },
            (error) => {
              console.error('Erreur lors du chargement du montant total mobiliser des campagnes:', error);
              this.isLoading = false;
            }
          );
          this.campagneService.getNombreCampagneEnCours().subscribe(
            (amount) => {
              this.nombreCampagneEnCours = amount;
              this.isLoading = false;
            },
            (error) => {
              this.isLoading = false;
              console.error('Erreur lors du chargement du nombre de campagne en cours:', error);
            }
          );
          this.campagneService.getNombreCampagneValider().subscribe(
            (amount) => {
              this.isLoading = false;
              this.nombreCampagneEnCours = amount;
            },
            (error) => {
              this.isLoading = false;
              console.error('Erreur lors du chargement du nombre de campagne en cours:', error);
            }
          );
          this.contributionService.getNombreContribution().subscribe(
            (amount) => {
              this.isLoading = false;
              this.nombreContribution = amount;
            },
            (error) => {
              this.isLoading = false;
              console.error('Erreur lors du chargement du nombre de contribution:', error);
            }
          );

          this.contributionService.getMontantsParCampagne().subscribe(data => {
            const categories: string[] = [];
            const validéeData: number[] = [];
            const enCoursData: number[] = [];
      
            data.forEach(item => {
              categories.push(item.campagne);
              if (item.statut === 'validée') {
                validéeData.push(item.montantTotal);
                enCoursData.push(0); // pour garder l'alignement
              } else {
                enCoursData.push(item.montantTotal);
                validéeData.push(0);
              }
            });
      
            this.SalesChartOption = {
              series: [
                {
                  name: 'Validée',
                  data: validéeData,
                  color: '#fb9678',
                },
                {
                  name: 'En cours',
                  data: enCoursData,
                  color: '#03c9d7',
                },
              ],
              xaxis: {
                categories: categories,
                axisBorder: { show: false },
                axisTicks: { show: false }
              },
              yaxis: {
                show: true,
                labels: {
                  formatter: (val: number) => val.toLocaleString()
                }
              },
              chart: {
                toolbar: { show: false },
                type: 'bar',
                foreColor: '#adb0bb',
                fontFamily: "'DM Sans',sans-serif",
                height: 305,
              },
              legend: { show: true },
              tooltip: { theme: 'dark' },
              grid: {
                show: true,
                borderColor: 'transparent',
                strokeDashArray: 2,
                padding: {
                  left: 0,
                  right: 0,
                  bottom: 0,
                },
              },
              dataLabels: { enabled: false },
              stroke: {
                show: true,
                width: 5,
                colors: ['none'],
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: '5%',
                  borderRadius: 5,
                },
              },
            };
          });
          // this.contributionService.getMontantsParCampagne().subscribe(data => {
          //   const categories: string[] = [];
          //   const seriesData: number[] = [];
      
          //   data.forEach(item => {
          //     categories.push(`${item.campagne} (${item.statut})`);
          //     seriesData.push(item.montantTotal);
          //   });
      
          //   this.SalesChartOption.series = [
          //     {
          //       name: 'Montant collecté',
          //       data: seriesData
          //     }
          //   ];
      
          //   this.SalesChartOption.xaxis.categories = categories;
          // });
    }

    
    // @ViewChild('chart') chart: ChartComponent = Object.create(null);
    // public SalesChartOption!: Partial<SalesChartOption> | any;
    // constructor() {
    //     this.SalesChartOption = {
    //         series: [
    //             {
    //                 name: 'Ample Admin',
    //                 data: [355, 390, 300, 350, 390, 180, 355, 390, 300, 350, 390, 180],
    //                 color: '#fb9678',
    //             },
    //             {
    //                 name: 'Pixel Admin',
    //                 data: [280, 250, 325, 215, 250, 310, 280, 250, 325, 215, 250, 310],
    //                 color: '#03c9d7',
    //             },
    //         ],

    //         xaxis: {
    //             categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    //             axisBorder: {
    //                 show: false
    //             },
    //             axisTicks: {
    //                 show: false,
    //             }
    //         },

    //         yaxis: {
    //             show: true,
    //             max: 400,
    //         },

    //         chart: {
    //             toolbar: {
    //                 show: false,
    //             },
    //             type: 'bar',
    //             foreColor: '#adb0bb',
    //             fontFamily: "'DM Sans',sans-serif",
    //             height: 305,
    //         },

    //         legend: {
    //             show: false,
    //         },

    //         tooltip: {
    //             theme: 'dark',
    //         },

    //         grid: {
    //             show: true,
    //             borderColor: 'transparent',
    //             strokeDashArray: 2,
    //             padding: {
    //                 left: 0,
    //                 right: 0,
    //                 bottom: 0,
    //             },
    //         },

    //         dataLabels: {
    //             enabled: false,
    //         },

    //         stroke: {
    //             show: true,
    //             width: 5,
    //             colors: ['none'],
    //         },

    //         plotOptions: {
    //             bar: {
    //                 horizontal: false,
    //                 columnWidth: '42%',
    //                 borderRadius: 5,
    //             },
    //         },
    //     };
    // }
}
