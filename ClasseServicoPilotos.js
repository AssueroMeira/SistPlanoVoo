import { Piloto } from "./ClassePiloto.js";
import { validate } from "bycontract";
import nReadlines from "n-readlines";

export class ServicoPilotos {
    #pilotos;

    constructor(narq = "pilotos.csv") {
        validate(narq, "string");
        this.#pilotos = [];
        this.recupera(narq);
    }

    recupera(narq) {
        validate(narq, "string");
        let arq = new nReadlines(narq);
        let buf;
        let dados;

        arq.next();

        while ((buf = arq.next())) {
            let line = buf.toString("utf8");
            dados = line.split(",");
            if (dados.length === 3) {
                try {
                    this.#pilotos.push(
                        new Piloto(dados[0], dados[1], dados[2]),
                    );
                } catch (error) {
                    console.error(
                        `Erro ao criar Piloto com dados: ${line}`,
                        error.message,
                    );
                }
            } else {
                console.error(
                    "Formato de linha inválido em pilotos.csv:",
                    line,
                );
            }
        }
    }

    todos() {
        return this.#pilotos;
    }

    buscaPorMatricula(matricula) {
        validate(matricula, "string");
        const piloto = this.#pilotos.find(
            (piloto) => piloto.matricula === matricula.toUpperCase(),
        );
        if (!piloto) {
            throw new Error(`Matrícula não encontrada: ${matricula}`);
        }
        return piloto;
    }
}
