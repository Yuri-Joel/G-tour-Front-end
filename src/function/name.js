export const  extrairPrimeiroUltimoNome = (nomeCompleto)=> {
    // Dividir o nome completo em partes separadas por espaços
    const partesNome = nomeCompleto.split(' ');

    // Obter o primeiro nome (sempre será a primeira parte)
    const primeiroNome = partesNome[0];

    // Se houver apenas um nome, retornar apenas esse nome
    if (partesNome.length === 1) {
        return   primeiroNome 
    }

    let ultimoSobrenome = partesNome.pop();

    // Verificar se a penúltima parte é uma preposição
    const preposicoes = ['dos', 'das', 'de', 'da'];
    const penultimaParteMinuscula = partesNome[partesNome.length - 1].toLowerCase();
    if (preposicoes.includes(penultimaParteMinuscula)) {
        // Se for uma preposição, definir a preposição e ajustar o último sobrenome
        const preposicao = partesNome.pop();
      
        return `${primeiroNome} ${preposicao} ${ultimoSobrenome}`;
    }

    // Se não houver preposição, retornar null para preposição e o último sobrenome como está
    partesNome.push(ultimoSobrenome);
    return `${primeiroNome} ${ultimoSobrenome}`;

   
}


