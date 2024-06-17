// Este módulo deverá ser testado com a execução do módulo AppExUso.js
import { Aeronave, AeronaveParticular, AeronaveComercial, AeronavePassageiros, AeronaveCarga } from "./ClasseAeronave.js";
import { validate } from "bycontract";
import nReadlines from "n-readlines";

// Implementando a classe ServicoAeronaves
export class ServicoAeronaves {
    #aeronaves;

    constructor(narq = "aeronaves.csv") {
        validate(narq, "string");
        this.#aeronaves = [];
        this.recupera(narq);
    }

    // Cria um Array a partir do arquivo .csv.
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
            if (dados.length >= 5) {
                switch (dados[1].trim()) {
                    case 'Particular':
                        if (dados.length >= 5) {
                            this.#aeronaves.push(new AeronaveParticular(dados[0], parseInt(dados[2]), parseInt(dados[3]), dados[4]));
                        } else {
                            console.error("Formato de linha inválido para Aeronave Particular em aeronaves.csv:", line);
                        }
                        break;
                    case 'Comercial Passageiros':
                        if (dados.length >= 7) {
                            this.#aeronaves.push(new AeronavePassageiros(dados[0], parseInt(dados[2]), parseInt(dados[3]), dados[5], parseInt(dados[6])));
                        } else {
                            console.error("Formato de linha inválido para Aeronave Comercial Passageiros em aeronaves.csv:", line);
                        }
                        break;
                    case 'Comercial Carga':
                        if (dados.length >= 8) {
                            this.#aeronaves.push(new AeronaveCarga(dados[0], parseInt(dados[2]), parseInt(dados[3]), dados[5], parseInt(dados[7])));
                        } else {
                            console.error("Formato de linha inválido para Aeronave Comercial Carga em aeronaves.csv:", line);
                        }
                        break;
                    default:
                        console.error("Tipo de aeronave desconhecido em aeronaves.csv:", line);
                }
            } else {
                console.error("Formato de linha inválido em aeronaves.csv:", line);
            }
        }
    }

    // Retorna os dados do Array.
    todos() {
        return this.#aeronaves;
    }
}

