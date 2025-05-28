import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environnement/environnement';
import { Campagne } from '../models/campagne';

@Injectable({
  providedIn: 'root'
})
export class CampagneService {
   
    private updateEvent = new Subject<void>();
  
    update$ = this.updateEvent.asObservable();
    private baseUrl = '/campagne';
  
    apiUrl: string = environment.apiUrl + this.baseUrl
    constructor(private http: HttpClient) { 
    }

  
    triggerUpdate() {
      this.updateEvent.next();
    }

   
    getNombreCampagneValider(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/getNombreCampagneValider`);
   }


    getMontantTotalMobiliserCampagne(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/getMontantTotalMobiliserCampagne`);
   }


    getNombreCampagneEnCours(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/getNombreCampagneEnCours`);
   }
  
    ajouterCampagne(campagne: Campagne, imageFile?: File | null): Observable<any> {
  
      const formData = new FormData();
  
      formData.append('campagne', JSON.stringify(campagne));
      if (imageFile) {
        formData.append('image', imageFile);
      }
  
      return this.http.post<Campagne>(`${this.apiUrl}/create`, formData);
    }
    
    modifierCampagne(idCampagne: string, campagne: Campagne, image?: File) {
      const formData = new FormData();
  
      formData.append('campagne', JSON.stringify(campagne));
      if (image) {
        formData.append('image', image);
      }
  
      return this.http.put<Campagne>(`${this.apiUrl}/update/${idCampagne}`, formData);
     }

     getAllCampagne(): Observable<any> {
      return this.http.get(`${this.apiUrl}/getAllCampagne`);
    }

    getallCampagneByUtilisateur(idUtilisateur: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/getAllCampagnesByUtilisateur/${idUtilisateur}`);
    }

    getAllCampagnesByCategorie(idCategorie: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/getAllCampagnesByCategorie/${idCategorie}`);
    }

    getCampagneByIdCampagne(idCampagne: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/getCampagneByIdCampagne/${idCampagne}`);
    }

    activerCampagne(idCampagne: string): Observable<any> {
      return this.http.put(`${this.apiUrl}/activer/${idCampagne}`, {});
    }

    desactiverCampagne(idCampagne: string): Observable<any> {
      return this.http.put(`${this.apiUrl}/desactiver/${idCampagne}`, {});
    }

    deleteCampagne(idCampagne: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/delete/${idCampagne}`);
    }
  
}
