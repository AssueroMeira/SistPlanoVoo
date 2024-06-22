import { validate } from "bycontract";
import { DateTime } from "luxon";

export class PlanoDeVoo {
    #id;
    #matriculaPiloto;
    #prefixoAeronave;
    #origem;
    #destino;
    #data;
    #horarioPartida;
    #altitude;
    #slots;
    #cancelado;

    constructor(
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
    ) {
        validate(arguments, [
            "number",
            "string",
            "string",
            "string",
            "string",
            "string",
            "string",
            "number",
            "array",
            "boolean",
        ]);
        this.#id = id;
        this.#matriculaPiloto = matriculaPiloto.trim().toUpperCase();
        this.#prefixoAeronave = prefixoAeronave.trim().toUpperCase();
        this.#origem = origem.trim().toUpperCase();
        this.#destino = destino.trim().toUpperCase();
        this.#data = DateTime.fromFormat(data, "dd-MM-yyyy").toISODate();
        this.#horarioPartida = DateTime.fromFormat(
            horarioPartida,
            "HH:mm",
        ).toISO();
        if (isNaN(altitude) || altitude <= 0) {
            throw new Error(`Altitude inválida: ${altitude}.`);
        }
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

    get origem() {
        return this.#origem;
    }

    get destino() {
        return this.#destino;
    }

    get data() {
        return this.#data;
    }

    get horarioPartida() {
        return this.#horarioPartida;
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

    toString() {
        return `PlanoDeVoo [id=${this.id}, matriculaPiloto=${this.matriculaPiloto}, prefixoAeronave=${this.prefixoAeronave}, origem=${this.origem}, destino=${this.destino}, data=${this.data}, horarioPartida=${this.horarioPartida}, altitude=${this.altitude}, slots=${this.slots.join(";")}, cancelado=${this.cancelado}]`;
    }
}
