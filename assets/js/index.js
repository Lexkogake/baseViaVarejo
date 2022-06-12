let limpaDados = document.querySelector('.limpa_dados');
let formMercadoria = document.querySelector('#formMercadoria');
let menuMobile = document.querySelector('.menu-mobile');
let btnMenu = document.querySelector('.img-menu');
let items = JSON.parse(localStorage.getItem('items')) || [];

function criaLista() {
  let lista = document.querySelector('.listaLinha');
  let tfoot = document.querySelector('.footer');
  lista.innerHTML = '';
  tfoot.innerHTML = '';
  let total = 0;
  let soma = 0;
  for (const item of items) {
    let tr = lista.insertRow();
    let td_col1 = tr.insertCell();
    let td_col2 = tr.insertCell();
    let td_col3 = tr.insertCell();
    td_col2.classList.add('positive');
    td_col3.innerHTML = item.valor;

    soma = item.valor.replace(/[^0-9,]*/g, '').replace(',', '.');
    if (item.tipoTransacao == 'compra') {
      total -= parseFloat(soma);
      td_col2.innerHTML = ` -<span>${item.nomeMercadoria}</span>`;
    } else {
      total += parseFloat(soma);
      td_col2.innerHTML = ` +<span>${item.nomeMercadoria}</span>`;
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
    let ftoo = tfoot.insertRow();
    let td_f1 = ftoo.insertCell();
    let td_f2 = ftoo.insertCell();
    let td_f3 = ftoo.insertCell();
    ftoo.classList.add('tr-total');
    td_f2.classList.add('space');
    td_f3.classList.add('profit');

    let totalMask =
      'R$ ' +
      parseFloat(total)
        .toFixed(2)
        .replace('.', ',')
        .replace(/([0-9]*)([0-9]{3},*)/, '$1.$2');

    td_f2.innerHTML = 'Total';

    if (total > 0) {
      td_f3.innerHTML = totalMask + '<span>[Lucro]</span>';
    } else {
      td_f3.innerHTML = totalMask + '<span>[Prejuizo]</span>';
    }
  }
}

const mask = {
  money(value) {
    const cleanValue = +value.replace(/\D+/g, '');
    const options = { style: 'currency', currency: 'BRL' };
    return new Intl.NumberFormat('pt-br', options).format(cleanValue / 100);
  }
};

let valor = document.querySelector('#valor');
valor.addEventListener('input', element => {
  element.target.value = mask.money(element.target.value);
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

criaLista();
