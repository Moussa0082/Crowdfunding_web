import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environnement/environnement';
import { Categorie } from '../models/categorie';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  
    private updateEvent = new Subject<void>();
  
    update$ = this.updateEvent.asObservable();
    private baseUrl = '/categorie';
  
    apiUrl: string = environment.apiUrl + this.baseUrl
    constructor(private http: HttpClient) { 
    }
  
    triggerUpdate() {
      this.updateEvent.next();
    }
  
    ajouterCategorie(categorie: Categorie, imageFile?: File | null): Observable<any> {
  
      const formData = new FormData();
  
      formData.append('categorie', JSON.stringify(categorie));
      if (imageFile) {
        formData.append('image', imageFile);
      }
  
      return this.http.post<Categorie>(`${this.apiUrl}/create`, formData);
    }
    
    modifierCategorie(idCategorie: string, categorie: Categorie, image?: File) {
      const formData = new FormData();

      formData.append('categorie', JSON.stringify(categorie));
      if (image) {
        formData.append('image', image);
      }
    
      return this.http.put(`${this.apiUrl}/update/${idCategorie}`, formData);
    }
    

     getAllCategorie(): Observable<any> {
      return this.http.get(`${this.apiUrl}/getAllCategorie`);
    }

    deleteCategorie(id: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/delete/${id}`);
    }
  
}
