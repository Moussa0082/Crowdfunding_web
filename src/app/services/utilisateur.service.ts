import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { Utilisateur } from '../models/utilisateur';
import { environment } from 'src/environnement/environnement';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private updateEvent = new Subject<void>();

  update$ = this.updateEvent.asObservable();
  private baseUrl = '/utilisateur';
  private userKey = 'utilisateur';  // Key used to store user data in localStorage

  private utilisateur: Utilisateur | null = null;

  apiUrl: string = environment.apiUrl + this.baseUrl
 
  private userSubject = new BehaviorSubject<Utilisateur | null>(null);
  utilisateur$ = this.userSubject.asObservable();

    // Check if the user is logged in
    // isLoggedIn(): boolean {
    //   return localStorage.getItem(this.userKey) !== null;
    // }
    private utilisateurSubject = new BehaviorSubject<Utilisateur | null>(null);

    constructor(private http: HttpClient) {
      // Chargement depuis localStorage si dispo
      const userData = localStorage.getItem('utilisateur');
      if (userData) {
        this.utilisateurSubject.next(JSON.parse(userData));
      }
    }

    isLoggedIn(): boolean {
      // Exemple simple avec le localStorage
      return !!localStorage.getItem('utilisateur');
    }
  
    setutilisateurConnect(utilisateur: Utilisateur): void {
      this.utilisateurSubject.next(utilisateur);
      localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
    }
  
    getUtilisateurConnect(): Observable<Utilisateur | null> {
      return this.utilisateurSubject.asObservable();
    }
  
    logout(): void {
      this.utilisateurSubject.next(null);
      localStorage.removeItem('utilisateur');
    }


  loginUtilisateur(email: any, password: any): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password)
    return this.http.get<any>(`${this.apiUrl}/login`, { params }).pipe(
      tap(response => {
        // Stocker les informations de l'utilisateur dans le localStorage
        localStorage.setItem(this.userKey, JSON.stringify(response));
      })
    );
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



}
