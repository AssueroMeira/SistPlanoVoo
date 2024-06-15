// Este módulo deverá ser testado com a execução do módulo AppExUso.js
import { validate } from "bycontract";
import nReadlines from "n-readlines";

// Todas as classes e subclasses foram implementadas para serem importadas por outros módulos.
// Implementando a classe Piloto, conforme diagrama de classes.
export class Piloto {
    #matricula;
    #nome;
    #habilitacaoAtiva;
    // Considera-se que os dados serão captados em um arquivo externo.
    // Construtor padroniza os dados.
    constructor (matricula, nome, habilitacaoAtiva) {
        validate(arguments, ["string", "string", "string"]); 
        this.#matricula = matricula.trim().toUpperCase();
        this.#nome = nome.trim().toUpperCase();
        const habilitacao = habilitacaoAtiva.trim().toLowerCase();
        if (habilitacao === "ativo") {
            this.#habilitacaoAtiva = true;
        } else if (habilitacao === "inativo") {
            this.#habilitacaoAtiva = false;
        } else {
            throw new Error ("Estado de habilitação inválido");
        }
    }

    get matricula() {
        return this.#matricula;
    }

    get nome() {
        return this.#nome;
    }

    get habilitacaoAtiva() {
        return this.#habilitacaoAtiva;
    }

    toString() {
        return `Matrícula: ${this.matricula}. Nome: ${this.nome}. Habilitação: ${this.habilitacaoAtiva ? 'Ativo' : 'Inativo'}`;
    }
}

// Implementando a classe Aerovia, conforme diagrama de classes.
export class Aerovia {
    #id;
    #origem;
    #destino;
    #tamanho;
    #altitude;
    // Implementando limites de altitudes.
    static altitudeMin = 25000;
    static altitudeMax = 35000;
    // Considera-se que os dados serão captados em um arquivo externo.
    // Construtor padroniza os dados.
    constructor (id, origem, destino, tamanho, altitude) {
        validate(arguments, ["string", "string", "string", "number", "number"]);
        this.#id = id.trim().toUpperCase();
        this.#origem = origem.trim().toUpperCase();
        this.#destino = destino.trim().toUpperCase();
        if (tamanho <= 0) {
            throw new Error (`Tamanho inválido: ${tamanho}.`)
        }
        this.#tamanho = tamanho;
        if (altitude <= Aerovia.altitudeMin || altitude >= Aerovia.altitudeMax) {
            throw new Error (`${altitude} pés está fora dos limites permitidos. As aerovias devem ter altitudes entre 25000 e 35000 pés.`)
        }
        this.#altitude = altitude;
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

    toString() {
        return `Id: ${this.id}. Origem: ${this.origem}. Destino: ${this.destino}. Tamanho: ${this.tamanho}. Altitude: ${this.altitude}`;
    }
}

// Classe Aeronave e subclasses, implementadas conforme diagrama de classes.
export class Aeronave {
    #prefixo;
    #velocidadeCruzeiro;
    #autonomia;
    // Implementando limites de velocidade de cruzeiro
    static velocidadeCruzeiroMin = 185;
    static velocidadeCruzeiroMax = 1040;
    // Considera-se que os dados serão captados em um arquivo externo.
    // Construtor padroniza os dados.
    constructor (prefixo, velocidadeCruzeiro, autonomia) {
        validate(arguments, ["string", "number", "number"]);
        this.#prefixo = prefixo.trim().toUpperCase();
        if (velocidadeCruzeiro <= Aeronave.velocidadeCruzeiroMin || velocidadeCruzeiro >= Aeronave.velocidadeCruzeiroMax) {
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

// Implementando uma hierarquia de classe (classe filha).
export class AeronaveParticular extends Aeronave {
    #respmanutencao;

    constructor(prefixo, velocidadeCruzeiro, autonomia, respmanutencao) {
        validate(arguments, ["string", "number", "number", "string"]);
        super(prefixo, velocidadeCruzeiro, autonomia); // herdando os atributos da classe Aeronave.
        this.#respmanutencao = respmanutencao.trim().toUpperCase();
    }

    get respmanutencao() {
        return this.#respmanutencao;
    }

    // Usando o pilar polimorfismo para sobrescrever o método toString da classe Aeronave.
    toString() {
        return super.toString() + ` Empresa responsável pela manutenção: ${this.respmanutencao}.`;
    }
}

// Implementando uma hierarquia de classe (classe filha).
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

    // Sobrescrita da classe toString da classe Aeronave.
    toString() {
        return super.toString() + ` Nome da companhia: ${this.nomeCIA}.`;
    }
}

// Implementando uma hierarquia de classe (classe filha).
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

    // Sobrescrita do método toString da classe AeronaveComercial.
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

    // Sobrescrita do método toString da classe AeronaveComercial.
    toString() {
        return super.toString() + ` Peso máximo de carga: ${this.pesoMax}.`;
    }
}

// Implementação da classe ServicoPilotos
// Esta classe criará um Array dos dados do arquivo .csv.
export class ServicoPilotos {
    #pilotos;

