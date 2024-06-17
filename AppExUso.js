import { Sistema } from './Sistema.js';
import promptSync from 'prompt-sync';

const prompt = promptSync();
const sistema = new Sistema();

function main() {
    while (true) {
        console.log("\nMenu:");
        console.log("1. Listar aerovias entre aeroportos");
        console.log("2. Listar altitudes livres em uma aerovia");
        console.log("3. Submeter um plano de voo para aprovação");
        console.log("4. Listar um plano a partir do número");
        console.log("5. Listar siglas dos aeroportos");
        console.log("6. Sair");

        const opcao = prompt('Escolha uma opção: ');

        try {
            switch (opcao) {
                case '1':
                    const origem = prompt('Digite a sigla do aeroporto de origem: ').toUpperCase();
                    const destino = prompt('Digite a sigla do aeroporto de destino: ').toUpperCase();
                    const aerovias = sistema.listarAerovias(origem, destino);
                    if (aerovias.length === 0) {
                        console.log('Nenhuma aerovia encontrada entre os aeroportos informados.');
                    } else {
                        aerovias.forEach(aerovia => console.log(aerovia.toString()));
                    }
                    break;
                case '2':
                    const idAerovia = prompt('Digite o identificador da aerovia: ').toUpperCase();
                    const tipoAeronave = prompt('Digite o tipo da aeronave (Particular, Comercial Passageiros, Comercial Carga): ');
                    const horarioInicio = prompt('Digite o horário de início (HH:MM): ');
                    const horarioFim = prompt('Digite o horário de fim (HH:MM): ');
                    const altitudesLivres = sistema.listarAltitudesLivres(idAerovia, tipoAeronave, horarioInicio, horarioFim);
                    if (altitudesLivres.length === 0) {
                        console.log('Nenhuma altitude livre encontrada.');
                    } else {
                        altitudesLivres.forEach(altitude => console.log(`Altitude livre: ${altitude}`));
                    }
                    break;
                case '3':
                    const matriculaPiloto = prompt('Digite a matrícula do piloto: ').toUpperCase();
                    const prefixoAeronave = prompt('Digite o prefixo da aeronave: ').toUpperCase();
                    const origemPlano = prompt('Digite a sigla do aeroporto de origem: ').toUpperCase();
                    const destinoPlano = prompt('Digite a sigla do aeroporto de destino: ').toUpperCase();
                    const dataPlano = prompt('Digite a data do voo (DD-MM-YYYY): ');
                    const [dayPlano, monthPlano, yearPlano] = dataPlano.split('-');
                    const data = `${yearPlano}-${monthPlano}-${dayPlano}`;
                    const horarioPartida = prompt('Digite o horário de início do voo (HH:MM): ');
                    const horarioChegada = prompt('Digite o horário de fim do voo (HH:MM): ');
                    const altitude = parseInt(prompt('Digite a altitude do voo: '));
                    try {
                        const idPlano = sistema.submeterPlanoDeVoo(matriculaPiloto, prefixoAeronave, origemPlano, destinoPlano, data, horarioPartida, horarioChegada, altitude);
                        console.log(`Plano de voo submetido com sucesso. Número do plano: ${idPlano}`);
                    } catch (erro) {
                        console.error(`Erro ao submeter o plano de voo: ${erro.message}`);
                    }
                    break;
                case '4':
                    const idPlano = parseInt(prompt('Digite o número do plano de voo: '));
                    try {
                        const plano = sistema.listarPlano(idPlano);
                        console.log(plano.toString());
                    } catch (erro) {
                        console.error(`Erro ao listar o plano de voo: ${erro.message}`);
                    }
                    break;
                case '5':
                    const siglasAeroportos = sistema.listarSiglasAeroportos();
                    console.log('Siglas dos aeroportos disponíveis:');
                    console.log(siglasAeroportos.join(', '));
                    break;
                case '6':
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




