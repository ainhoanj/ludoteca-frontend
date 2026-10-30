import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Client } from './model/Client';
import { HttpClient } from '@angular/common/http';

@Injectable({
providedIn: 'root',
})
export class ClientService {
    protected readonly http = inject(HttpClient);

    private baseUrl = 'http://localhost:8080/client';

    getClients(): Observable<Client[]> {
        return this.http.get<Client[]>(this.baseUrl);
    }

    saveClient(client: Client): Observable<void> {
        const { id } = client;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;

        return this.http.put<void>(url, client);
    }

    deleteClient(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${ id }`);
    }

    }