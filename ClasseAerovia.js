import { validate } from "bycontract";

// Classe Aerovia conforme especificações
export class Aerovia {
    #id;
    #rota;
    #origem;
    #destino;
    #tamanho;
    #altitude;

    // Limites de altitude
    static altitudeMin = 25000;
    static altitudeMax = 35000;

    constructor(id, rota, origem, destino, tamanho, altitude) {
        validate(arguments, [
            "string",
            "string",
            "string",
            "string",
            "number",
            "number",
        ]);
        this.#id = id.trim().toUpperCase();
        this.#rota = rota.trim().toUpperCase();
        this.#origem = origem.trim().toUpperCase();
        this.#destino = destino.trim().toUpperCase();
        if (isNaN(tamanho) || tamanho <= 0) {
            throw new Error(`Tamanho inválido: ${tamanho}.`);
        }
        this.#tamanho = tamanho;
        if (
            isNaN(altitude) ||
            altitude < Aerovia.altitudeMin ||
            altitude > Aerovia.altitudeMax
        ) {
            throw new Error(
                `${altitude} pés está fora dos limites permitidos. As aerovias devem ter altitudes entre 25000 e 35000 pés.`,
            );
        }
        this.#altitude = altitude;
        this.#rota = rota.trim().toUpperCase();
    }

    get id() {
        return this.#id;
    }

    get rota() {
        return this.#rota;
    }

    get origem() {
        return this.#origem;
    }

    get destino() {
        return this.#destino;
    }

    get tamanho() {
        return this.#tamanho;
    }

    get altitude() {
        return this.#altitude;
    }

    toString() {
        return `Id: ${this.id}. Rota: ${this.rota}. Origem: ${this.origem}. Destino: ${this.destino}. Tamanho: ${this.tamanho}. Altitude: ${this.altitude}.`;
    }
}
