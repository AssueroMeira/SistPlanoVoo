import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DateTime } from "luxon";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class OcupacaoAerovia {
    constructor(arquivoOcupacao) {
        this.arquivoOcupacao = arquivoOcupacao;
        this.ocupacoes = this.carregarOcupacoes();
    }

    carregarOcupacoes() {
        const ocupacoes = [];
        const dados = fs.readFileSync(
            path.resolve(__dirname, this.arquivoOcupacao),
            "utf8",
        );
        const linhas = dados.trim().split("\n");
        linhas.forEach((linha, index) => {
            if (index > 0) {
                const [id, rota, data, altitude, slotsOcupados] =
                    linha.split(",");
                ocupacoes.push({
                    id,
                    rota,
                    data,
                    altitude: parseInt(altitude),
                    slotsOcupados: slotsOcupados
                        .split(";")
                        .map((slot) => parseInt(slot)),
                });
            }
        });
        return ocupacoes;
    }

    isOcupado(origem, destino, prefixo, hora, data, altitude) {
        const rota = `${origem}-${destino}`;
        const slots = this.calculaSlots(prefixo, hora);
        const dataComparacao = DateTime.fromFormat(
            data,
            "dd-MM-yyyy",
        ).toISODate();

        for (const ocupacao of this.ocupacoes) {
            const dataOcupacao = DateTime.fromFormat(
                ocupacao.data,
                "dd-MM-yyyy",
            ).toISODate();
            if (
                ocupacao.rota === rota &&
                dataOcupacao === dataComparacao &&
                ocupacao.altitude === altitude
            ) {
                const slotsOcupados = ocupacao.slotsOcupados;
                if (slots.some((slot) => slotsOcupados.includes(slot))) {
                    return true;
                }
            }
        }
        return false;
    }

    ocupa(origem, destino, prefixo, data, hora, altitude) {
        const rota = `${origem}-${destino}`;
        const slots = this.calculaSlots(prefixo, hora);

        const aeroviasDados = fs.readFileSync(
            path.resolve(__dirname, "aerovias.csv"),
            "utf8",
        );
        const linhasAerovias = aeroviasDados.trim().split("\n");
        let id = null;

        for (const linha of linhasAerovias) {
            const [aeroviaId, aeroviaRota, , , , aeroviaAltitude] =
                linha.split(",");
            if (
                aeroviaRota === rota &&
                parseInt(aeroviaAltitude) === altitude
            ) {
                id = aeroviaId;
                break;
            }
        }

        if (id !== null) {
            const novaOcupacao = {
                id,
                rota,
                data,
                altitude,
                slotsOcupados: slots,
            };
            this.ocupacoes.push(novaOcupacao);

            const linhaOcupacao = `${id},${rota},${data},${altitude},${slots.join(";")}\n`;
            fs.appendFileSync(
                path.resolve(__dirname, this.arquivoOcupacao),
                linhaOcupacao,
            );
        }
    }

    calculaSlots(prefixo, horarioInicio) {
        const tempoViagem = 2; 
        const minutosTotais = tempoViagem * 60;
        const horarioInicial = DateTime.fromFormat(horarioInicio, "HH:mm");
        const slots = [];

        for (let i = 0; i <= Math.ceil(minutosTotais / 60); i++) {
            slots.push(horarioInicial.plus({ hours: i }).hour);
        }

        return slots;
    }

    listarAltitudesLivres(rota, data, slots) {
        const altitudesPossiveis = [
            25000, 26000, 27000, 28000, 29000, 30000, 31000, 32000, 33000,
            34000, 35000,
        ];
        const altitudesOcupadas = new Set();

        this.ocupacoes.forEach((ocupacao) => {
            const dataOcupacao = DateTime.fromFormat(
                ocupacao.data,
                "dd-MM-yyyy",
            ).toISODate();
            const dataComparacao = DateTime.fromFormat(
                data,
                "dd-MM-yyyy",
            ).toISODate();

            if (ocupacao.rota === rota && dataOcupacao === dataComparacao) {
                const slotsOcupados = ocupacao.slotsOcupados;
                const slotsEmComum = slots.some((slot) =>
                    slotsOcupados.includes(slot),
                );
                if (slotsEmComum) {
                    altitudesOcupadas.add(ocupacao.altitude);
                }
            }
        });

        const altitudesLivres = altitudesPossiveis.filter(
            (altitude) => !altitudesOcupadas.has(altitude),
        );
        return altitudesLivres;
    }
}

export { OcupacaoAerovia };
