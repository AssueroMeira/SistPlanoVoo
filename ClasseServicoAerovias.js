import { Aerovia } from './ClasseAerovia.js';
import { validate } from "bycontract";
import nReadlines from "n-readlines";

export class ServicoAerovias {
    #aerovias;

    constructor(narq = "aerovias.csv") {
        validate(narq, "string");
        this.#aerovias = [];
        this.recupera(narq);
    }

    recupera(narq) {
        validate(narq, "string");
        let arq = new nReadlines(narq);
        let buf;
        let dados;

        arq.next();

        while (buf = arq.next()) {
            let line = buf.toString('utf8');
            dados = line.split(",");
            if (dados.length === 6) {
                this.#aerovias.push(new Aerovia(dados[0], dados[1], dados[2], dados[3], parseFloat(dados[4]), parseInt(dados[5])));
            } else {
                console.error("Formato de linha inválido em aerovias.csv:", line);
            }
        }
    }

    todos() {
        return this.#aerovias;
    }
}
