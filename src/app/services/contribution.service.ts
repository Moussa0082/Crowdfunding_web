import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environnement/environnement';
import { Contribution } from '../models/contribution';
import { MontantContributionParCampagne } from '../models/MontantContributionParCampagne';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {

  
  private updateEvent = new Subject<void>();
    
      update$ = this.updateEvent.asObservable();
      private baseUrl = '/contribution';
    
      apiUrl: string = environment.apiUrl + this.baseUrl
      constructor(private http: HttpClient) { 
      }
  
    
      triggerUpdate() {
        this.updateEvent.next();
      }

      getNombreContribution(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/getNombreContribution`);
       }
    
       getMontantsParCampagne(): Observable<MontantContributionParCampagne[]> {
        return this.http.get<MontantContributionParCampagne[]>(`${this.apiUrl}/montants-contributions`);
      }
    
      ajouterContribution(contribution: Contribution, idCampagne : string , imageFile?: File | null): Observable<any> {
    
        const formData = new FormData();
    
        formData.append('contribution', JSON.stringify(contribution));
        if (imageFile) {
          formData.append('image', imageFile);
        }
    
        return this.http.post<Contribution>(`${this.apiUrl}/create/${idCampagne}`, formData);
      }
      
      modifierContribution(contribution: Contribution, idContribution : string , image?: File) {
        const formData = new FormData();
    
        formData.append('contribution', JSON.stringify(contribution));
        if (image) {
          formData.append('image', image);
        }
    
        return this.http.put<Contribution>(`${this.apiUrl}/update/${idContribution}`, formData);
       }
  
       getAllContribution(): Observable<any> {
        return this.http.get(`${this.apiUrl}/getAllContribution`);
      }
  
      getAllUtilisateurByCampagne(idCampagne: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/getAllUtilisateurByCampagne/${idCampagne}`);
      }
  
      getAllCampagnesByCategorie(idCategorie: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/getAllCampagnesByCategorie/${idCategorie}`);
      }
  
      getContributionByIdContribution(idContribution: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/getContributionByIdContribution/${idContribution}`);
      }
  
      deleteCampagne(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete/${id}`);
      }

}
