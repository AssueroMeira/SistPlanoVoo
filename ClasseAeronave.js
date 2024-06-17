import { validate } from "bycontract";

export class Aeronave {
    #prefixo;
    #velocidadeCruzeiro;
    #autonomia;
    static velocidadeCruzeiroMin = 185;
    static velocidadeCruzeiroMax = 1040;

    constructor(prefixo, velocidadeCruzeiro, autonomia) {
        validate(arguments, ["string", "number", "number"]);
        this.#prefixo = prefixo.trim().toUpperCase();
        if (velocidadeCruzeiro < Aeronave.velocidadeCruzeiroMin || velocidadeCruzeiro > Aeronave.velocidadeCruzeiroMax) {
            throw new Error(`Velocidade inválida: ${velocidadeCruzeiro}. A velocidade indicada está fora dos limites já registrados. Por favor, verifique se há algum erro.`)
        }
        this.#velocidadeCruzeiro = velocidadeCruzeiro;
        if (autonomia <= 0) {
            throw new Error(`Autonomia inválida: ${autonomia}.`)
        }
        this.#autonomia = autonomia;
    }

    get prefixo() {
        return this.#prefixo;
    }

    get velocidadeCruzeiro() {
        return this.#velocidadeCruzeiro;
    }

    get autonomia() {
        return this.#autonomia;
    }

    toString() {
        return `Prefixo: ${this.prefixo}. Velocidade de cruzeiro: ${this.velocidadeCruzeiro}. Autonomia: ${this.autonomia}.`;
    }
}

export class AeronaveParticular extends Aeronave {
    #respmanutencao;

    constructor(prefixo, velocidadeCruzeiro, autonomia, respmanutencao) {
        validate(arguments, ["string", "number", "number", "string"]);
        super(prefixo, velocidadeCruzeiro, autonomia);
        this.#respmanutencao = respmanutencao.trim().toUpperCase();
    }

    get respmanutencao() {
        return this.#respmanutencao;
    }

    toString() {
        return super.toString() + ` Empresa responsável pela manutenção: ${this.respmanutencao}.`;
    }
}

export class AeronaveComercial extends Aeronave {
    #nomeCIA;

    constructor(prefixo, velocidadeCruzeiro, autonomia, nomeCIA) {
        validate(arguments, ["string", "number", "number", "string"]);
        super(prefixo, velocidadeCruzeiro, autonomia);
        this.#nomeCIA = nomeCIA.trim().toUpperCase();
    }

    get nomeCIA() {
        return this.#nomeCIA;
    }

    toString() {
        return super.toString() + ` Nome da companhia: ${this.nomeCIA}.`;
    }
}

export class AeronavePassageiros extends AeronaveComercial {
    #maxPassageiros;

    constructor(prefixo, velocidadeCruzeiro, autonomia, nomeCIA, maxPassageiros) {
        validate(arguments, ["string", "number", "number", "string", "number"]);
        super(prefixo, velocidadeCruzeiro, autonomia, nomeCIA);
        if (maxPassageiros <= 0) {
            throw new Error(`Valor (capacidade máxima de passageiros) inválido: ${maxPassageiros}.`)
        }
        this.#maxPassageiros = maxPassageiros;
    }

    get maxPassageiros() {
        return this.#maxPassageiros;
    }

    toString() {
        return super.toString() + ` Quantidade máxima de passageiros: ${this.maxPassageiros}.`;
    }
}

export class AeronaveCarga extends AeronaveComercial {
    #pesoMax;

    constructor(prefixo, velocidadeCruzeiro, autonomia, nomeCIA, pesoMax) {
        validate(arguments, ["string", "number", "number", "string", "number"]);
        super(prefixo, velocidadeCruzeiro, autonomia, nomeCIA);
        if (pesoMax <= 0) {
            throw new Error(`Peso inválido: ${pesoMax}.`)
        }
        this.#pesoMax = pesoMax;
    }

    get pesoMax() {
        return this.#pesoMax;
    }

    toString() {
        return super.toString() + ` Peso máximo de carga: ${this.pesoMax}.`;
    }
}
