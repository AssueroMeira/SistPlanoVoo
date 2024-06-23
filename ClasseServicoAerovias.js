import { Aerovia } from "./ClasseAerovia.js";
import { validate } from "bycontract";
import fs from 'fs';

export class ServicoAerovias {
    #aerovias;

    constructor(narq = "aerovias.csv") {
        validate(narq, "string");
        this.#aerovias = [];
        this.recupera(narq);
    }

    recupera(narq) {
        validate(narq, "string");
        const data = fs.readFileSync(narq, 'utf8');
        const linhas = data.split('\n');
        linhas.shift();  // Remove o cabeçalho

        linhas.forEach((linha) => {
            const dados = linha.split(',');
            if (dados.length === 6) {
                this.#aerovias.push(
                    new Aerovia(
                        dados[0],
                        dados[1],
                        dados[2],
                        dados[3],
                        parseFloat(dados[4]),
                        parseInt(dados[5]),
                    ),
                );
            } else {
                console.error(
                    "Formato de linha inválido em aerovias.csv:",
                    linha,
                );
            }
        });
    }

    todos() {
        return this.#aerovias;
    }

    buscarPorId(id) {
        return this.#aerovias.find(aerovia => aerovia.id === id);
    }
}
