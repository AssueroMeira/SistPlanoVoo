import { ServicoAeronaves } from '../ClasseServicoAeronaves.js';
import { AeronaveParticular, AeronavePassageiros, AeronaveCarga } from '../ClasseAeronave.js';
import { jest } from '@jest/globals';

jest.mock('n-readlines', () => {
    return jest.fn().mockImplementation(() => {
        const lines = [
            Buffer.from("RX-100,PARTICULAR,350,1000,Air Manuntencao SA,LOL,,\n"),
            Buffer.from("RX-101,COMERCIAL PASSAGEIROS,850,5000,,LATEM,180,\n"),
            Buffer.from("RX-102,COMERCIAL CARGA,750,6000,,VERMELHA,,50\n"),
            Buffer.from("RX-103,PARTICULAR,400,1500,Blue Manutencao SA,LOL,,\n"),
            Buffer.from("RX-104,COMERCIAL PASSAGEIROS,800,7000,,LATEM,200,\n"),
            Buffer.from("RX-105,COMERCIAL CARGA,800,8000,,VERMELHA,,100\n"),
            Buffer.from("RX-106,PARTICULAR,350,2000,Blue Manutencao SA,LOL,,\n"),
            Buffer.from("RX-107,COMERCIAL PASSAGEIROS,875,5000,,LATEM,250,\n"),
            Buffer.from("RX-108,COMERCIAL CARGA,725,7500,,VERMELHA,,90\n"),
            Buffer.from("RX-109,PARTICULAR,360,1500,Blue Manutencao SA,LOL,,\n"),
            Buffer.from("RX-110,COMERCIAL PASSAGEIROS,900,6500,,LATEM,150,\n"),
            Buffer.from("RX-111,COMERCIAL CARGA,850,7800,,VERMELHA,,120\n"),
            Buffer.from("RX-112,PARTICULAR,380,1200,Air Manuntencao SA,LOL,,\n"),
            Buffer.from("RX-113,COMERCIAL PASSAGEIROS,800,8200,,LATEM,120,\n"),
            Buffer.from("RX-114,COMERCIAL CARGA,790,7000,,VERMELHA,,80\n"),
            Buffer.from("RX-115,PARTICULAR,420,1900,Air Manuntencao SA,LOL,,\n"),
            Buffer.from("RX-116,COMERCIAL PASSAGEIROS,825,5900,,LATEM,200,\n"),
            Buffer.from("RX-117,COMERCIAL CARGA,700,6000,,VERMELHA,,190\n")
        ];
        let index = 0;

        return {
            next: jest.fn(() => {
                if (index < lines.length) {
                    return lines[index++];
                } else {
                    return null;
                }
            }),
            reset: jest.fn(() => {
                index = 0;
            })
        };
    });
});

describe('ServicoAeronaves', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve listar todas as aeronaves de um determinado tipo', () => {
        const servicoAeronaves = new ServicoAeronaves('aeronaves.csv');
        const particulares = servicoAeronaves.todos().filter(aeronave => aeronave.tipo === 'PARTICULAR');
        console.log('Aeronaves do tipo PARTICULAR:', particulares);

        expect(particulares.length).toBe(6); // Ajuste conforme o número real de aeronaves particulares
        particulares.forEach(aeronave => {
            expect(aeronave).toBeInstanceOf(AeronaveParticular);
        });
    });

    it('deve retornar todas as aeronaves do arquivo CSV', () => {
        const servicoAeronaves = new ServicoAeronaves('aeronaves.csv');
        const aeronaves = servicoAeronaves.todos();
        console.log('Todas as aeronaves recuperadas:', aeronaves);

        expect(aeronaves.length).toBe(18);  // Ajuste conforme o número real de aeronaves no arquivo CSV
    });

    it('deve encontrar uma aeronave pelo prefixo', () => {
        const servicoAeronaves = new ServicoAeronaves('aeronaves.csv');
        const aeronave = servicoAeronaves.buscaPorPrefixo('RX-100');
        console.log('Aeronave encontrada:', aeronave);

        expect(aeronave).toBeDefined();
        expect(aeronave).toBeInstanceOf(AeronaveParticular);
        expect(aeronave.prefixo).toBe('RX-100');
    });
});
