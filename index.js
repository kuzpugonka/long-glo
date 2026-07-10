const title = "строка с названием проекта";
const screens =
  "строка с названиями типов экранов через запятую ('Простые, Сложные, Интерактивные')";
const screenPrice = 5;
const rollback = 15;
const fullPrice = 70000;
const adaptive = true;
const cashback = fullPrice * (rollback / 100);

console.log(typeof title);
console.log(typeof fullPrice);
console.log(typeof adaptive);

console.log(screens.length);
console.log(
  "Стоимость верстки экранов " + screenPrice + " рублей/долларов/гривен/юани",
);
console.log(
  "Стоимость разработки сайта " + fullPrice + " рублей/долларов/гривен/юани",
);
console.log(screens.toLowerCase());
console.log(screens.split(" "));
console.log(
  "Процент отката посреднику за работу " +
    cashback +
    " рублей/долларов/гривен/юани",
);
