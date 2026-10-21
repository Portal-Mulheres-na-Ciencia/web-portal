import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [RouterLink, MatButtonModule, MatIconModule],
  selector: 'app-nao-encontrado',
  styleUrl: './nao-encontrado.css',
  templateUrl: './nao-encontrado.html',
})
export class NaoEncontradoPage {}
