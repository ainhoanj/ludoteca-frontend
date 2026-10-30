import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Loan } from '../model/Loan';
import { LoanService } from '../loan';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { Client } from '../../client/model/Client';
import { Game } from '../../game/model/Game';
import { MatSelectModule } from '@angular/material/select';
import { ClientService } from '../../client/client';
import { GameService } from '../../game/game';
import { BidiModule } from '@angular/cdk/bidi';



@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    
  ],

  selector: 'app-loan-edit',
  styleUrl: './loan-edit.scss',
  templateUrl: './loan-edit.html',
})
export class LoanEdit  implements OnInit {

protected readonly id = signal<number | null>(null);
protected readonly client = signal<Client | null>(null);
protected readonly game = signal<Game | null>(null);
protected readonly startDate = signal<string | null>(null);
protected readonly endDate = signal<string | null>(null);

protected readonly dialogRef = inject(MatDialogRef<LoanEdit>);
protected readonly data = inject(MAT_DIALOG_DATA);
protected readonly loanService = inject(LoanService);
protected readonly clientService= inject(ClientService);
protected readonly clients = signal<Client[]>([]);
protected readonly games = signal<Game[]>([]);
protected readonly gameService = inject(GameService);


  ngOnInit(): void {

    this.loadFormData(this.data.loan ?? null);
    this.clientService.getClients().subscribe (clients => {

      this.clients.set(clients);

    });

    this.gameService.getGames().subscribe(games => {
      this.games.set(games);
    });
  }



loadFormData(initialData: Loan | null): void {
  this.id.set(initialData?.id ?? null);
  this.client.set(initialData?.client ?? null);
  this.game.set(initialData?.game ?? null);
  this.startDate.set(initialData?.startDate ?? null);
  this.endDate.set(initialData?.endDate ?? null);
}



onSave(): void {

const id = this.id();
const client = this.client();
const game = this.game();
const startDate = this.startDate();
const endDate = this.endDate();

console.log ('Fecha inicio:', startDate);
console.log ('Fecha fin:', endDate);


if (!client || !game || !startDate || !endDate)

  return;


const loan: Loan = {

  id,
  client,
  game,
  startDate,
  endDate

};

this.loanService.saveLoan(loan).subscribe({
  next: () => {
  this.dialogRef.close(true);
  },
  error: (err) => {
    console.error('Error al guardar el préstamo:', err);
    alert(err.error?.message || 'No se ha podido guardar el préstamo');
  }
});


}

compareById(a: any, b: any): boolean {
  return a && b ? a.id === b.id : a === b;
}

onClose(): void {

  this.dialogRef.close();

}



}