    constructor(narq = "pilotos.csv") {
        validate(narq, "string");
        this.#pilotos = [];
        this.recupera(narq);
    }

    // método para recuperar os dados do arquivo
    recupera(narq) {
        validate(narq, "string");
        let arq = new nReadlines(narq);
        let buf;
        let dados;
        
        // Pula a primeira linha
        arq.next();
        
        // Enquanto houverem linhas (leitura síncrona)
        while (buf = arq.next()) {
            let line = buf.toString('utf8');
            dados = line.split(",");
            if (dados.length === 3) {
                this.#pilotos.push(new Piloto(dados[0], dados[1], dados[2]));
            } else {
                console.error("Formato de linha inválido em pilotos.csv:", line);
            }
        }
    }

    // Método para retornar os dados do arquivo.
    todos() {
        return this.#pilotos;
    }
}

// Implementando a classe ServicoAerovias
export class ServicoAerovias {
    #aerovias;

    constructor(narq = "aerovias.csv") {
        validate(narq, "string");
        this.#aerovias = [];
        this.recupera(narq);
    }

    // Cria um Array com os dados do arquivo .csv.
    recupera(narq) {
        validate(narq, "string");
        let arq = new nReadlines(narq);
        let buf;
        let dados;
        
        // Pula a primeira linha
        arq.next();
        
        // Enquanto houverem linhas (leitura síncrona)
        while (buf = arq.next()) {
            let line = buf.toString('utf8');
            dados = line.split(",");
            if (dados.length === 5) {
                this.#aerovias.push(new Aerovia(dados[0], dados[1], dados[2], parseInt(dados[3]), parseInt(dados[4])));
            } else {
                console.error("Formato de linha inválido em aerovias.csv:", line);
            }
        }
    }

    // Retorna os dados do Array.
    todos() {
        return this.#aerovias;
    }
}

// Implementando a classe ServicoAeronaves
export class ServicoAeronaves {
    #aeronaves;

    constructor(narq = "aeronaves.csv") {
        validate(narq, "string");
        this.#aeronaves = [];
        this.recupera(narq);
    }

    // Cria um Array a partir do arquivo .csv.
    recupera(narq) {
        validate(narq, "string");
        let arq = new nReadlines(narq);
        let buf;
        let dados;

        // Pula a primeira linha
        arq.next();

        // Enquanto houverem linhas (leitura síncrona)
        while (buf = arq.next()) {
            let line = buf.toString('utf8');
            dados = line.split(",");
            if (dados.length >= 5) {
                switch (dados[1].trim()) {
                    case 'Particular':
                        if (dados.length >= 5) {
                            this.#aeronaves.push(new AeronaveParticular(dados[0], parseInt(dados[2]), parseInt(dados[3]), dados[4]));
                        } else {
                            console.error("Formato de linha inválido para Aeronave Particular em aeronaves.csv:", line);
                        }
                        break;
                    case 'Comercial Passageiros':
                        if (dados.length >= 7) {
                            this.#aeronaves.push(new AeronavePassageiros(dados[0], parseInt(dados[2]), parseInt(dados[3]), dados[5], parseInt(dados[6])));
                        } else {
                            console.error("Formato de linha inválido para Aeronave Comercial Passageiros em aeronaves.csv:", line);
                        }
                        break;
                    case 'Comercial Carga':
                        if (dados.length >= 8) {
                            this.#aeronaves.push(new AeronaveCarga(dados[0], parseInt(dados[2]), parseInt(dados[3]), dados[5], parseInt(dados[7])));
                        } else {
                            console.error("Formato de linha inválido para Aeronave Comercial Carga em aeronaves.csv:", line);
                        }
                        break;
                    default:
                        console.error("Tipo de aeronave desconhecido em aeronaves.csv:", line);
                }
            } else {
                console.error("Formato de linha inválido em aeronaves.csv:", line);
            }
        }
    }

    // Retorna os dados do Array.
    todos() {
        return this.#aeronaves;
    }
}

