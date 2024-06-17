import { Piloto } from "./ClassePiloto.js";
import { validate } from "bycontract";
import nReadlines from "n-readlines";

// Implementação da classe ServicoPilotos
// Esta classe criará um Array dos dados do arquivo .csv.
export class ServicoPilotos {
    #pilotos;

    constructor(narq = "pilotos.csv") {
        validate(narq, "string");
        this.#pilotos = [];
        this.recupera(narq);
    }

    // método para recuperar os dados do arquivo
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
            if (dados.length === 3) {
                try {
                    this.#pilotos.push(new Piloto(dados[0], dados[1], dados[2]));
                } catch (error) {
                    console.error(`Erro ao criar Piloto com dados: ${line}`, error.message);
                }
            } else {
                console.error("Formato de linha inválido em pilotos.csv:", line);
            }
        }
    }

    // Método para retornar os dados do arquivo.
    todos() {
        return this.#pilotos;
    }

    // Método para buscar piloto por matrícula.
    buscaPorMatricula(matricula) {
        validate(matricula, "string");
        return this.#pilotos.find(piloto => piloto.matricula === matricula);
    }
}
