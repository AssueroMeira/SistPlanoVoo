import { ServicoPilotos } from './ClasseServicoPilotos.js';
import { ServicoAeronaves } from './ClasseServicoAeronaves.js';
import { ServicoAerovias } from './ClasseServicoAerovias.js';
import { ServicoPlanos } from './ClasseServicoPlanos.js';
import { PlanoDeVoo } from './ClassePlanoDeVoo.js';
import { OcupacaoAerovia } from './ClasseOcupacaoAerovia.js';
import { DateTime } from 'luxon';
import { AeronavePassageiros, AeronaveParticular, AeronaveCarga } from './ClasseAeronave.js';

export class Sistema {
    constructor() {
        this.servicoPilotos = new ServicoPilotos('pilotos.csv');
        this.servicoAeronaves = new ServicoAeronaves('aeronaves.csv');
        this.servicoAerovias = new ServicoAerovias('aerovias.csv');
        this.servicoPlanos = new ServicoPlanos('planos.csv');
        this.ocupacaoAerovia = new OcupacaoAerovia();
    }

    listarAerovias(origem, destino) {
        return this.servicoAerovias.todos().filter(aerovia => aerovia.origem === origem && aerovia.destino === destino);
    }

    listarAltitudesLivres(idAerovia, tipoAeronave, horarioInicio, horarioFim) {
        const ocupacoes = this.ocupacaoAerovia.altitudesLivres(idAerovia, horarioInicio, horarioFim);
        if (tipoAeronave === 'Particular') {
            return ocupacoes.filter(altitude => altitude >= 25000 && altitude <= 27000);
        } else if (tipoAeronave === 'Comercial Passageiros') {
            return ocupacoes.filter(altitude => altitude > 28000);
        } else if (tipoAeronave === 'Comercial Carga') {
            const horaInicio = DateTime.fromISO(horarioInicio).hour;
            const horaFim = DateTime.fromISO(horarioFim).hour;
            if (horaInicio < 0 || horaFim > 6) {
                throw new Error("Aeronaves de carga só podem voar entre 00:00 e 06:00.");
            }
            return ocupacoes;
        } else {
            throw new Error("Tipo de aeronave inválido.");
        }
    }

    submeterPlanoDeVoo(matriculaPiloto, prefixoAeronave, origem, destino, data, horarioPartida, horarioChegada, altitude) {
        const piloto = this.servicoPilotos.todos().find(p => p.matricula === matriculaPiloto);
        if (!piloto || !piloto.habilitacaoAtiva) {
            return this.marcarPlanoComoCancelado(matriculaPiloto, prefixoAeronave, origem, destino, data, horarioPartida, horarioChegada, altitude);
        }

        const aeronave = this.servicoAeronaves.todos().find(a => a.prefixo === prefixoAeronave);
        if (!aeronave) {
            return this.marcarPlanoComoCancelado(matriculaPiloto, prefixoAeronave, origem, destino, data, horarioPartida, horarioChegada, altitude);
        }

        const aerovia = this.servicoAerovias.todos().find(a => a.origem === origem && a.destino === destino);
        if (!aerovia) {
            return this.marcarPlanoComoCancelado(matriculaPiloto, prefixoAeronave, origem, destino, data, horarioPartida, horarioChegada, altitude);
        }

        if (aeronave.autonomia < aerovia.tamanho * 1.1) {
            return this.marcarPlanoComoCancelado(matriculaPiloto, prefixoAeronave, origem, destino, data, horarioPartida, horarioChegada, altitude);
        }

        if (!this.validarAltitude(aeronave, altitude, horarioPartida, horarioChegada)) {
            return this.marcarPlanoComoCancelado(matriculaPiloto, prefixoAeronave, origem, destino, data, horarioPartida, horarioChegada, altitude);
        }

        const slots = this.calculaSlots(aeronave.velocidadeCruzeiro, aerovia.tamanho, horarioPartida);
        const idPlano = this.servicoPlanos.todos().length > 0 ? this.servicoPlanos.todos().map(plano => plano.id).reduce((maxId, currId) => Math.max(maxId, currId)) + 1 : 1;

        let cancelado = false;

        if (!this.verificarDisponibilidade(aerovia.id, data, altitude, slots)) {
            cancelado = true;
        }

        const plano = new PlanoDeVoo(idPlano, matriculaPiloto, prefixoAeronave, aerovia.id, data, horarioPartida, horarioChegada, altitude, slots, cancelado);

        this.servicoPlanos.adicionar(plano);
        if (!cancelado) {
            this.ocupacaoAerovia.ocupa(aerovia.id, data, altitude, slots);
        }

        return plano.id;
    }

    verificarDisponibilidade(idAerovia, data, altitude, slots) {
        const planos = this.servicoPlanos.todos().filter(p => !p.cancelado);
        for (let plano of planos) {
            if (plano.idAerovia === idAerovia && plano.data === data) {
                for (let slot of slots) {
                    if (plano.slots.includes(slot) && plano.altitude === altitude) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    listarPlano(idPlano) {
        const plano = this.servicoPlanos.todos().find(p => p.id === idPlano);
        if (!plano) {
            throw new Error("Plano de voo não encontrado.");
        }
        return plano;
    }

    listarSiglasAeroportos() {
        const siglas = new Set();
        this.servicoAerovias.todos().forEach(aerovia => {
            siglas.add(aerovia.origem);
            siglas.add(aerovia.destino);
        });
        return Array.from(siglas);
    }

    validarAerovia(idAerovia) {
        return this.servicoAerovias.todos().some(aerovia => aerovia.id === idAerovia);
    }

    calculaSlots(velocidadeCruzeiro, tamanho, horarioInicio) {
        const tempoViagem = tamanho / velocidadeCruzeiro;
        const minutosTotais = tempoViagem * 60;
        const horarioInicial = DateTime.fromISO(horarioInicio);
        const slots = [];

        for (let i = 0; i <= Math.ceil(minutosTotais / 60); i++) {
            slots.push(horarioInicial.plus({ hours: i }).toFormat('HH'));
        }

        return slots;
    }

    validarAltitude(aeronave, altitude, horarioPartida, horarioChegada) {
        if (aeronave instanceof AeronavePassageiros && altitude <= 28000) {
            return false;
        }
        if (aeronave instanceof AeronaveParticular && (altitude < 25000 || altitude > 27000)) {
            return false;
        }
        if (aeronave instanceof AeronaveCarga) {
            const horaInicio = DateTime.fromISO(horarioPartida).hour;
            const horaFim = DateTime.fromISO(horarioChegada).hour;
            if (horaInicio < 0 || horaFim > 6) {
                return false;
            }
        }
        return true;
    }

    marcarPlanoComoCancelado(matriculaPiloto, prefixoAeronave, origem, destino, data, horarioPartida, horarioChegada, altitude) {
        const idPlano = this.servicoPlanos.todos().length > 0 ? this.servicoPlanos.todos().map(plano => plano.id).reduce((maxId, currId) => Math.max(maxId, currId)) + 1 : 1;
        const slots = this.calculaSlots(0, 0, horarioPartida); // Gerar slots fictícios para o plano cancelado
        const planoCancelado = new PlanoDeVoo(idPlano, matriculaPiloto, prefixoAeronave, origem, data, horarioPartida, horarioChegada, altitude, slots, true);
        this.servicoPlanos.adicionar(planoCancelado);
        return planoCancelado.id;
    }
}
