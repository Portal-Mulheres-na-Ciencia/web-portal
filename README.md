# PortalMulheresNaCiencia

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

```mermaid
classDiagram
    class Usuario {
        +Integer idUsuario
        +String nome
        +String email
        +String senhaHash
        +String dataCriacao
    }

    class SugestaoCientista {
        +Integer idSugestaoCientista
        +String nomeCientista
        +String justificativa
        +String nomeSugestor
        +String emailSugestor
        +Date dataSugestao
        +String status
    }

    class Cientista {
        +Integer idCientista
        +String nome
        +String biografia
        +String instituicaoPrincipal
        +Date dataNascimento
        +Date dataFalecimento
        +String nacionalidade
    }

    class AreaAtuacao {
        +Integer idAreaAtuacao
        +String nome
        +String descricao
    }

    class Contribuicao {
        +Integer idContribuicao
        +String titulo
        +String descricao
        +Integer ano
        +String linkReferencia
    }

    class Premio {
        +Integer idPremio
        +String nome
        +String instituicao
    }

    class CientistaPremio {
        +Date recebidoEm
    }

    %% Relacionamentos
    Usuario "1" <-- "0..*" SugestaoCientista : revisa
    SugestaoCientista "1" <-- "0..1" Cientista : origina
    Cientista "1" --> "1..*" AreaAtuacao : atua em
    Cientista "1" --> "0..*" Contribuicao : possui
    
    %% Relacionamento com classe associativa
    Cientista "1" --> "0..*" CientistaPremio : recebe
    CientistaPremio "0..*" --> "1" Premio : referente a
```
