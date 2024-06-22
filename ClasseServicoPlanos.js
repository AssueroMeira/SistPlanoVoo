import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PlanoDeVoo } from "./ClassePlanoDeVoo.js";
import { ServicoPilotos } from "./ClasseServicoPilotos.js";
import {
    AeronaveParticular,
    AeronavePassageiros,
    AeronaveCarga,
} from "./ClasseAeronave.js";
import { ServicoAeronaves } from "./ClasseServicoAeronaves.js";
import { ServicoAerovias } from "./ClasseServicoAerovias.js";
import { OcupacaoAerovia } from "./ClasseOcupacaoAerovia.js";
import { DateTime } from "luxon";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ServicoPlanos {
    constructor(arquivoPlanos) {
        this.arquivoPlanos = arquivoPlanos;
        this.planos = this.carregarPlanos();
        this.servicoPilotos = new ServicoPilotos("pilotos.csv");
        this.servicoAeronaves = new ServicoAeronaves("aeronaves.csv");
        this.servicoAerovias = new ServicoAerovias("aerovias.csv");
        this.ocupacaoAerovia = new OcupacaoAerovia("ocupacaoAerovias.csv");
    }

    carregarPlanos() {
        const planos = [];
        const dados = fs.readFileSync(
            path.resolve(__dirname, this.arquivoPlanos),
            "utf8",
        );
        const linhas = dados.trim().split("\n");
        linhas.forEach((linha, index) => {
            if (index > 0) {
                const [
                    id,
                    matriculaPiloto,
                    prefixoAeronave,
                    origem,
                    destino,
                    data,
                    horarioPartida,
                    altitude,
                    slots,
                    cancelado,
                ] = linha.split(",");
                planos.push(
                    new PlanoDeVoo(
                        parseInt(id),
                        matriculaPiloto,
                        prefixoAeronave,
                        origem,
                        destino,
                        data,
                        horarioPartida,
                        parseInt(altitude),
                        slots.split(";").map((slot) => parseInt(slot)),
                        cancelado === "SIM",
                    ),
                );
            }
        });
        return planos;
    }

    consiste(
        matricula,
        prefixo,
        origemVoo,
        destinoVoo,
        dataVoo,
        horarioPartidaVoo,
        altitudeVoo,
    ) {
        const piloto = this.servicoPilotos.buscaPorMatricula(matricula);
        if (!piloto || !piloto.habilitacaoAtiva) {
            throw new Error("Habilitação do piloto está inativa.");
        }

        const aeronave = this.servicoAeronaves.buscaPorPrefixo(prefixo);
        if (!aeronave) {
            throw new Error("Aeronave não encontrada.");
        }

        const aerovia = this.servicoAerovias
            .todos()
            .find(
                (aerovia) =>
                    aerovia.origem === origemVoo &&
                    aerovia.destino === destinoVoo,
            );
        if (!aerovia) {
            throw new Error("Aerovia não encontrada.");
        }

        if (!this.verificarAutonomia(aeronave, aerovia.tamanho)) {
            throw new Error(
                "A aeronave não tem autonomia suficiente para o trecho.",
            );
        }

        if (!this.verificarCompatibilidadeAltitudes(aeronave, altitudeVoo)) {
            throw new Error(
                "A altitude escolhida não é compatível com a aeronave.",
            );
        }

        if (!this.verificarRestricoesHorario(aeronave, horarioPartidaVoo)) {
            throw new Error("A aeronave não pode voar no horário escolhido.");
        }

        if (
            this.ocupacaoAerovia.isOcupado(
                origemVoo,
                destinoVoo,
                prefixo,
                horarioPartidaVoo,
                dataVoo,
                altitudeVoo,
            )
        ) {
            throw new Error("Os slots de horário necessários estão ocupados.");
        }

        return true;
    }

    verificarAutonomia(aeronave, tamanho) {
        return aeronave.autonomia > tamanho * 1.1;
    }

    verificarCompatibilidadeAltitudes(aeronave, altitude) {
        if (aeronave instanceof AeronavePassageiros) {
            return altitude >= 28000;
        }
        if (aeronave instanceof AeronaveParticular) {
            return altitude >= 25000 && altitude <= 27000;
        }
        return true;
    }

    verificarRestricoesHorario(aeronave, horarioPartida) {
        if (aeronave instanceof AeronaveCarga) {
            const hora = DateTime.fromFormat(horarioPartida, "HH:mm").hour;
            return hora >= 0 && hora <= 6;
        }
        return true;
    }

    recupera(id) {
        const plano = this.planos.find((plano) => plano.id === id);
        if (!plano) {
            throw new Error(`Plano com id ${id} não encontrado.`);
        }
        return plano;
    }
}
