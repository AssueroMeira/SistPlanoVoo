import { ServicoPilotos } from '../ClasseServicoPilotos.js';
import { Piloto } from '../ClassePiloto.js';
import { jest } from '@jest/globals';

jest.mock('n-readlines', () => {
    return jest.fn().mockImplementation(() => {
        const lines = [
            Buffer.from("matricula,nome,status_da_habilitacao\n"),
            Buffer.from("3036,Juliana Costa,ativo\n"),
            Buffer.from("7047,Ricardo Alves,inativo\n"),
            Buffer.from("1489,Ricardo Pereira,ativo\n"),
            Buffer.from("2629,Kaleb Ferreira,inativo\n"),
            Buffer.from("4144,Patrícia Mendes,ativo\n"),
            Buffer.from("3744,Carlos Pereira,inativo\n"),
            Buffer.from("6832,João Silva,ativo\n"),
            Buffer.from("4327,Paula Mendes,inativo\n"),
            Buffer.from("2652,Paloma Costa,ativo\n"),
            Buffer.from("7841,Ana Souza,inativo\n"),
            Buffer.from("9998,Carla Mendes,ativo\n"),
            Buffer.from("3864,Italo Lima,inativo\n"),
            Buffer.from("4881,Cláudia Lima,ativo\n"),
            Buffer.from("6460,Marcos Ferreira,inativo\n"),
            Buffer.from("5782,Fernanda Ribeiro,ativo\n"),
            Buffer.from("6664,Joana Lima,inativo\n"),
            Buffer.from("9109,Marcio Oliveira,ativo\n"),
            Buffer.from("7116,Ana Souza,inativo\n"),
            Buffer.from("9043,Carlos Pereira,ativo\n"),
            Buffer.from("1122,Maria Oliveira,inativo\n"),
            Buffer.from("5660,Zariff Silva,ativo\n"),
            Buffer.from("7094,Ana Souza,inativo\n"),
            Buffer.from("2661,Pedro Lima,ativo\n"),
            Buffer.from("8741,Ricardo Alves,inativo\n"),
            Buffer.from("6291,Marcos Ferreira,ativo\n"),
            Buffer.from("9989,Moana Ribeiro,inativo\n"),
            Buffer.from("9709,José Ribeiro,ativo\n"),
            Buffer.from("1621,Djacir Pereira,inativo\n"),
            Buffer.from("7365,Silvia Costa,ativo\n"),
            Buffer.from("8724,João Silva,inativo\n"),
        ];
        return {
            next: jest.fn().mockImplementation(() => {
                if (lines.length > 0) {
                    return lines.shift();
                } else {
                    return null;
                }
            }),
        };
    });
});

describe('ServicoPilotos', () => {
    let servicoPilotos;

    beforeEach(() => {
        servicoPilotos = new ServicoPilotos('pilotos.csv');
    });

    it('deve listar todos os pilotos', () => {
        const pilotos = servicoPilotos.todos();
        expect(pilotos.length).toBe(30);
        expect(pilotos[0]).toBeInstanceOf(Piloto);
        expect(pilotos[0].matricula).toBe('3036');
        expect(pilotos[0].nome).toBe('JULIANA COSTA');
        expect(pilotos[0].habilitacaoAtiva).toBe(true);
    });

    it('deve buscar piloto por matrícula', () => {
        const matricula = '3036';
        const piloto = servicoPilotos.buscaPorMatricula(matricula);
        expect(piloto).toBeInstanceOf(Piloto);
        expect(piloto.matricula).toBe(matricula);
        expect(piloto.nome).toBe('JULIANA COSTA');
        expect(piloto.habilitacaoAtiva).toBe(true);
    });

    it('deve lançar um erro quando a matrícula não for encontrada', () => {
        const matriculaInvalida = '0000';
        expect(() => servicoPilotos.buscaPorMatricula(matriculaInvalida)).toThrow(`Matrícula não encontrada: ${matriculaInvalida}`);
    });
});
