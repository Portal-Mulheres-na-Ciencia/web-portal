import { Area } from '../core/area';
import { Cientista } from '../core/cientista';
import { Premio } from '../core/premio';

/*
 * Dados de exemplo usados enquanto não existe back-end.
 * Os fatos foram escolhidos por serem amplamente documentados; ao integrar com a API,
 * este arquivo deve deixar de ser usado pelo CientistaService.
 * Quando só o ano de nascimento é conhecido, a data usa 1º de janeiro: a interface exibe apenas o ano.
 */

const fisica: Area = { id: 1, nome: 'Física', descricao: 'Matéria, energia e as leis da natureza.', cientistas: [] };
const quimica: Area = { id: 2, nome: 'Química', descricao: 'Composição e transformação das substâncias.', cientistas: [] };
const biologia: Area = { id: 3, nome: 'Biologia', descricao: 'Seres vivos, da molécula ao ecossistema.', cientistas: [] };
const saude: Area = { id: 4, nome: 'Saúde', descricao: 'Medicina, genética e saúde pública.', cientistas: [] };
const matematica: Area = { id: 5, nome: 'Matemática', descricao: 'Estruturas, padrões e raciocínio formal.', cientistas: [] };
const computacao: Area = { id: 6, nome: 'Computação', descricao: 'Algoritmos, programação e sistemas.', cientistas: [] };

export const AREAS: Area[] = [fisica, quimica, biologia, saude, matematica, computacao];

const nobelFisica: Premio = { id: 1, nome: 'Prêmio Nobel de Física', concedente: 'Academia Real das Ciências da Suécia' };
const nobelQuimica: Premio = { id: 2, nome: 'Prêmio Nobel de Química', concedente: 'Academia Real das Ciências da Suécia' };
const unesco: Premio = { id: 3, nome: 'Prêmio UNESCO de Ciência', concedente: 'UNESCO' };
const loreal: Premio = { id: 4, nome: "Prêmio L'Oréal-UNESCO para Mulheres na Ciência", concedente: "Fundação L'Oréal e UNESCO" };
const liberdade: Premio = { id: 5, nome: 'Medalha Presidencial da Liberdade', concedente: 'Presidência dos Estados Unidos' };

/** Cria um cientista com os vínculos de volta (prêmio → cientista, área → cientistas). */
function cientista(dados: Omit<Cientista, 'premios'> & { premios: { premio: Premio; ano: number }[] }): Cientista {
  const resultado = { ...dados, premios: [] } as Cientista;
  resultado.premios = dados.premios.map((p) => ({ ...p, cientista: resultado }));
  resultado.areas.forEach((area) => area.cientistas.push(resultado));
  return resultado;
}

