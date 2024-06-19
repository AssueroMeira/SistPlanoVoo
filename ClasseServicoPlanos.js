import { validate } from "bycontract";
import { PlanoDeVoo } from './ClassePlanoDeVoo.js';
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

        arq.next(); // Ignorar cabeçalho

        while (buf = arq.next()) {
            let line = buf.toString('utf8');
            dados = line.split(",");
            if (dados.length === 10) {
                this.#planos.push(new PlanoDeVoo(
                    parseInt(dados[0].trim()),
                    dados[1].trim(),
                    dados[2].trim(),
                    dados[3].trim(),
                    dados[4].trim(),
                    dados[5].trim(),
                    parseInt(dados[6].trim()),
                    dados[7].trim().split(";").map(Number),
                    dados[8].trim()
                ));
            } else {
                console.error("Formato de linha inválido em planos.csv:", line);
            }
        }
    }

    consiste(plano) {
        validate(plano, PlanoDeVoo);
        // Validar dados do plano (id único, matricula de piloto ativa, etc.)
        // Supondo que esta função realize todas as validações necessárias
    }

    salvarPlano(plano) {
        validate(plano, PlanoDeVoo);
        this.#planos.push(plano);
        const line = `${plano.id},${plano.matriculaPiloto},${plano.prefixoAeronave},${plano.origem},${plano.destino},${plano.data},${plano.horarioPartida},${plano.altitude},${plano.slots.join(';')},${plano.cancelado}\n`;
        fs.appendFileSync('planos.csv', line);
        console.log('Plano adicionado ao arquivo planos.csv:', line);
    }

    todos() {
        return this.#planos;
    }

    recupera(idPlano) {
        const planosValidos = this.#planos.filter(plano => plano.id === idPlano && !plano.cancelado);
        const planosCancelados = this.#planos.filter(plano => plano.id === idPlano && plano.cancelado);
        return {
            planosValidos,
            planosCancelados
        };
    }
}
