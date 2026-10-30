import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientService } from '../client';
import { Client } from '../model/Client';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  selector: 'app-client-edit',
  styleUrl: './client-edit.scss',
  templateUrl: './client-edit.html',
})
export class ClientEdit implements OnInit {

  protected readonly id = signal<number | null >(null);
  protected readonly name = signal<string | null >(null);
  
  protected readonly dialogRef = inject(MatDialogRef<ClientEdit>);
  protected readonly data = inject(MAT_DIALOG_DATA);
  protected readonly clientService = inject(ClientService);

  ngOnInit(): void {
    this.loadFormData(this.data.client ?? null );
  }

loadFormData(initialData: Client | null) :void {
  this.id.set(initialData?.id ?? null);
  this.name.set(initialData?.name ?? null);
}


onSave () { 
  const id = this.id();
  const name = this.name();

  if (!name || !name.trim()){
    return;
  }

  const client = {
    id,
    name
  } as Client;


  this.clientService.saveClient(client).subscribe(() =>{
    this.dialogRef.close(true);
});

}

onClose() {
  this.dialogRef.close();



}




}
