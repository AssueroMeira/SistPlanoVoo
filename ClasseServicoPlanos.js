import { PlanoDeVoo } from './ClassePlanoDeVoo.js';
import { validate } from "bycontract";
import nReadlines from "n-readlines";
import fs from 'fs';

export class ServicoPlanos {
    #planos;

    constructor(narq = "planos.csv") {
        validate(narq, "string");
        this.#planos = [];
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
            if (dados.length === 10) {
                this.#planos.push(new PlanoDeVoo(
                    parseInt(dados[0]), dados[1], dados[2], dados[3], dados[4], dados[5], dados[6],
                    parseInt(dados[7]), dados[8].split(";").map(Number), dados[9] === 'true'
                ));
            } else {
                console.error("Formato de linha inválido em planos.csv:", line);
            }
        }
    }

    adicionar(plano) {
        validate(plano, PlanoDeVoo);
        this.#planos.push(plano);
        const line = `${plano.id},${plano.matriculaPiloto},${plano.prefixoAeronave},${plano.idAerovia},${plano.data},${plano.horarioPartida},${plano.horarioChegada},${plano.altitude},${plano.slots.join(';')},${plano.cancelado}\n`;
        fs.appendFileSync('planos.csv', line);
    }

    verificarDisponibilidade(novoPlano) {
        return novoPlano.verificarRestricoes(this.#planos);
    }

    todos() {
        return this.#planos;
    }
}







