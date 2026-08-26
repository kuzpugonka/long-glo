"use strict";

const title = document.getElementsByTagName("h1")[0];
const btnPlus = document.querySelector(".screen-btn");
const itemsPercent = document.querySelectorAll(".other-items.percent");
const itemsNumber = document.querySelectorAll(".other-items.number");

const inputRange = document.querySelector(".rollback input[type='range']");
const inputRangeValue = document.querySelector(".rollback .range-value");

const btnStart = document.getElementsByClassName("handler_btn")[0];
const btnReset = document.getElementsByClassName("handler_btn")[1];

const total = document.getElementsByClassName("total-input")[0];
const totalCount = document.getElementsByClassName("total-input")[1];
const totalCountOther = document.getElementsByClassName("total-input")[2];
const fullTotalCount = document.getElementsByClassName("total-input")[3];
const totalCountRollback = document.getElementsByClassName("total-input")[4];

let screens = document.querySelectorAll(".screen");

const appData = {
  screens: [],
  screenPrice: 0,
  adaptive: true,
  rollback: 0, // Начальное значение по умолчанию
  servicePricesPercent: 0,
  servicePricesNumber: 0,
  fullPrice: 0,
  servicePercentPrice: 0,
  servicesPercent: {}, //  значение price в %
  servicesNumber: {}, // готовая стоимость
  totalScreensCount: 0, // новое свойство для общего количества экранов

  init: function () {
    this.addTitle();

    // Добавляем валидацию при старте (на случай, если уже есть данные)
    appData.validateScreens();

    btnStart.addEventListener("click", appData.start);
    btnPlus.addEventListener("click", appData.addScreenBlock);

    // --- ОБРАБОТЧИК ДЛЯ ПОЛЗУНКА  ---
    if (inputRange && inputRangeValue) {
      // Устанавливаем начальное значение при загрузке
      inputRangeValue.textContent = `${appData.rollback}%`;
      inputRange.value = appData.rollback;

      inputRange.addEventListener("input", (e) => {
        const currentValue = parseInt(e.target.value, 10);

        // Обновляем текст под ползунком
        inputRangeValue.textContent = `${currentValue}%`;

        // Обновляем свойство объекта
        appData.rollback = currentValue;

        // Если нужно пересчитывать в реальном времени без нажатия кнопки:
        // appData.calculateFinalPrice();
      });
    }

    // --- ПОДПИСЫВАЕМСЯ НА ИЗМЕНЕНИЯ В ПОЛЯХ ЭКРАНОВ ---
    // Так как блоки могут добавляться динамически, используем делегирование или перепривязку
    // 1. Для инпутов используем input (мгновенно)
    document.body.addEventListener("input", (e) => {
      const target = e.target;
      if (target.closest(".screen") && target.type === "number") {
        appData.validateScreens();
      }
    });

    // Также проверяем при вводе чисел (на случай если change не сработает сразу)
    // 2. Для селектов используем change (при потере фокуса) И input (мгновенно в новых браузерах)
    document.body.addEventListener("change", (e) => {
      const target = e.target;
      if (target.closest(".screen") && target.tagName === "SELECT") {
        appData.validateScreens();
      }
    });
  },
  addTitle: function () {
    document.title = title.textContent;
  },
  start: function () {
    appData.addScreens();
    appData.addServices();
    appData.addPrices();
    appData.showResult();
  },
  showResult: function () {
    total.value = appData.screenPrice;
    totalCountOther.value =
      appData.servicePricesPercent + appData.servicePricesNumber;
    fullTotalCount.value = appData.fullPrice;

    // Вывод количества экранов
    if (totalCount) {
      totalCount.value = appData.totalScreensCount;
    }

    // Выводим стоимость с учетом отката в нужное поле
    if (totalCountRollback) {
      totalCountRollback.value = appData.priceWithRollback;
    }
    // totalCountRollback.value = appData.servicePercentPrice;
  },
  validateScreens: function () {
    const currentScreens = document.querySelectorAll(".screen");
    let isValid = true;

    currentScreens.forEach((screen, index) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input[type='number']");

      // Проверка: выбран ли не пустой option (обычно у первого option value="")
      // И введено ли число больше 0
      if (!select || !input) {
        isValid = false;
        return;
      }

      // ИСПРАВЛЕНИЕ 1: Проверяем selectedIndex > 0.
      // Это значит, что выбран любой пункт, кроме первого (который обычно "Выберите...").
      const isSelectValid = select.selectedIndex > 0;

      // ИСПРАВЛЕНИЕ 2: Проверка input. Используем parseFloat, чтобы отсечь пробелы и нечисловые значения.
      const inputValue = parseFloat(input.value);
      const isInputValid = !isNaN(inputValue) && inputValue > 0;

      if (!isSelectValid || !isInputValid) {
        isValid = false;
      }
    });

    // Применяем состояние кнопки
    btnStart.disabled = !isValid;

    if (btnStart.disabled) {
      btnStart.style.opacity = "0.5";
      btnStart.style.cursor = "not-allowed";
    } else {
      btnStart.style.opacity = "1";
      btnStart.style.cursor = "pointer";
    }

    return isValid;
  },
  addScreens: function () {
    screens = document.querySelectorAll(".screen");
    appData.screens = []; // Очищаем массив перед пересчетом
    appData.totalScreensCount = 0; // сбрасываем перед пересчётом

    screens.forEach(function (screen, index) {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");

      // Защита от ошибок, если полей нет
      if (!select || !input) return;

      const selectName = select.options[select.selectedIndex].textContent;
      const countValue = parseFloat(input.value) || 0;

      appData.screens.push({
        id: index + 1,
        name: selectName,
        price: (+select.value || 0) * countValue,
        count: countValue, // добавила свойство count
      });

      // суммируем количество экранов
      appData.totalScreensCount += countValue;
    });
  },
  addScreenBlock: function () {
    const cloneScreen = screens[0].cloneNode(true);

    // ВАЖНО: При клонировании сбрасываем значения, чтобы новый блок считался пустым
    const newSelect = cloneScreen.querySelector("select");
    const newInput = cloneScreen.querySelector("input");

    if (newSelect) newSelect.selectedIndex = 0; // Сброс на первый пункт
    if (newInput) newInput.value = "";

    screens[screens.length - 1].after(cloneScreen);

    // Пересчитываем список экранов и сразу проверяем валидность
    screens = document.querySelectorAll(".screen");
    appData.validateScreens();
  },
  addServices: function () {
    itemsPercent.forEach(function (item) {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check.checked) {
        appData.servicesPercent[label.textContent] = +input.value;
      }
    });

    itemsNumber.forEach(function (item) {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check.checked) {
        appData.servicesNumber[label.textContent] = +input.value;
      }
    });
    // console.log(appData);
  },
  addPrices: function () {
    // 1. Считаем стоимость экранов
    appData.screenPrice = appData.screens.reduce(
      (acc, item) => acc + item.price,
      0,
    );

    // 2. Считаем услуги фиксированной стоимостью
    appData.servicePricesNumber = 0; //защита от удвоения суммы
    for (let key in appData.servicesNumber) {
      appData.servicePricesNumber += appData.servicesNumber[key];
    }

    // 3. Считаем услуги в процентах от стоимости экранов
    appData.servicePricesPercent = 0; //защита от удвоения суммы
    for (let key in appData.servicesPercent) {
      appData.servicePricesPercent +=
        appData.screenPrice * (appData.servicesPercent[key] / 100);
    }

    // 4. Считаем полную стоимость (до скидки/отката)
    appData.fullPrice =
      appData.screenPrice +
      appData.servicePricesNumber +
      appData.servicePricesPercent;

    // --- НОВАЯ ЛОГИКА: Расчет стоимости с учетом отката посредника ---
    // Формула: Полная цена - (Полная цена * Откат / 100)
    const discountAmount = (appData.fullPrice * appData.rollback) / 100;
    appData.priceWithRollback = Math.ceil(appData.fullPrice - discountAmount);
  },
  getRollbackMessage: function (price) {
    if (price >= 30000) {
      return "Даем скидку в 10%";
    } else if (price >= 15000 && price < 30000) {
      return "Даем скидку в 5%";
    } else if (price >= 0 && price < 15000) {
      return "Скидка не предусмотрена";
    } else {
      return "Что-то пошло не так";
    }
  },
  getServicePercentPrice: function () {
    appData.servicePercentPrice = Math.ceil(
      appData.fullPrice - (appData.fullPrice * appData.rollback) / 100,
    );
  },

  logger: function () {
    for (let key in appData) {
      if (typeof appData[key] != "function") {
        if (key === "title") {
          console.log(
            `Как называется ваш проект? ${appData.title}, `,
            typeof appData.title,
          );
        } else {
          console.log(`${key}:  ${appData[key]}`);
        }
      }
    }
    console.log("Typeof array ", Array.isArray(appData.screens));
  },
};

appData.init();
