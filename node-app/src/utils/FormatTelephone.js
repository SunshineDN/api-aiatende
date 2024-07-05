const FormatTelephone = (numero) => {
  let string = '';

  // Verificar se o número é um número
  if (typeof numero === 'number') {
    string = numero.toString();
  } else {
    string = numero;
  }

  let newNumber = '';
  let ddd = '';

  // Remover caracteres especiais e espaços
  string = string.replace(/[^0-9]/g, '');

  //Caso o numero inicie com o 55, remover o 55
  // if (string.slice(0,2) === "55") {
  //   string = string.substring(2);
  // } else if (string.slice(0,3) === "+55") {
  //   string = string.substring(3);
  // } else if (string.slice(0,2) === "9.") { // Caso o número inicie com 9. remover o 9.
  //   string = string.substring(2);
  // } else if (string.slice(2,3) === " ") { // Caso tenha 2 digitos e apos um espaço, remover o espaço
  //   string = string.substring(3);
  // }
  if (string.slice(0,2) === '55') {
    string = string.substring(2);
  }
  
  // Verificar se o número tem 11, 9 ou 8 dígitos
  if (string.length === 11) {
    ddd = string.slice(0,2);
    newNumber = string.substring(3);
    // console.log("Número com 11 dígitos \n")

  } else if (string.length === 10) {
    ddd = string.slice(0,2);
    newNumber = string.substring(2);
    // console.log("Número com 10 dígitos \n")

  }else if (string.length === 9) {
    ddd = '81';
    newNumber = string.substring(1);
    // console.log("Número com 9 dígitos \n")

  } else if (string.length === 8) {
    ddd = '81';
    newNumber = string;
    // console.log("Número com 8 dígitos \n")
  }
  
  // Retornar o número formatado
  return `+55${ddd}${newNumber.substring(0,4)}${newNumber.substring(4)}`;
};

module.exports = FormatTelephone;
