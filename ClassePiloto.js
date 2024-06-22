import { validate } from "bycontract";

export class Piloto {
    #matricula;
    #nome;
    #habilitacaoAtiva;

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
        return `Matrícula: ${this.matricula}. Nome: ${this.nome}. Habilitação: ${this.habilitacaoAtiva ? "Ativo" : "Inativo"}`;
    }
}
