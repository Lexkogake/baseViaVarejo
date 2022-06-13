let limpaDados = document.querySelector('.limpa_dados');
let formMercadoria = document.querySelector('#formMercadoria');
let menuMobile = document.querySelector('.menu-mobile');
let btnMenu = document.querySelector('.img-menu');
let valor = document.querySelector('#valor');
let items = JSON.parse(localStorage.getItem('items')) || [];

valor.addEventListener('input', element => {
  element.target.value = valorMascara(element.target.value);
});

formMercadoria.addEventListener('submit', event => {
  event.preventDefault();

  const tipoTransacao = event.target.elements['type'];
  const nomeMercadoria = event.target.elements['nomeMercadoria'];
  const valor = event.target.elements['valor'];

  items.push({
    tipoTransacao: tipoTransacao.value,
    nomeMercadoria: nomeMercadoria.value,
    valor: valor.value
  });

  criaLista();
  localStorage.setItem('items', JSON.stringify(items));
  nomeMercadoria.value = '';
  valor.value = '';
});

limpaDados.addEventListener('click', () => {
  let text = 'Deseja limpar os dados ?';

  if (items.length > 0 && confirm(text) == true) {
    localStorage.removeItem('items');
    items = [];
    criaLista();
  } else if (items.length <= 0) {
    alert('Não tem dados para apagar');
  }
});

btnMenu.addEventListener('click', () => {
  menuMobile.classList.add('ativo');
});

menuMobile.addEventListener('click', () => {
  menuMobile.classList.remove('ativo');
});

function criaLista() {
  let tBodylista = document.querySelector('.listaLinha');
  let tFoot = document.querySelector('.footer');
  tBodylista.innerHTML = '';
  tFoot.innerHTML = '';
  let total = 0;
  let soma = 0;
  for (const item of items) {
    let tr = tBodylista.insertRow();
    let tdColuna1 = tr.insertCell();
    let tdColuna2 = tr.insertCell();
    let tdColuna3 = tr.insertCell();
    tdColuna2.classList.add('positive');
    tdColuna3.innerHTML = item.valor;

    soma = item.valor.replace(/[^0-9,]*/g, '').replace(',', '.');
    if (item.tipoTransacao == 'compra') {
      total -= parseFloat(soma);
      tdColuna2.innerHTML = ` -<span>${item.nomeMercadoria}</span>`;
    } else {
      total += parseFloat(soma);
      tdColuna2.innerHTML = ` +<span>${item.nomeMercadoria}</span>`;
    }
  }

  if (items.length == 0) {
    let semConteudoTable = document.querySelector('.listaLinha');
    semConteudoTable.innerHTML = `
        <tr>
          <td></td>
          <td colspan='3'>
            <p class='noConteudo'>
              <span>Nenhuma transação cadastrada</span>
            </p>
          </td>
        </tr>
    `;
  } else {
    let footer = tFoot.insertRow();
    let tdFooterColuna1 = footer.insertCell();
    let tdFooterColuna2 = footer.insertCell();
    let tdFooterColuna3 = footer.insertCell();
    footer.classList.add('tr-total');
    tdFooterColuna2.classList.add('space');
    tdFooterColuna3.classList.add('profit');

    let totalMask =
      'R$ ' +
      parseFloat(total)
        .toFixed(2)
        .replace('.', ',')
        .replace(/([0-9]*)([0-9]{3},*)/, '$1.$2');

    tdFooterColuna2.innerHTML = 'Total';

    if (total == 0) {
      console.log(total);
      tdFooterColuna3.innerHTML = valorMascara(totalMask) + '<span></span>';
    } else if (total > 0) {
      console.log(total);
      tdFooterColuna3.innerHTML =
        valorMascara(totalMask) + '<span>[Lucro]</span>';
    } else {
      console.log(total);
      tdFooterColuna3.innerHTML =
        valorMascara(totalMask) + '<span>[Prejuizo]</span>';
    }
  }
}

function valorMascara(value) {
  const valorString = value.toString();
  const cleanValue = +valorString.replace(/\D+/g, '');
  const options = { style: 'currency', currency: 'BRL' };
  return new Intl.NumberFormat('pt-br', options).format(cleanValue / 100);
}

criaLista();
