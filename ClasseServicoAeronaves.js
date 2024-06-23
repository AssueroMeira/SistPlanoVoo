import { validate } from "bycontract";
import {
    AeronaveParticular,
    AeronavePassageiros,
    AeronaveCarga,
} from "./ClasseAeronave.js";
import nReadlines from "n-readlines";

export class ServicoAeronaves {
    #aeronaves;
    #recuperaChamado = false;

    constructor(narq = "aeronaves.csv") {
        validate(narq, "string");
        this.#aeronaves = [];
        this.recupera(narq);
    }

    recupera(narq) {
        if (this.#recuperaChamado) {
            return;
        }
        this.#recuperaChamado = true;

        validate(narq, "string");
        let arq = new nReadlines(narq);
        let buf;
        let dados;

        arq.next(); // Ignorar cabeçalho

        while ((buf = arq.next())) {
            let line = buf.toString("utf8");
            dados = line.split(",");

            if (dados.length >= 5) {
                switch (dados[1].trim()) {
                    case "PARTICULAR":
                        if (dados.length >= 6) {
                            this.#aeronaves.push(
                                new AeronaveParticular(
                                    dados[0].trim(),
                                    dados[1].trim(),
                                    parseInt(dados[2].trim()),
                                    parseInt(dados[3].trim()),
                                    dados[4].trim(),
                                    dados[5].trim()
                                )
                            );
                        } else {
                            console.error(
                                "Formato de linha inválido para Aeronave Particular em aeronaves.csv:",
                                line
                            );
                        }
                        break;
                    case "COMERCIAL PASSAGEIROS":
                        if (dados.length >= 7) {
                            this.#aeronaves.push(
                                new AeronavePassageiros(
                                    dados[0].trim(),
                                    dados[1].trim(),
                                    parseInt(dados[2].trim()),
                                    parseInt(dados[3].trim()),
                                    dados[5].trim(),
                                    parseInt(dados[6].trim())
                                )
                            );
                        } else {
                            console.error(
                                "Formato de linha inválido para Aeronave Comercial Passageiros em aeronaves.csv:",
                                line
                            );
                        }
                        break;
                    case "COMERCIAL CARGA":
                        if (dados.length >= 8) {
                            this.#aeronaves.push(
                                new AeronaveCarga(
                                    dados[0].trim(),
                                    dados[1].trim(),
                                    parseInt(dados[2].trim()),
                                    parseInt(dados[3].trim()),
                                    dados[5].trim(),
                                    parseInt(dados[7].trim())
                                )
                            );
                        } else {
                            console.error(
                                "Formato de linha inválido para Aeronave Comercial Carga em aeronaves.csv:",
                                line
                            );
                        }
                        break;
                    default:
                        console.error(
                            "Tipo de aeronave desconhecido em aeronaves.csv:",
                            line
                        );
                }
            } else {
                console.error("Formato de linha inválido em aeronaves.csv:", line);
            }
        }
    }

    todos() {
        return this.#aeronaves;
    }

    buscaPorPrefixo(prefixo) {
        validate(prefixo, "string");
        return this.#aeronaves.find(
            (aeronave) => aeronave.prefixo === prefixo.toUpperCase()
        );
    }
}
