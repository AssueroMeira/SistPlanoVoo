import { DateTime } from 'luxon';
import { ServicoPilotos } from './ClasseServicoPilotos.js';
import { ServicoAeronaves } from './ClasseServicoAeronaves.js';
import { ServicoAerovias } from './ClasseServicoAerovias.js';
import { ServicoPlanos } from './ClasseServicoPlanos.js';
import { OcupacaoAerovia } from './ClasseOcupacaoAerovia.js';

export class Sistema {
    constructor() {
        this.servicoPilotos = new ServicoPilotos('pilotos.csv');
        this.servicoAeronaves = new ServicoAeronaves('aeronaves.csv');
        this.servicoAerovias = new ServicoAerovias('aerovias.csv');
        this.servicoPlanos = new ServicoPlanos('planos.csv');
        this.ocupacaoAerovia = new OcupacaoAerovia();
    }

    listarAeronavesPorTipo(tipo) {
        return this.servicoAeronaves.todos().filter(aeronave => aeronave.tipo === tipo.toUpperCase());
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

    listarAltitudesLivres(idAerovia, data) {
        const id = idAerovia;
        const dataVoo = data;

        return this.ocupacaoAerovia.altitudesLivres(id, dataVoo);
    }

    aprovarPlanoDeVoo(matricula, prefixo, origem, destino, data, horarioPartida, altitude) {
        try {
            const piloto = this.servicoPilotos.buscaPorMatricula(matricula);
            if (!piloto || !piloto.habilitacaoAtiva) {
                throw new Error('Piloto não encontrado ou habilitação inativa.');
            }

            const aeronave = this.servicoAeronaves.buscaPorPrefixo(prefixo);
            if (!aeronave) {
                throw new Error('Aeronave não encontrada.');
            }

            const aerovias = this.servicoAerovias.todos();
            const aerovia = aerovias.find(a => a.origem === origem && a.destino === destino);
            if (!aerovia) {
                throw new Error('Aerovia não encontrada.');
            }

            const slots = this.calculaSlots(aeronave.velocidadeCruzeiro, aerovia.tamanho, horarioPartida);

            if (!this.ocupacaoAerovia.isOcupado(aerovia.id, data, altitude, slots)) {
                this.ocupacaoAerovia.ocupa(aerovia.id, data, altitude, slots);
                const planoId = this.servicoPlanos.todos().length > 0
                    ? Math.max(...this.servicoPlanos.todos().map(p => p.id)) + 1
                    : 1;
                const plano = new PlanoDeVoo(planoId, matricula, prefixo, origem, destino, data, horarioPartida, altitude, slots, false);
                this.servicoPlanos.consiste(plano);
                return 'Plano de voo aprovado e salvo.';
            } else {
                return 'Plano de voo não pode ser aprovado devido a conflito de horário/altitude.';
            }
        } catch (error) {
            return `Erro ao aprovar plano de voo: ${error.message}`;
        }
    }

    listarPlano(idPlano) {
        const plano = this.servicoPlanos.recupera(idPlano);
        if (plano) {
            return plano;
        } else {
            throw new Error('Plano de voo não encontrado.');
        }
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
}
