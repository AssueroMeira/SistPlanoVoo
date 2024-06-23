import { OcupacaoAerovia } from '../ClasseOcupacaoAerovia.js';
import fs from 'fs';
import { jest } from '@jest/globals';

// Mock do fs
jest.mock('fs', () => {
    return {
        readFileSync: jest.fn(),
        appendFileSync: jest.fn()
    };
});

describe('OcupacaoAerovia', () => {
    let readFileSyncMock;

    beforeAll(() => {
        readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockImplementation();
        jest.spyOn(fs, 'appendFileSync').mockImplementation();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const ocupacaoData = `id,rota,data,altitude,slotsOcupados
1,AAA-BBB,01-01-2024,30000,10;11
2,CCC-DDD,02-01-2024,31000,12;13
`;

    it('deve carregar ocupações do arquivo', () => {
        readFileSyncMock.mockReturnValue(ocupacaoData);

        const ocupacaoAerovia = new OcupacaoAerovia('ocupacao.csv');
        expect(ocupacaoAerovia.ocupacoes.length).toBe(2);
        expect(ocupacaoAerovia.ocupacoes[0]).toEqual({
            id: '1',
            rota: 'AAA-BBB',
            data: '01-01-2024',
            altitude: 30000,
            slotsOcupados: [10, 11]
        });
    });

    it('deve verificar se a rota está ocupada', () => {
        readFileSyncMock.mockReturnValue(ocupacaoData);

        const ocupacaoAerovia = new OcupacaoAerovia('ocupacao.csv');
        const isOcupado = ocupacaoAerovia.isOcupado('AAA', 'BBB', 'XYZ', '10:00', '01-01-2024', 30000);
        expect(isOcupado).toBe(true);
    });

    it('deve verificar se a rota está livre', () => {
        readFileSyncMock.mockReturnValue(ocupacaoData);

        const ocupacaoAerovia = new OcupacaoAerovia('ocupacao.csv');
        const isOcupado = ocupacaoAerovia.isOcupado('AAA', 'BBB', 'XYZ', '07:00', '01-01-2024', 30000);
        expect(isOcupado).toBe(false);
    });
});

