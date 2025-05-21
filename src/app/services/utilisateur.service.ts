import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Utilisateur } from '../models/utilisateur';
import { environment } from 'src/environnement/environnement';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private updateEvent = new Subject<void>();

  update$ = this.updateEvent.asObservable();
  private baseUrl = '/utilisateur';

  apiUrl: string = environment.apiUrl + this.baseUrl
  constructor(private http: HttpClient) { 

  }

  triggerUpdate() {
    this.updateEvent.next();
  }

  ajouterUtilisateur(utilisateur: Utilisateur, imageFile?: File | null): Observable<any> {

    const formData = new FormData();

    formData.append('utilisateur', JSON.stringify(utilisateur));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.post<Utilisateur>(`${this.apiUrl}/create`, formData);
  }
  
  modifierUtilisateur(idUtilisateur: string, utilisateur: Utilisateur, image?: File) {
    const formData = new FormData();

    formData.append('utilisateur', JSON.stringify(utilisateur));
    if (image) {
      formData.append('image', image);
    }

    return this.http.put<Utilisateur>(`${this.apiUrl}/update/${idUtilisateur}`, formData);
   }

   getUtilisateurByIdUtilisateur(idUtilisateur: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getUtilisateurByIdUtilisateur/${idUtilisateur}`);
  }

   activerUtilisateur(idUtilisateur: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/activer/${idUtilisateur}`, {});
  }

   desactiverUtilisateur(idUtilisateur: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/desactiver/${idUtilisateur}`, {});
  }

   deleteUtilisateur(idUtilisateur: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${idUtilisateur}`);
  }

   getAllUtilisateur(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllUser`);
  }

 
   login(user: Utilisateur): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

}
