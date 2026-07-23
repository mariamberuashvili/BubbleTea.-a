import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);

  private URL = `${ environment.apiUrl }/teas`;

 
  getTeas() {
    return this.http.get(`${ this.URL }/`);
  }

  getTea(id: number) {
  return this.http.get(`${ this.URL }/${ id }`);
}

  
  addTea(data: any) {

    return this.http.post(
      `${ this.URL }/`,
      data
    );

  }


  deleteTea(id: number) {

    return this.http.delete(
      `${ this.URL }/${ id }`
    );

  }

  
  updateTea(id: number, data: any) {

    return this.http.put(
      `${ this.URL }/${ id }`,
      data
    );

  }
}