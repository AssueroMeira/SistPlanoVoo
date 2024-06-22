import { DateTime } from "luxon";
import { ServicoPilotos } from "./ClasseServicoPilotos.js";
import {
    AeronaveParticular,
    AeronavePassageiros,
    AeronaveCarga,
} from "./ClasseAeronave.js";
import { ServicoAeronaves } from "./ClasseServicoAeronaves.js";
import { ServicoAerovias } from "./ClasseServicoAerovias.js";
import { ServicoPlanos } from "./ClasseServicoPlanos.js";
import { OcupacaoAerovia } from "./ClasseOcupacaoAerovia.js";
import { PlanoDeVoo } from "./ClassePlanoDeVoo.js";
import fs from "fs";

export class Sistema {
    constructor() {
        this.servicoPilotos = new ServicoPilotos("pilotos.csv");
        this.servicoAeronaves = new ServicoAeronaves("aeronaves.csv");
        this.servicoAerovias = new ServicoAerovias("aerovias.csv");
        this.servicoPlanos = new ServicoPlanos("planos.csv");
        this.ocupacaoAerovia = new OcupacaoAerovia("ocupacaoAerovias.csv");
    }

    aprovarPlanoDeVoo(
        matricula,
        prefixo,
        origem,
        destino,
        data,
        horarioPartida,
        altitude,
    ) {
        if (
            this.servicoPlanos.consiste(
                matricula,
                prefixo,
                origem,
                destino,
                data,
                horarioPartida,
                altitude,
            )
        ) {
            const novoId =
                this.servicoPlanos.planos.length > 0
                    ? Math.max(...this.servicoPlanos.planos.map((p) => p.id)) +
                    1
                    : 1;

            const aeronave = this.servicoAeronaves.buscaPorPrefixo(prefixo);
            const aerovia = this.servicoAerovias
                .todos()
                .find((a) => a.origem === origem && a.destino === destino);
            const slots = this.calculaSlots(
                aeronave.velocidadeCruzeiro,
                aerovia.tamanho,
                horarioPartida,
            );

            const plano = new PlanoDeVoo(
                novoId,
                matricula,
                prefixo,
                origem,
                destino,
                data,
                horarioPartida,
                altitude,
                slots,
                false,
            );

            this.servicoPlanos.planos.push(plano);
            const linha = `${plano.id},${plano.matriculaPiloto},${plano.prefixoAeronave},${plano.origem},${plano.destino},${plano.data},${plano.horarioPartida},${plano.altitude},${plano.slots.join(";")},${plano.cancelado ? "SIM" : "NÃO"}\n`;
            fs.appendFileSync("planos.csv", linha);

            // Chamada ao método ocupa para salvar a ocupação
            this.ocupacaoAerovia.ocupa(
                origem,
                destino,
                prefixo,
                data,
                horarioPartida,
                altitude,
            );

            return plano.id;
        }
    }

    cancelaPlano(id) {
        const plano = this.servicoPlanos.recupera(id);
        plano.cancelado = true;
        this.atualizarPlano(plano);
    }

    atualizarPlano(plano) {
        const linhas = fs.readFileSync("planos.csv", "utf8").split("\n");
        const novaLinha = `${plano.id},${plano.matriculaPiloto},${plano.prefixoAeronave},${plano.origem},${plano.destino},${plano.data},${plano.horarioPartida},${plano.altitude},${plano.slots.join(";")},${plano.cancelado ? "SIM" : "NÃO"}`;
        const novasLinhas = linhas
            .map((linha) =>
                linha.startsWith(`${plano.id},`) ? novaLinha : linha,
            )
            .join("\n");
        fs.writeFileSync("planos.csv", novasLinhas, "utf8");
    }

    listarAeronavesPorTipo(tipo) {
        return this.servicoAeronaves
            .todos()
            .filter((aeronave) => aeronave.tipo === tipo.toUpperCase());
    }

    listarDadosPiloto(matricula) {
        return this.servicoPilotos.buscaPorMatricula(matricula);
    }

    listarTodosPilotos() {
        return this.servicoPilotos.todos();
    }

    listarAerovias() {
        return this.servicoAerovias.todos();
    }

    listarAltitudesLivres(origem, destino, prefixoAeronave, data, hora) {
        const aerovia = this.servicoAerovias
            .todos()
            .find((a) => a.origem === origem && a.destino === destino);
        const slots = this.calculaSlots(
            this.servicoAeronaves.buscaPorPrefixo(prefixoAeronave)
                .velocidadeCruzeiro,
            aerovia.tamanho,
            hora,
        );
        return this.ocupacaoAerovia.listarAltitudesLivres(
            `${origem}-${destino}`,
            data,
            slots,
        );
    }

    salvarPlano(plano) {
        const linha = `${plano.id},${plano.matriculaPiloto},${plano.prefixoAeronave},${plano.origem},${plano.destino},${plano.data},${plano.horarioPartida},${plano.altitude},${plano.slots.join(";")},${plano.cancelado ? "SIM" : "NÃO"}\n`;
        fs.appendFileSync("planos.csv", linha);
        console.log("Plano adicionado ao arquivo planos.csv:", linha);
    }

    listarPlano(id) {
        const plano = this.servicoPlanos.recupera(id);
        console.log(plano.toString());
    }

    calculaSlots(velocidadeCruzeiro, tamanho, horarioInicio) {
        const tempoViagem = tamanho / velocidadeCruzeiro;
        const minutosTotais = tempoViagem * 60;
        const horarioInicial = DateTime.fromFormat(horarioInicio, "HH:mm");
        const slots = [];

        for (let i = 0; i <= Math.ceil(minutosTotais / 60); i++) {
            slots.push(horarioInicial.plus({ hours: i }).hour);
        }

        return slots;
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
}
