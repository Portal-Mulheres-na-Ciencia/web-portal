import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, map, of } from 'rxjs';
import { CientistaForm, ContribuicaoForm, PremioRecebidoForm, SugestaoAdmin } from '../../../core/curadoria';
import { Premio } from '../../../core/premio';
import { CientistaDetalheApi, CientistaService } from '../../../services/cientista';
import { CuradoriaService } from '../../../services/curadoria';
import { aoFalhar } from '../../../util/carregamento';
import { aplicarErrosDaApi, formatarData, mensagemDeErro } from '../../../util/formulario';
import { ErroCarregamentoComponent } from '../../compartilhado/erro-carregamento/erro-carregamento';

const LINK = /^(https?:\/\/\S+)?$/;

type GrupoContribuicao = FormGroup<{
  id: FormControl<number | null>;
  titulo: FormControl<string>;
  descricao: FormControl<string>;
  ano: FormControl<number | null>;
  linkReferencia: FormControl<string>;
}>;

type GrupoPremio = FormGroup<{
  idPremio: FormControl<number | null>;
  ano: FormControl<number | null>;
}>;
const SEM_CONEXAO = 'Não foi possível salvar agora. Confira sua conexão e tente novamente.';

/** Mensagens para campos obrigatórios vazios. */
const SE_VAZIO: Record<string, string> = {
  nome: 'Informe o nome da cientista.',
  biografia: 'Escreva a biografia.',
  idsAreas: 'Escolha pelo menos uma área.',
  titulo: 'Informe o título da contribuição.',
  idPremio: 'Escolha o prêmio.',
  ano: 'Informe o ano.',
};

/**
 * Cadastro e edição de cientista, com áreas, contribuições e prêmios num formulário só.
 * Em /admin/cientistas/nova?sugestao=ID, o cadastro nasce de uma sugestão enviada pelo site.
 */
@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ErroCarregamentoComponent,
  ],
  selector: 'app-cientista-form',
  styleUrl: './cientista-form.css',
  templateUrl: './cientista-form.html',
})
export class CientistaFormPage implements OnInit {
  private readonly curadoria = inject(CuradoriaService);
  private readonly router = inject(Router);
  private readonly avisos = inject(MatSnackBar);
  private readonly fb = inject(NonNullableFormBuilder);

  /** :id da rota (só na edição). */
  readonly id = input<string>();
  /** ?sugestao= (só no cadastro a partir de uma sugestão). */
  readonly sugestao = input<string>();

  protected readonly edicao = computed(() => !!this.id());
  protected readonly carregando = signal(true);
  protected readonly erroCarga = signal(false);
  protected readonly salvando = signal(false);
  protected readonly erroGeral = signal('');
  protected readonly sugestaoOrigem = signal<SugestaoAdmin | null>(null);
  protected readonly premios = signal<Premio[]>([]);
  protected readonly areas = toSignal(inject(CientistaService).listarAreas().pipe(aoFalhar(this.erroCarga, [])), {
    initialValue: [],
  });

