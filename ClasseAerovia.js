import { validate } from "bycontract";

// Implementando a classe Aerovia, conforme diagrama de classes.
export class Aerovia {
    #id;
    #origem;
    #destino;
    #tamanho;
    #altitude;
    #codAerovia;

    // Implementando limites de altitudes.
    static altitudeMin = 25000;
    static altitudeMax = 35000;

    // Considera-se que os dados serão captados em um arquivo externo.
    // Construtor padroniza os dados.
    constructor(id, origem, destino, tamanho, altitude, codAerovia) {
        validate(arguments, ["string", "string", "string", "number", "number", "string"]);
        this.#id = id.trim().toUpperCase();
        this.#origem = origem.trim().toUpperCase();
        this.#destino = destino.trim().toUpperCase();
        if (isNaN(tamanho) || tamanho <= 0) {
            throw new Error(`Tamanho inválido: ${tamanho}.`);
        }
        this.#tamanho = tamanho;
        if (isNaN(altitude) || altitude < Aerovia.altitudeMin || altitude > Aerovia.altitudeMax) {
            throw new Error(`${altitude} pés está fora dos limites permitidos. As aerovias devem ter altitudes entre 25000 e 35000 pés.`);
        }
        this.#altitude = altitude;
        this.#codAerovia = codAerovia.trim().toUpperCase();
    }

    get id() {
        return this.#id;
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

    get codAerovia() {
        return this.#codAerovia;
    }

    toString() {
        return `Id: ${this.id}. Origem: ${this.origem}. Destino: ${this.destino}. Tamanho: ${this.tamanho}. Altitude: ${this.altitude}. Código Aerovia: ${this.codAerovia}`;
    }
}
