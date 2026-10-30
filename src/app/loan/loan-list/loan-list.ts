import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { LoanService } from '../loan';
import { Loan } from '../model/Loan';
import { MatDialog } from '@angular/material/dialog';
import { LoanEdit } from '../loan-edit/loan-edit';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../game/game';
import { Game } from '../../game/model/Game';
import { ClientService } from '../../client/client';
import { Client } from '../../client/model/Client';
import { submit } from '@angular/forms/signals';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

const paginatorEsp = new MatPaginatorIntl();
paginatorEsp.itemsPerPageLabel = 'Elementos por página:';

@Component({

  providers: [{ provide: MatPaginatorIntl, useValue: paginatorEsp }],
  imports: [
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  selector: 'app-loan-list',
  styleUrl: './loan-list.scss',
  templateUrl: './loan-list.html',
})
export class LoanList implements OnInit {

  displayedColumns: string[] = [
    'id',
    'game',
    'client',
    'startDate',
    'endDate',
    'action'
  ];

  private loanService = inject(LoanService);
  private dialog = inject(MatDialog);
  private gameService = inject(GameService);
  private clientService = inject(ClientService);
  

  loans = signal<Loan[]>([]);
  dataSource = computed(() => this.loans());
  games = signal<Game[]>([]);
  clients = signal<Client[]>([]);
  page = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  gameFilter = signal<string>('');
  clientFilter = signal<string>('');
  dateFilter = signal<string>('');
  appliedFilters = signal({ game: '', client: '', date: ''});


filteredLoans = computed(() => {
  const game = this.appliedFilters().game.toLowerCase().trim();
  const client = this.appliedFilters().client.toLowerCase().trim();
  const date = this.appliedFilters().date;

  return this.loans().filter(loan =>
    (!game || loan.game.id === Number(game)) &&
    loan.client.name.toLowerCase().includes(client) &&
    (!date || (loan.startDate <= date && loan.endDate >= date))

  );
});

  ngOnInit(): void {

    this.gameService.getGames().subscribe(data => {
      this.games.set(data);
    });

    this.clientService.getClients().subscribe(data => {
      this.clients.set(data);
    });


    const filters = this.appliedFilters();


    this.loanService.getLoans(
      this.page(),
      filters.game ? Number(filters.game) : undefined,
      this.clients().find(client => client.name === filters.client)?.id,
      filters.date
      ).subscribe(data => {
      console.log('Prestamos recibidos', data.content);
      this.loans.set(data.content);
      this.totalPages.set(data.totalPages);
      this.totalElements.set(data.totalElements);

    });
    
  }

  onEdit(loan: Loan | null): void {
    const dialoRef = this.dialog.open(LoanEdit, {
      data: { loan }
    });

    dialoRef.afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });


  }

  onDelete(loan: Loan): void {
    this.loanService.deleteLoan(loan.id).subscribe(() => {
      this.ngOnInit();
    });
  }

  nextPage(): void{
    if (this.page() + 1 <this.totalPages()) {
      this.page.update(page => + 1);
      this.ngOnInit()
    }
  }

  previousPage(): void {
    if (this.page() > 0) {
      this.page.update(page => page -1);
      this.ngOnInit();
    }
  }

  clearFilters(): void {
    this.gameFilter.set('');
    this.clientFilter.set('');
    this.dateFilter.set('');

    this.appliedFilters.set({
      game: '',
      client: '',
      date: ''
    });

    this.page.set(0);
    this.ngOnInit();
  }


  applyFilters(): void {
    this.appliedFilters.set({
      game: this.gameFilter(),
      client: this.clientFilter(),
      date: this.dateFilter()
    });



    this.page.set(0);
    this.ngOnInit();
  }
}
