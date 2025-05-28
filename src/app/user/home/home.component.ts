import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
// import { HeaderComponent } from "../../layouts/full/header/header.component";
import { NavigationEnd, Router } from '@angular/router';
import {  HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-home',
  imports: [FooterComponent,  HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent  implements OnInit{

  isHomeCp:boolean=false;


  constructor(
      private router:Router
    ) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomeCp = event.url.endsWith('') || event.url === '/home';
      }
    });
  }

}
