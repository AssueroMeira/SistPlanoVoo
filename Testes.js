import { ServicoAeronaves } from './ClasseServicoAeronaves.js';

// Criar instância do serviço de aeronaves e carregar dados do arquivo CSV
const servicoAeronaves = new ServicoAeronaves('aeronaves.csv');

// Listar todas as aeronaves
console.log("Lista de todas as aeronaves:");
servicoAeronaves.todos().forEach(aeronave => {
    console.log(aeronave.toString());
});

// Buscar aeronave específica pelo prefixo
const prefixoBusca = "RX-100";
const aeronaveEncontrada = servicoAeronaves.buscaPorPrefixo(prefixoBusca);

if (aeronaveEncontrada) {
    console.log(`Aeronave encontrada com prefixo ${prefixoBusca}:`);
    console.log(aeronaveEncontrada.toString());
} else {
    console.log(`Aeronave com prefixo ${prefixoBusca} não encontrada.`);
}
