import { Component, OnInit, inject, signal } from '@angular/core';
import { ClientService } from '../client';
import { Client } from '../model/Client';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ClientEdit} from '../client-edit/client-edit';



@Component({
  imports: [MatButtonModule],
  selector: 'app-client-list',
  styleUrl: './client-list.scss',
  templateUrl: './client-list.html',
  standalone: true,
})


export class ClientList  implements OnInit{

protected readonly dialog = inject(MatDialog);
  
protected readonly clients = signal<Client[]>([]);

protected readonly clientService = inject(ClientService);

ngOnInit(): void {
  this.clientService.getClients().subscribe((clients) => this.clients.set(clients));
}

createClient() {
  const dialogRef = this.dialog.open(ClientEdit, {
    data: {}
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.ngOnInit();
    }
  });
}

editClient(client: Client) {
  const dialogRef = this.dialog.open(ClientEdit, {
    data: { client: client}

  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.ngOnInit();
    }
  });
}

deleteClient(client: Client) {
  if (client.id == null) {
    return;
  }

  this.clientService.deleteClient(client.id).subscribe(() => {
    this.ngOnInit();
    
  });
}

}
 