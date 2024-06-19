import { DateTime } from 'luxon';
import nReadlines from 'n-readlines';

export class OcupacaoAerovia {
    constructor() {
        this.ocupacoes = new Map();
    }

    altitudesLivres(idAerovia, data) {
        this.carregarOcupacoes(idAerovia, data);
        return this.obterAltitudesLivres(idAerovia);
    }

    carregarOcupacoes(idAerovia, data) {
        let arq = new nReadlines("planos.csv");
        let buf;
        let dados;

        arq.next(); // Ignorar cabeçalho

        while (buf = arq.next()) {
            let line = buf.toString('utf8');
            dados = line.split(",");
            if (dados[3] === idAerovia && dados[4] === data && dados[8] === 'false') { // Plano não cancelado
                this.ocupacoes.set(idAerovia, true);
            }
        }
    }

    obterAltitudesLivres(idAerovia) {
        let arq = new nReadlines("aerovias.csv");
        let buf;
        let dados;
        let altitudesLivres = [];

        arq.next(); // Ignorar cabeçalho

        while (buf = arq.next()) {
            let line = buf.toString('utf8');
            dados = line.split(",");
            if (this.ocupacoes.has(dados[0])) {
                this.ocupacoes.set(idAerovia, dados[1]);                
            }
            
            if (!this.ocupacoes.get(idAerovia).has(dados[0]) && this.ocupacoes.get(dados)) {
                altitudesLivres.push(parseInt(dados[5]));
            }
        }

        return altitudesLivres;
    }
}
