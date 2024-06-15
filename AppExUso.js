// Módulo para testar o uso do módulo Classes.js.
import { ServicoPilotos, ServicoAeronaves, ServicoAerovias } from './Classes.js';
import promptSync from 'prompt-sync';

const prompt = promptSync(); // instanciando o promptSync()

// A função abaixo inicia instanciando as Classes Servico, buscando os dados dos arquivos .csv.
function main() {
    const servicoPilotos = new ServicoPilotos('pilotos.csv');
    const servicoAeronaves = new ServicoAeronaves('aeronaves.csv');
    const servicoAerovias = new ServicoAerovias('aerovias.csv');

    // Gera interação com o usuário.
    while (true) {
        console.log("\nMenu:");
        console.log("1. Recuperar informações sobre pilotos ativos");
        console.log("2. Pesquisar piloto pela matrícula");
        console.log("3. Recuperar informações sobre aeronaves");
        console.log("4. Recuperar informações sobre aerovias");
        console.log("5. Sair");
        
        const opcao = prompt('Escolha uma opção: ');

        // trabalhando as execeções com o "try"
        try {
            switch (opcao) {
                case '1':
                    const pilotosAtivos = servicoPilotos.todos().filter(piloto => piloto.habilitacaoAtiva);
                    pilotosAtivos.forEach(piloto => console.log(piloto.toString()));
                    break;
                case '2':
                    const matricula = prompt('Digite a matrícula do piloto: ');
                    const piloto = servicoPilotos.todos().find(piloto => piloto.matricula === matricula);
                    if (piloto) {
                        console.log(piloto.toString());
                    } else {
                        console.log("Piloto não encontrado.");
                    }
                    break;
                case '3':
                    const aeronaves = servicoAeronaves.todos();
                    aeronaves.forEach(aeronave => console.log(aeronave.toString()));
                    break;
                case '4':
                    const aerovias = servicoAerovias.todos();
                    aerovias.forEach(aerovia => console.log(aerovia.toString()));
                    break;
                case '5':
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
