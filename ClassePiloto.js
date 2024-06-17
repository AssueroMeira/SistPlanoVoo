import { validate } from "bycontract";

// Todas as classes e subclasses foram implementadas para serem importadas por outros módulos.
// Implementando a classe Piloto, conforme diagrama de classes.
export class Piloto {
    #matricula;
    #nome;
    #habilitacaoAtiva;
    // Considera-se que os dados serão captados em um arquivo externo.
    // Construtor padroniza os dados.
    constructor(matricula, nome, habilitacaoAtiva) {
        validate(arguments, ["string", "string", "string"]);
        this.#matricula = matricula.trim().toUpperCase();
        this.#nome = nome.trim().toUpperCase();
        const habilitacao = habilitacaoAtiva.trim().toLowerCase();
        if (habilitacao === "ativo") {
            this.#habilitacaoAtiva = true;
        } else if (habilitacao === "inativo") {
            this.#habilitacaoAtiva = false;
        } else {
            throw new Error("Estado de habilitação inválido");
        }
    }

    get matricula() {
        return this.#matricula;
    }

    get nome() {
        return this.#nome;
    }

    get habilitacaoAtiva() {
        return this.#habilitacaoAtiva;
    }

    toString() {
        return `Matrícula: ${this.matricula}. Nome: ${this.nome}. Habilitação: ${this.habilitacaoAtiva ? 'Ativo' : 'Inativo'}`;
    }
}
