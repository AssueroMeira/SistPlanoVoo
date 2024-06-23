import { ServicoAerovias } from '../ClasseServicoAerovias.js';
import { Aerovia } from '../ClasseAerovia.js';
import fs from 'fs';
import { jest } from '@jest/globals';

// Mock do fs
jest.mock('fs', () => {
    return {
        readFileSync: jest.fn()
    };
});

describe('ServicoAerovias', () => {
    let readFileSyncMock;

    beforeAll(() => {
        readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockImplementation();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const aeroviasData = `Id,rota,origem,destino,tamanho,altitude
A1,CGH-SDU,CGH,SDU,378,25000
A2,CGH-SDU,CGH,SDU,378,26000
A3,CGH-SDU,CGH,SDU,378,27000
A4,CGH-SDU,CGH,SDU,378,28000
A5,CGH-SDU,CGH,SDU,378,29000`;

    it('deve recuperar todas as aerovias do arquivo CSV', () => {
        readFileSyncMock.mockReturnValue(aeroviasData);

        const servicoAerovias = new ServicoAerovias('aerovias.csv');
        const aerovias = servicoAerovias.todos();

        expect(aerovias.length).toBe(5);
        expect(aerovias[0]).toBeInstanceOf(Aerovia);
        expect(aerovias[0].id).toBe('A1');
        expect(aerovias[0].origem).toBe('CGH');
        expect(aerovias[0].destino).toBe('SDU');
        expect(aerovias[0].tamanho).toBe(378);
        expect(aerovias[0].altitude).toBe(25000);
    });

    it('deve buscar aerovia por ID', () => {
        readFileSyncMock.mockReturnValue(aeroviasData);

        const servicoAerovias = new ServicoAerovias('aerovias.csv');
        const aerovia = servicoAerovias.buscarPorId('A2');

        expect(aerovia).toBeInstanceOf(Aerovia);
        expect(aerovia.id).toBe('A2');
        expect(aerovia.origem).toBe('CGH');
        expect(aerovia.destino).toBe('SDU');
        expect(aerovia.tamanho).toBe(378);
        expect(aerovia.altitude).toBe(26000);
    });
});
