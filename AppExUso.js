import { Sistema } from './Sistema.js';
import promptSync from 'prompt-sync';

const prompt = promptSync();
const sistema = new Sistema();

function main() {
    while (true) {
        console.log("\nMenu:");
        console.log("1. Listar aeronaves por tipo");
        console.log("2. Listar dados de um piloto");
        console.log("3. Listar todos os pilotos");
        console.log("4. Listar aerovias");
        console.log("5. Listar altitudes livres");
        console.log("6. Aprovar plano de voo");
        console.log("7. Listar plano de voo");
        console.log("8. Sair");

        const opcao = prompt('Escolha uma opção: ');

        try {
            switch (opcao) {
                case '1':
                    const tipoAeronave = prompt('Digite o tipo de aeronave: ').trim();
                    const aeronaves = sistema.listarAeronavesPorTipo(tipoAeronave);
                    if (aeronaves.length === 0) {
                        console.log('Nenhuma aeronave encontrada para o tipo informado.');
                    } else {
                        aeronaves.forEach(aeronave => console.log(aeronave.toString()));
                    }
                    break;
                case '2':
                    const matriculaPiloto = prompt('Digite a matrícula do piloto: ').toUpperCase();
                    const piloto = sistema.listarDadosPiloto(matriculaPiloto);
                    if (piloto) {
                        console.log(piloto.toString());
                    } else {
                        console.log('Piloto não encontrado.');
                    }
                    break;
                case '3':
                    const pilotos = sistema.listarTodosPilotos();
                    pilotos.forEach(piloto => console.log(piloto.toString()));
                    break;
                case '4':
                    const aerovias = sistema.listarAerovias();
                    aerovias.forEach(aerovia => console.log(aerovia.toString()));
                    break;
                case '5':
                    const idAerovia = prompt('Digite o id da Aerovia: ').toUpperCase();
                    const data = prompt('Digite a data do voo (DD-MM-YYYY): ');
                    const altitudesLivres = sistema.listarAltitudesLivres(idAerovia, data);
                    if (altitudesLivres.length === 0) {
                        console.log('Nenhuma altitude livre encontrada.');
                    } else {
                        altitudesLivres.forEach(altitude => console.log(`Altitude livre: ${altitude}`));
                    }
                    break;
                case '6':
                    const matricula = prompt('Digite a matrícula do piloto: ').toUpperCase();
                    const prefixo = prompt('Digite o prefixo da aeronave: ').toUpperCase();
                    const origemVoo = prompt('Digite a sigla do aeroporto de origem: ').toUpperCase();
                    const destinoVoo = prompt('Digite a sigla do aeroporto de destino: ').toUpperCase();
                    const dataVoo = prompt('Digite a data do voo (DD-MM-YYYY): ');
                    const horarioPartidaVoo = prompt('Digite o horário de início do voo (HH:MM): ');
                    const altitudeVoo = parseInt(prompt('Digite a altitude do voo: '));
                    const resultado = sistema.aprovarPlanoDeVoo(matricula, prefixo, origemVoo, destinoVoo, dataVoo, horarioPartidaVoo, altitudeVoo);
                    console.log(resultado);
                    break;
                case '7':
                    const idPlano = parseInt(prompt('Digite o número do plano de voo: '));
                    const plano = sistema.listarPlano(idPlano);
                    if (plano) {
                        console.log(plano.toString());
                    } else {
                        console.log('Plano de voo não encontrado.');
                    }
                    break;
                case '8':
                    console.log("Encerrando o sistema.");
                    return;
                default:
                    console.log("Opção inválida. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro:", error.message);
        }
    }
}

main();

