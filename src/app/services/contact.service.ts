import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environnement/environnement';
import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

 private updateEvent = new Subject<void>();

  update$ = this.updateEvent.asObservable();
  private baseUrl = '/contact';

  apiUrl: string = environment.apiUrl + this.baseUrl
  constructor(private http: HttpClient) { 

  }

  triggerUpdate() {
    this.updateEvent.next();
  }

  ajouterContact(contact: Contact): Observable<any> {
    return this.http.post<Contact>(`${this.apiUrl}/addContact`, contact);
  }

   deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

   getAllContact(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllContact`);
  }



}
