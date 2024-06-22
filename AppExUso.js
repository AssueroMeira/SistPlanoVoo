import { Sistema } from "./Sistema.js";
import promptSync from "prompt-sync";

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
        console.log("8. Cancelar plano de voo");
        console.log("9. Sair");

        const opcao = prompt("Escolha uma opção: ");

        try {
            switch (opcao) {
                case "1":
                    const tipoAeronave = prompt(
                        "Digite o tipo de aeronave: ",
                    ).trim();
                    const aeronaves =
                        sistema.listarAeronavesPorTipo(tipoAeronave);
                    if (aeronaves.length === 0) {
                        console.log(
                            "Nenhuma aeronave encontrada para o tipo informado.",
                        );
                    } else {
                        aeronaves.forEach((aeronave) =>
                            console.log(aeronave.toString()),
                        );
                    }
                    break;
                case "2":
                    const matriculaPiloto = prompt(
                        "Digite a matrícula do piloto: ",
                    ).toUpperCase();
                    const piloto = sistema.listarDadosPiloto(matriculaPiloto);
                    if (piloto) {
                        console.log(piloto.toString());
                    } else {
                        console.log("Piloto não encontrado.");
                    }
                    break;
                case "3":
                    const pilotos = sistema.listarTodosPilotos();
                    pilotos.forEach((piloto) => console.log(piloto.toString()));
                    break;
                case "4":
                    const aerovias = sistema.listarAerovias();
                    aerovias.forEach((aerovia) =>
                        console.log(aerovia.toString()),
                    );
                    break;
                case "5":
                    const origem = prompt(
                        "Digite a origem do voo: ",
                    ).toUpperCase();
                    const destino = prompt(
                        "Digite o destino do voo: ",
                    ).toUpperCase();
                    const prefixoAeronave = prompt(
                        "Digite o prefixo da aeronave: ",
                    ).toUpperCase();
                    const data = prompt("Digite a data do voo (DD-MM-YYYY): ");
                    const hora = prompt("Digite a hora do voo (HH:MM): ");
                    const altitudesLivres = sistema.listarAltitudesLivres(
                        origem,
                        destino,
                        prefixoAeronave,
                        data,
                        hora,
                    );
                    if (altitudesLivres.length === 0) {
                        console.log("Nenhuma altitude livre encontrada.");
                    } else {
                        altitudesLivres.forEach((altitude) =>
                            console.log(`Altitude livre: ${altitude}`),
                        );
                    }
                    break;
                case "6":
                    const matricula = prompt(
                        "Digite a matrícula do piloto: ",
                    ).toUpperCase();
                    const prefixo = prompt(
                        "Digite o prefixo da aeronave: ",
                    ).toUpperCase();
                    const origemVoo = prompt(
                        "Digite a sigla do aeroporto de origem: ",
                    ).toUpperCase();
                    const destinoVoo = prompt(
                        "Digite a sigla do aeroporto de destino: ",
                    ).toUpperCase();
                    const dataVoo = prompt(
                        "Digite a data do voo (DD-MM-YYYY): ",
                    );
                    const horarioPartidaVoo = prompt(
                        "Digite o horário de início do voo (HH:MM): ",
                    );
                    const altitudeVoo = parseInt(
                        prompt("Digite a altitude do voo: "),
                    );
                    try {
                        const idPlano = sistema.aprovarPlanoDeVoo(
                            matricula,
                            prefixo,
                            origemVoo,
                            destinoVoo,
                            dataVoo,
                            horarioPartidaVoo,
                            altitudeVoo,
                        );
                        console.log(`Plano de voo aprovado com ID: ${idPlano}`);
                    } catch (error) {
                        console.error(
                            "Erro ao aprovar plano de voo:",
                            error.message,
                        );
                    }
                    break;
                case "7":
                    const idPlanoParaListar = parseInt(
                        prompt("Digite o número do plano de voo: "),
                    );
                    try {
                        sistema.listarPlano(idPlanoParaListar);
                    } catch (error) {
                        console.error(
                            "Erro ao listar plano de voo:",
                            error.message,
                        );
                    }
                    break;
                case "8":
                    const idPlanoParaCancelar = parseInt(
                        prompt(
                            "Digite o número do plano de voo que deseja cancelar: ",
                        ),
                    );
                    try {
                        sistema.cancelaPlano(idPlanoParaCancelar);
                        console.log(
                            `Plano de voo com ID ${idPlanoParaCancelar} foi cancelado.`,
                        );
                    } catch (error) {
                        console.error(
                            "Erro ao cancelar plano de voo:",
                            error.message,
                        );
                    }
                    break;
                case "9":
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