export const CIENTISTAS: Cientista[] = [
  cientista({
    id: 1,
    nome: 'Marie Curie',
    biografia:
      'Física e química nascida em Varsóvia e radicada na França. Pioneira no estudo da radioatividade — termo que ela mesma cunhou —, foi a primeira mulher a receber um Prêmio Nobel e a única pessoa premiada em duas ciências diferentes.',
    instituicao: 'Universidade de Paris',
    dataNascimento: new Date(1867, 10, 7),
    dataFalecimento: new Date(1934, 6, 4),
    nacionalidade: 'Polonesa e francesa',
    areas: [fisica, quimica],
    contribuicoes: [
      {
        id: 1,
        ano: 1898,
        titulo: 'Descoberta do polônio e do rádio',
        descricao: 'Com Pierre Curie, identificou dois novos elementos químicos a partir do minério de urânio.',
        autores: [],
        linkReferencia: 'https://www.nobelprize.org/prizes/physics/1903/marie-curie/biographical/',
      },
      {
        id: 2,
        ano: 1910,
        titulo: 'Isolamento do rádio metálico',
        descricao: 'Obteve o rádio em forma pura, confirmando definitivamente sua existência como elemento.',
        autores: [],
        linkReferencia: 'https://www.nobelprize.org/prizes/chemistry/1911/marie-curie/facts/',
      },
    ],
    premios: [
      { premio: nobelFisica, ano: 1903 },
      { premio: nobelQuimica, ano: 1911 },
    ],
  }),
  cientista({
    id: 2,
    nome: 'Bertha Lutz',
    biografia:
      'Bióloga especializada em anfíbios, atuou por décadas no Museu Nacional. Foi uma das principais lideranças do movimento pelo voto feminino no Brasil e defendeu a igualdade de gênero na fundação das Nações Unidas.',
    instituicao: 'Museu Nacional',
    dataNascimento: new Date(1894, 7, 2),
    dataFalecimento: new Date(1976, 8, 16),
    nacionalidade: 'Brasileira',
    areas: [biologia],
    contribuicoes: [
      {
        id: 3,
        ano: 1919,
        titulo: 'Ingresso no Museu Nacional',
        descricao: 'Aprovada em concurso público, tornou-se uma das primeiras mulheres no serviço público brasileiro.',
        autores: [],
        linkReferencia: '',
      },
      {
        id: 4,
        ano: 1945,
        titulo: 'Igualdade de gênero na Carta da ONU',
        descricao: 'Como delegada do Brasil na Conferência de São Francisco, defendeu a menção à igualdade entre homens e mulheres.',
        autores: [],
        linkReferencia: '',
      },
    ],
    premios: [],
  }),
  cientista({
    id: 3,
    nome: 'Johanna Döbereiner',
    biografia:
      'Agrônoma nascida na antiga Tchecoslováquia e naturalizada brasileira. Suas pesquisas sobre bactérias fixadoras de nitrogênio permitiram cultivar soja no Brasil com menos adubo químico.',
    instituicao: 'Embrapa Agrobiologia',
    dataNascimento: new Date(1924, 10, 28),
    dataFalecimento: new Date(2000, 9, 5),
    nacionalidade: 'Brasileira',
    areas: [biologia],
    contribuicoes: [
      {
        id: 5,
        ano: 1976,
        titulo: 'Bactérias fixadoras de nitrogênio em gramíneas',
        descricao: 'Demonstrou a associação entre bactérias do solo e gramíneas tropicais na fixação biológica de nitrogênio.',
        autores: [],
        linkReferencia: '',
      },
    ],
    premios: [{ premio: unesco, ano: 1989 }],
  }),
  cientista({
    id: 4,
    nome: 'Nise da Silveira',
    biografia:
      'Psiquiatra alagoana, recusou tratamentos agressivos como o eletrochoque e propôs o cuidado por meio da arte e do afeto. Sua obra transformou a forma como o Brasil trata a saúde mental.',
    instituicao: 'Centro Psiquiátrico Pedro II',
    dataNascimento: new Date(1905, 1, 15),
    dataFalecimento: new Date(1999, 9, 30),
    nacionalidade: 'Brasileira',
    areas: [saude],
    contribuicoes: [
      {
        id: 6,
        ano: 1946,
        titulo: 'Seção de Terapêutica Ocupacional',
        descricao: 'Criou ateliês de pintura e modelagem como forma de tratamento no hospital do Engenho de Dentro.',
        autores: [],
        linkReferencia: '',
      },
      {
        id: 7,
        ano: 1952,
        titulo: 'Museu de Imagens do Inconsciente',
        descricao: 'Fundou o museu que reúne e estuda a produção artística dos pacientes.',
        autores: [],
        linkReferencia: '',
      },
    ],
    premios: [],
  }),
  cientista({
    id: 5,
    nome: 'Graziela Barroso',
    biografia:
      'Botânica sul-mato-grossense, começou a carreira científica aos 30 anos e se tornou referência na classificação de plantas brasileiras, formando gerações de taxonomistas.',
    instituicao: 'Jardim Botânico do Rio de Janeiro',
    dataNascimento: new Date(1912, 3, 11),
    dataFalecimento: new Date(2003, 4, 5),
    nacionalidade: 'Brasileira',
    areas: [biologia],
    contribuicoes: [
      {
        id: 8,
        ano: 1978,
        titulo: 'Sistemática de Angiospermas do Brasil',
        descricao: 'Primeiro volume da obra de referência sobre a classificação das plantas com flores do país.',
        autores: [],
        linkReferencia: '',
      },
    ],
    premios: [],
  }),
  cientista({
    id: 6,
    nome: 'Mayana Zatz',
    biografia:
      'Geneticista, coordena o Centro de Estudos do Genoma Humano e Células-Tronco da USP. É referência mundial no estudo de doenças neuromusculares, como as distrofias musculares.',
    instituicao: 'Universidade de São Paulo',
    dataNascimento: new Date(1947, 6, 16),
    nacionalidade: 'Brasileira',
    areas: [biologia, saude],
    contribuicoes: [
      {
        id: 9,
        ano: 2000,
        titulo: 'Centro de Estudos do Genoma Humano',
        descricao: 'Coordena o centro que pesquisa doenças genéticas e oferece aconselhamento a famílias.',
        autores: [],
        linkReferencia: '',
      },
    ],
    premios: [{ premio: loreal, ano: 2001 }],
  }),
  cientista({
    id: 7,
    nome: 'Jaqueline Goes de Jesus',
    biografia:
      'Biomédica baiana, integrou a equipe que sequenciou o genoma do novo coronavírus no Brasil apenas 48 horas após a confirmação do primeiro caso no país.',
    instituicao: 'Instituto de Medicina Tropical da USP',
    dataNascimento: new Date(1989, 0, 1),
    nacionalidade: 'Brasileira',
    areas: [saude, biologia],
    contribuicoes: [
      {
        id: 10,
        ano: 2020,
        titulo: 'Sequenciamento do SARS-CoV-2 no Brasil',
        descricao: 'Sequenciamento rápido que ajudou a acompanhar a chegada e a disseminação do vírus.',
        autores: [],
        linkReferencia: '',
      },
    ],
    premios: [],
  }),
  cientista({
    id: 8,
    nome: 'Rosalind Franklin',
    biografia:
      'Química britânica especialista em difração de raios X. Suas imagens do DNA foram decisivas para a descoberta da estrutura em dupla hélice.',
    instituicao: "King's College London",
    dataNascimento: new Date(1920, 6, 25),
    dataFalecimento: new Date(1958, 3, 16),
    nacionalidade: 'Britânica',
    areas: [quimica, biologia],
    contribuicoes: [
      {
        id: 11,
        ano: 1952,
        titulo: 'Fotografia 51',
        descricao: 'Imagem de difração de raios X que revelou a forma helicoidal do DNA.',
        autores: [],
        linkReferencia: '',
      },
      {
        id: 12,
        ano: 1953,
        titulo: 'Artigo sobre a estrutura do DNA na Nature',
        descricao: 'Publicado na mesma edição dos artigos de Watson, Crick e Wilkins.',
        autores: [],
        linkReferencia: '',
      },
    ],
    premios: [],
  }),
  cientista({
    id: 9,
    nome: 'Ada Lovelace',
    biografia:
      'Matemática inglesa, escreveu notas sobre a Máquina Analítica de Charles Babbage nas quais descreveu o que é considerado o primeiro algoritmo feito para ser executado por uma máquina.',
    instituicao: 'Pesquisadora independente',
    dataNascimento: new Date(1815, 11, 10),
    dataFalecimento: new Date(1852, 10, 27),
    nacionalidade: 'Britânica',
    areas: [matematica, computacao],
    contribuicoes: [
      {
        id: 13,
        ano: 1843,
        titulo: 'Notas sobre a Máquina Analítica',
        descricao: 'Inclui um algoritmo para calcular números de Bernoulli e a ideia de máquinas que vão além do cálculo.',
        autores: [],
        linkReferencia: '',
      },
    ],
    premios: [],
  }),
  cientista({
    id: 10,
    nome: 'Katherine Johnson',
    biografia:
      'Matemática da NASA, calculou trajetórias de voos espaciais tripulados dos Estados Unidos. Sua história ganhou destaque com o livro e o filme “Estrelas Além do Tempo”.',
    instituicao: 'NASA',
    dataNascimento: new Date(1918, 7, 26),
    dataFalecimento: new Date(2020, 1, 24),
    nacionalidade: 'Estadunidense',
    areas: [matematica],
    contribuicoes: [
      {
        id: 14,
        ano: 1961,
        titulo: 'Trajetória do voo de Alan Shepard',
        descricao: 'Análise de trajetória do primeiro voo espacial tripulado dos Estados Unidos.',
        autores: [],
        linkReferencia: '',
      },
      {
        id: 15,
        ano: 1962,
        titulo: 'Verificação do voo orbital de John Glenn',
        descricao: 'Conferiu à mão os cálculos de computador da primeira órbita tripulada estadunidense.',
        autores: [],
        linkReferencia: '',
      },
    ],
    premios: [{ premio: liberdade, ano: 2015 }],
  }),
  cientista({
    id: 11,
    nome: 'Emmy Noether',
    biografia:
      'Matemática alemã, fundamental para a álgebra abstrata. O teorema que leva seu nome liga simetrias da natureza a leis de conservação e é base da física moderna.',
    instituicao: 'Universidade de Göttingen',
    dataNascimento: new Date(1882, 2, 23),
    dataFalecimento: new Date(1935, 3, 14),
    nacionalidade: 'Alemã',
    areas: [matematica, fisica],
    contribuicoes: [
      {
        id: 16,
        ano: 1918,
        titulo: 'Teorema de Noether',
        descricao: 'Mostra que cada simetria contínua de um sistema físico corresponde a uma grandeza conservada.',
        autores: [],
        linkReferencia: '',
      },
    ],
    premios: [],
  }),
];
