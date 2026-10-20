import {
  Component,
  inject,
  input,
  numberAttribute,
  OnInit,
  signal,
} from '@angular/core';
import { HeroComponent } from './hero/hero';
import { CientistaService } from '../../services/cientista';
import { Cientista } from '../../core/cientista';
import { LinhaDoTempoComponent } from './linha-do-tempo/linha-do-tempo';
import { ItemLinhaDoTempo } from '../../core/item-linha-do-tempo';
import { LinhaDoTempoService } from '../../services/linha-do-tempo';

@Component({
  imports: [HeroComponent, LinhaDoTempoComponent],
  selector: 'app-cientista',
  styleUrl: './cientista.css',
  templateUrl: './cientista.html',
})
export class CientistaPage implements OnInit {
  private readonly cientistaService = inject(CientistaService);
  private readonly linhaDoTempoService = inject(LinhaDoTempoService);

  ngOnInit(): void {
    this.cientistaService.buscar(this.id()).subscribe((cientista) => this.cientista.set(cientista));
    this.linhaDoTempoService.buscarDe(this.id()).subscribe((linhaDoTempo) => this.linhaDoTempo.set(linhaDoTempo));
  }

  public readonly id = input.required({ transform: numberAttribute });

  protected readonly cientista = signal<Cientista | null>(null);
  protected readonly linhaDoTempo = signal<ItemLinhaDoTempo[]>([])
}
