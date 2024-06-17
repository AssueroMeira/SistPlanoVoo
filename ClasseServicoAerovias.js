import { Aerovia } from './ClasseAerovia.js';
import { validate } from "bycontract";
import nReadlines from "n-readlines";

// Implementação da classe ServicoAerovias
export class ServicoAerovias {
    #aerovias;

    constructor(narq = "aerovias.csv") {
        validate(narq, "string");
        this.#aerovias = [];
        this.recupera(narq);
    }

    // Cria um Array com os dados do arquivo .csv.
    recupera(narq) {
        validate(narq, "string");
        let arq = new nReadlines(narq);
        let buf;
        let dados;

        // Pula a primeira linha
        arq.next();

        // Enquanto houverem linhas (leitura síncrona)
        while (buf = arq.next()) {
            let line = buf.toString('utf8');
            dados = line.split(",");
            if (dados.length === 6) {
                this.#aerovias.push(new Aerovia(dados[0], dados[2], dados[3], parseFloat(dados[4]), parseInt(dados[5]), dados[1]));
            } else {
                console.error("Formato de linha inválido em aerovias.csv:", line);
            }
        }
    }

    // Retorna os dados do Array.
    todos() {
        return this.#aerovias;
    }
}
