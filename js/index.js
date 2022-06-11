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
