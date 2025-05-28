import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

// import { IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-headers',
  imports: [MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  isMenuOpen: boolean = false;


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
//    showSidebar(): void {
//     const sidebar: HTMLElement | null = document.querySelector(".sidebar");
//     if (sidebar) {
//         sidebar.style.display = 'flex';
//         setTimeout(() => {
//             sidebar.style.transform = 'translateX(0)';
//         }, 10);
//     }
// }

//  closeSidebar(): void {
//     const sidebar: HTMLElement | null = document.querySelector(".sidebar");
//     if (sidebar) {
//         sidebar.style.transform = 'translateX(100%)';
//         setTimeout(() => {
//             sidebar.style.display = 'none';
//         }, 300);
//     }
// }

}
