import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Loan } from "./model/Loan";
import { HttpClient } from "@angular/common/http";
import { PaginatedData } from "../core/model/page/PaginatedData";

@Injectable ({
    providedIn: 'root',

})

export class LoanService {
    protected readonly http = inject(HttpClient);

    private baseUrl = 'http://localhost:8080/loan';



    getLoans(
        page: number = 0,
        gameId?: number,
        clientId?: number,
        date?: string
        ): Observable<PaginatedData<Loan>> {
            const params: any = { page };

            if (gameId != null) {
                params.gameId = gameId;
            }

            if (clientId != null) {
                params.clientId = clientId;
            }


            if (date != null) {
                params.date = date;
            }


        return this.http.get<PaginatedData<Loan>>(
           this.baseUrl,
           { params }
    );
    }

 


    saveLoan(loan: Loan): Observable<void> {

        const { id } = loan;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;

        return this.http.put<void>(url, loan);
    }


    deleteLoan(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
   
    
}