  protected readonly formulario = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(150)]],
    biografia: ['', [Validators.required, Validators.maxLength(5000)]],
    instituicao: ['', Validators.maxLength(150)],
    dataNascimento: [''],
    dataFalecimento: [''],
    nacionalidade: ['', Validators.maxLength(45)],
    idsAreas: this.fb.control<number[]>([], Validators.required),
    contribuicoes: this.fb.array<GrupoContribuicao>([]),
    premios: this.fb.array<GrupoPremio>([]),
  });

  protected readonly novoPremio = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(150)]],
    concedente: ['', Validators.maxLength(45)],
  });
  protected readonly mostrarNovoPremio = signal(false);
  protected readonly erroNovoPremio = signal('');

  protected readonly formatarData = formatarData;

  get contribuicoes() {
    return this.formulario.controls.contribuicoes;
  }

  get premiosRecebidos() {
    return this.formulario.controls.premios;
  }

  ngOnInit(): void {
    const id = Number(this.id());
    const idSugestao = Number(this.sugestao());
    forkJoin({
      premios: this.curadoria.listarPremios(),
      cientista: id ? this.curadoria.buscarCientista(id) : of(null),
      sugestao: idSugestao
        ? this.curadoria.listarSugestoes().pipe(map((lista) => lista.find((s) => s.id === idSugestao) ?? null))
        : of(null),
    }).subscribe({
      next: ({ premios, cientista, sugestao }) => {
        this.premios.set(premios);
        if (cientista) this.preencher(cientista);
        if (sugestao && sugestao.status === 'PENDENTE') {
          this.sugestaoOrigem.set(sugestao);
          this.formulario.controls.nome.setValue(sugestao.nomeCientista);
        }
        this.carregando.set(false);
      },
      error: () => {
        this.erroCarga.set(true);
        this.carregando.set(false);
      },
    });
  }

  protected areaMarcada(id: number): boolean {
    return this.formulario.controls.idsAreas.value.includes(id);
  }

  protected alternarArea(id: number, marcada: boolean): void {
    const controle = this.formulario.controls.idsAreas;
    const atuais = controle.value.filter((a) => a !== id);
    controle.setValue(marcada ? [...atuais, id] : atuais);
    controle.markAsTouched();
  }

  protected adicionarContribuicao(): void {
    this.contribuicoes.push(this.grupoContribuicao());
  }

  protected adicionarPremio(): void {
    this.premiosRecebidos.push(this.grupoPremio());
  }

  protected criarPremio(): void {
    this.erroNovoPremio.set('');
    if (this.novoPremio.invalid) {
      this.novoPremio.markAllAsTouched();
      return;
    }
    const { nome, concedente } = this.novoPremio.getRawValue();
    this.curadoria.criarPremio(nome, concedente).subscribe({
      next: (premio) => {
        this.premios.update((lista) => [...lista, premio].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')));
        this.premiosRecebidos.push(this.grupoPremio({ idPremio: premio.id, ano: null }));
        this.novoPremio.reset();
        this.mostrarNovoPremio.set(false);
        this.avisos.open('Prêmio criado e incluído na lista. Agora informe o ano.', 'Fechar', { duration: 4000 });
      },
      error: (erro: HttpErrorResponse) =>
        this.erroNovoPremio.set(aplicarErrosDaApi(this.novoPremio, erro, SEM_CONEXAO)),
    });
  }

  protected salvar(): void {
    this.erroGeral.set('');
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.erroGeral.set('Confira os campos destacados.');
      return;
    }
    const valores = this.formulario.getRawValue();
    const dados: CientistaForm = {
      ...valores,
      dataNascimento: valores.dataNascimento || null,
      dataFalecimento: valores.dataFalecimento || null,
      idSugestao: this.sugestaoOrigem()?.id ?? null,
    };
    const id = Number(this.id());
    this.salvando.set(true);
    (id ? this.curadoria.atualizarCientista(id, dados) : this.curadoria.criarCientista(dados)).subscribe({
      next: (salva) => {
        this.avisos.open(`${salva.nome} foi salva.`, 'Fechar', { duration: 4000 });
        this.router.navigate(['/admin/cientistas']);
      },
      error: (erro: HttpErrorResponse) => {
        this.salvando.set(false);
        this.erroGeral.set(aplicarErrosDaApi(this.formulario, erro, SEM_CONEXAO));
      },
    });
  }

  /** Mensagem de erro de um campo, pelo caminho no formulário (ex.: "contribuicoes.0.titulo"). */
  protected erro(caminho: string): string {
    const nomeDoCampo = caminho.split('.').at(-1)!;
    return mensagemDeErro(this.formulario.get(caminho), SE_VAZIO[nomeDoCampo]);
  }

  protected erroDoNovoPremio(): string {
    return mensagemDeErro(this.novoPremio.controls.nome, 'Informe o nome do prêmio.');
  }

  private preencher(cientista: CientistaDetalheApi): void {
    this.formulario.patchValue({
      nome: cientista.nome,
      biografia: cientista.biografia,
      instituicao: cientista.instituicao ?? '',
      dataNascimento: cientista.dataNascimento ?? '',
      dataFalecimento: cientista.dataFalecimento ?? '',
      nacionalidade: cientista.nacionalidade ?? '',
      idsAreas: cientista.areasAtuacao.map((a) => a.id),
    });
    for (const c of cientista.contribuicoes) {
      this.contribuicoes.push(
        this.grupoContribuicao({
          id: c.id,
          titulo: c.titulo,
          descricao: c.descricao ?? '',
          ano: c.ano,
          linkReferencia: c.linkReferencia ?? '',
        }),
      );
    }
    for (const p of cientista.premios) {
      this.premiosRecebidos.push(this.grupoPremio({ idPremio: p.id, ano: p.ano }));
    }
  }

  private grupoContribuicao(c?: ContribuicaoForm): GrupoContribuicao {
    return this.fb.group({
      id: this.fb.control<number | null>(c?.id ?? null),
      titulo: [c?.titulo ?? '', [Validators.required, Validators.maxLength(200)]],
      descricao: [c?.descricao ?? '', Validators.maxLength(2000)],
      ano: this.fb.control<number | null>(c?.ano ?? null, [Validators.min(1000), Validators.max(2100)]),
      linkReferencia: [c?.linkReferencia ?? '', [Validators.maxLength(500), Validators.pattern(LINK)]],
    });
  }

  private grupoPremio(p?: PremioRecebidoForm): GrupoPremio {
    return this.fb.group({
      idPremio: this.fb.control<number | null>(p?.idPremio ?? null, Validators.required),
      ano: this.fb.control<number | null>(p?.ano ?? null, [
        Validators.required,
        Validators.min(1000),
        Validators.max(2100),
      ]),
    });
  }
}
