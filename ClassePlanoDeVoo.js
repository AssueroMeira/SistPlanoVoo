import { validate } from "bycontract";

export class PlanoDeVoo {
    #id;
    #matriculaPiloto;
    #prefixoAeronave;
    #idAerovia;
    #data;
    #horarioPartida;
    #horarioChegada;
    #altitude;
    #slots;
    #cancelado;

    constructor(id, matriculaPiloto, prefixoAeronave, idAerovia, data, horarioPartida, horarioChegada, altitude, slots, cancelado) {
        validate(arguments, ["number", "string", "string", "string", "string", "string", "string", "number", "array", "boolean"]);
        this.#id = id;
        this.#matriculaPiloto = matriculaPiloto;
        this.#prefixoAeronave = prefixoAeronave;
        this.#idAerovia = idAerovia;
        this.#data = data;
        this.#horarioPartida = horarioPartida;
        this.#horarioChegada = horarioChegada;
        this.#altitude = altitude;
        this.#slots = slots;
        this.#cancelado = cancelado;
    }

    get id() {
        return this.#id;
    }

    get matriculaPiloto() {
        return this.#matriculaPiloto;
    }

    get prefixoAeronave() {
        return this.#prefixoAeronave;
    }

    get idAerovia() {
        return this.#idAerovia;
    }

    get data() {
        return this.#data;
    }

    get horarioPartida() {
        return this.#horarioPartida;
    }

    get horarioChegada() {
        return this.#horarioChegada;
    }

    get altitude() {
        return this.#altitude;
    }

    get slots() {
        return this.#slots;
    }

    get cancelado() {
        return this.#cancelado;
    }

    set cancelado(value) {
        this.#cancelado = value;
    }

    verificarRestricoes(outrosPlanos) {
        for (let plano of outrosPlanos) {
            if (plano.cancelado === false && plano.idAerovia === this.#idAerovia && plano.data === this.#data) {
                for (let slot of this.#slots) {
                    if (plano.slots.includes(slot) && plano.altitude === this.#altitude) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    toString() {
        return `PlanoDeVoo [id=${this.id}, matriculaPiloto=${this.matriculaPiloto}, prefixoAeronave=${this.prefixoAeronave}, idAerovia=${this.idAerovia}, data=${this.data}, horarioPartida=${this.horarioPartida}, horarioChegada=${this.horarioChegada}, altitude=${this.altitude}, slots=${this.slots.join(';')}, cancelado=${this.cancelado}]`;
    }
}




