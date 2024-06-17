import { DateTime } from "luxon";

export class OcupacaoAerovia {
    constructor() {
        this.ocupacoes = new Map();
    }

    // Método para verificar se a altitude está livre em uma data e horário
    altitudesLivres(idAerovia, data, horarioInicio, horarioFim) {
        const altitudes = [];
        for (let altitude = 25000; altitude <= 35000; altitude += 1000) {
            if (!this.isOcupado(idAerovia, data, altitude, horarioInicio, horarioFim)) {
                altitudes.push(altitude);
            }
        }
        return altitudes;
    }

    // Método para ocupar uma altitude em uma data e horário
    ocupa(idAerovia, data, altitude, slots) {
        slots.forEach(slot => {
            const chave = `${idAerovia}-${data}-${slot}`;
            if (!this.ocupacoes.has(chave)) {
                this.ocupacoes.set(chave, new Set());
            }
            this.ocupacoes.get(chave).add(altitude);
        });
    }

    // Método para verificar se uma altitude está ocupada em uma data e horário
    isOcupado(idAerovia, data, altitude, horarioInicio, horarioFim) {
        const horarioInicial = DateTime.fromISO(horarioInicio);
        const horarioFinal = DateTime.fromISO(horarioFim);

        for (let i = 0; i <= horarioFinal.diff(horarioInicial, 'hours').hours; i++) {
            const slot = horarioInicial.plus({ hours: i }).toFormat('HH');
            const chave = `${idAerovia}-${data}-${slot}`;
            if (this.ocupacoes.has(chave) && this.ocupacoes.get(chave).has(altitude)) {
                return true;
            }
        }
        return false;
    }

    // Método para verificar a disponibilidade de slots de horário
    verificaDisponibilidade(idAerovia, data, altitude, slots) {
        return slots.every(slot => {
            const chave = `${idAerovia}-${data}-${slot}`;
            return !(this.ocupacoes.has(chave) && this.ocupacoes.get(chave).has(altitude));
        });
    }
}
