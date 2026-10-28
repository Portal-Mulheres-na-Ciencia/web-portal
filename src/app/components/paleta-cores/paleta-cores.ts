import { Component } from '@angular/core';

interface CorTema {
  nome: string;
  variavel: string;
  onVariavel?: string;
  descricao: string;
}

interface GrupoCores {
  titulo: string;
  descricao: string;
  cores: CorTema[];
}

@Component({
  selector: 'app-paleta-cores',
  standalone: true,
  templateUrl: './paleta-cores.html',
  styleUrl: './paleta-cores.css',
})
export class PaletaCoresComponent {
  grupos: GrupoCores[] = [
    {
      titulo: '1. Primárias (Rose)',
      descricao: 'Cor principal da aplicação, botões principais, destaques ativos.',
      cores: [
        { nome: 'Primary', variavel: '--mat-sys-primary', onVariavel: '--mat-sys-on-primary', descricao: 'Cor principal de ação' },
        { nome: 'On Primary', variavel: '--mat-sys-on-primary', onVariavel: '--mat-sys-primary', descricao: 'Texto/ícone sobre Primary' },
        { nome: 'Primary Container', variavel: '--mat-sys-primary-container', onVariavel: '--mat-sys-on-primary-container', descricao: 'Fundo suave de elementos primários' },
        { nome: 'On Primary Container', variavel: '--mat-sys-on-primary-container', onVariavel: '--mat-sys-primary-container', descricao: 'Texto sobre Primary Container' },
        { nome: 'Inverse Primary', variavel: '--mat-sys-inverse-primary', onVariavel: '--mat-sys-primary', descricao: 'Primary em superfícies invertidas' },
      ],
    },
    {
      titulo: '2. Secundárias',
      descricao: 'Elementos de menor destaque, chips, filtros, abas secundárias.',
      cores: [
        { nome: 'Secondary', variavel: '--mat-sys-secondary', onVariavel: '--mat-sys-on-secondary', descricao: 'Cor secundária' },
        { nome: 'On Secondary', variavel: '--mat-sys-on-secondary', onVariavel: '--mat-sys-secondary', descricao: 'Texto sobre Secondary' },
        { nome: 'Secondary Container', variavel: '--mat-sys-secondary-container', onVariavel: '--mat-sys-on-secondary-container', descricao: 'Fundo suave secundário' },
        { nome: 'On Secondary Container', variavel: '--mat-sys-on-secondary-container', onVariavel: '--mat-sys-secondary-container', descricao: 'Texto sobre Secondary Container' },
      ],
    },
    {
      titulo: '3. Terciárias (Violet)',
      descricao: 'Cor de contraste e equilíbrio visual definida no tema como Violet. Usada para prêmios e destaques; não confundir com erro.',
      cores: [
        { nome: 'Tertiary', variavel: '--mat-sys-tertiary', onVariavel: '--mat-sys-on-tertiary', descricao: 'Cor terciária (Violet)' },
        { nome: 'On Tertiary', variavel: '--mat-sys-on-tertiary', onVariavel: '--mat-sys-tertiary', descricao: 'Texto sobre Tertiary' },
        { nome: 'Tertiary Container', variavel: '--mat-sys-tertiary-container', onVariavel: '--mat-sys-on-tertiary-container', descricao: 'Fundo suave terciário' },
        { nome: 'On Tertiary Container', variavel: '--mat-sys-on-tertiary-container', onVariavel: '--mat-sys-tertiary-container', descricao: 'Texto sobre Tertiary Container' },
      ],
    },
    {
      titulo: '4. Superfícies & Fundos (Surfaces)',
      descricao: 'Fundos de páginas, cards, diálogos e níveis de elevação.',
      cores: [
        { nome: 'Surface', variavel: '--mat-sys-surface', onVariavel: '--mat-sys-on-surface', descricao: 'Fundo padrão da aplicação' },
        { nome: 'On Surface', variavel: '--mat-sys-on-surface', onVariavel: '--mat-sys-surface', descricao: 'Cor de texto principal' },
        { nome: 'Surface Variant', variavel: '--mat-sys-surface-variant', onVariavel: '--mat-sys-on-surface-variant', descricao: 'Variação de superfície para separação' },
        { nome: 'On Surface Variant', variavel: '--mat-sys-on-surface-variant', onVariavel: '--mat-sys-surface-variant', descricao: 'Texto secundário/suave' },
        { nome: 'Surface Container Lowest', variavel: '--mat-sys-surface-container-lowest', onVariavel: '--mat-sys-on-surface', descricao: 'Container nível 0 (mais baixo)' },
        { nome: 'Surface Container Low', variavel: '--mat-sys-surface-container-low', onVariavel: '--mat-sys-on-surface', descricao: 'Container nível 1' },
        { nome: 'Surface Container', variavel: '--mat-sys-surface-container', onVariavel: '--mat-sys-on-surface', descricao: 'Container nível 2 padrão' },
        { nome: 'Surface Container High', variavel: '--mat-sys-surface-container-high', onVariavel: '--mat-sys-on-surface', descricao: 'Container nível 3' },
        { nome: 'Surface Container Highest', variavel: '--mat-sys-surface-container-highest', onVariavel: '--mat-sys-on-surface', descricao: 'Container nível 4 (mais alto)' },
        { nome: 'Surface Dim', variavel: '--mat-sys-surface-dim', onVariavel: '--mat-sys-on-surface', descricao: 'Superfície escurecida' },
        { nome: 'Surface Bright', variavel: '--mat-sys-surface-bright', onVariavel: '--mat-sys-on-surface', descricao: 'Superfície iluminada' },
        { nome: 'Inverse Surface', variavel: '--mat-sys-inverse-surface', onVariavel: '--mat-sys-inverse-on-surface', descricao: 'Superfície invertida (ex: Snackbars)' },
        { nome: 'Inverse On Surface', variavel: '--mat-sys-inverse-on-surface', onVariavel: '--mat-sys-inverse-surface', descricao: 'Texto sobre superfície invertida' },
      ],
    },
    {
      titulo: '5. Bordas & Neutros (Outline)',
      descricao: 'Linhas divisórias, bordas de cards e campos de formulário.',
      cores: [
        { nome: 'Outline', variavel: '--mat-sys-outline', onVariavel: '--mat-sys-surface', descricao: 'Bordas de destaque e divisórias' },
        { nome: 'Outline Variant', variavel: '--mat-sys-outline-variant', onVariavel: '--mat-sys-surface', descricao: 'Bordas suaves e divisores sutis' },
      ],
    },
    {
      titulo: '6. Erro & Alerta',
      descricao: 'Estados de erro, falha e validação de formulários.',
      cores: [
        { nome: 'Error', variavel: '--mat-sys-error', onVariavel: '--mat-sys-on-error', descricao: 'Cor de erro' },
        { nome: 'On Error', variavel: '--mat-sys-on-error', onVariavel: '--mat-sys-error', descricao: 'Texto sobre cor de erro' },
        { nome: 'Error Container', variavel: '--mat-sys-error-container', onVariavel: '--mat-sys-on-error-container', descricao: 'Fundo de mensagem de erro' },
        { nome: 'On Error Container', variavel: '--mat-sys-on-error-container', onVariavel: '--mat-sys-error-container', descricao: 'Texto sobre container de erro' },
      ],
    },
    {
      titulo: '7. Semânticas do projeto',
      descricao: 'Definidas em styles.css, pois o Material 3 só tem a cor de erro.',
      cores: [
        { nome: 'Sucesso', variavel: '--cor-sucesso', onVariavel: '--cor-sucesso-fundo', descricao: 'Ações concluídas' },
        { nome: 'Fundo de sucesso', variavel: '--cor-sucesso-fundo', onVariavel: '--cor-sucesso', descricao: 'Mensagens de sucesso' },
        { nome: 'Alerta', variavel: '--cor-alerta', onVariavel: '--cor-alerta-fundo', descricao: 'Atenção necessária' },
        { nome: 'Fundo de alerta', variavel: '--cor-alerta-fundo', onVariavel: '--cor-alerta', descricao: 'Mensagens de alerta' },
        { nome: 'Informação', variavel: '--cor-info', onVariavel: '--cor-info-fundo', descricao: 'Avisos neutros' },
        { nome: 'Fundo de informação', variavel: '--cor-info-fundo', onVariavel: '--cor-info', descricao: 'Mensagens informativas' },
      ],
    },
  ];
}
