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
  servicesPercent: {}, //  значение price в %
  servicesNumber: {}, // готовая стоимость
  totalScreensCount: 0, // новое свойство для общего количества экранов
  priceWithRollback: 0, // финальная цена с откатом
  isCalculated: false, //  был ли расчёт кнопкой «Рассчитать»

  init: function () {
    this.addTitle();

    // Добавляем валидацию при старте (на случай, если уже есть данные)
    this.validateScreens();

    if (btnStart) {
      btnStart.addEventListener("click", () => this.start());
    }
    if (btnPlus) {
      btnPlus.addEventListener("click", () => this.addScreenBlock());
    }

    // Ползунок
    if (inputRange && inputRangeValue) {
      // Устанавливаем начальное значение при загрузке
      inputRangeValue.textContent = `${this.rollback}%`;
      inputRange.value = this.rollback;

      inputRange.addEventListener("input", (e) => {
        const currentValue = parseInt(e.target.value, 10);

        // Обновляем текст под ползунком
        inputRangeValue.textContent = `${currentValue}%`;

        // Обновляем свойство объекта
        this.rollback = currentValue;

        // Пересчитываем финальную цену ТОЛЬКО если уже был расчёт кнопкой
        if (this.isCalculated) {
          this.calculateRollbackPrice();
          this.showResult();
        }
      });
    }

    // Делегирование событий для полей экранов
    // 1. Для инпутов используем input (мгновенно)
    document.body.addEventListener("input", (e) => {
      const target = e.target;
      if (target.closest(".screen") && target.type === "number") {
        appData.validateScreens(); // используем appData, потому что this здесь — window
      }
    });

    // Также проверяем при вводе чисел (на случай если change не сработает сразу)
    // 2. Для селектов используем change (при потере фокуса) И input (мгновенно в новых браузерах)
    document.body.addEventListener("change", (e) => {
      const target = e.target;
      if (target.closest(".screen") && target.tagName === "SELECT") {
        appData.validateScreens(); // используем appData, потому что this здесь — window
      }
    });
  },
  addTitle: function () {
    if (title) {
      document.title = title.textContent;
    }
  },
  start: function () {
    this.addScreens();
    this.addServices();
    this.addPrices();

    // После расчёта кнопкой включаем режим «реального времени» для ползунка
    this.isCalculated = true;
    this.calculateRollbackPrice(); // считаем финальную цену с откатом
    this.showResult();
  },
  calculateRollbackPrice: function () {
    const discountAmount = (this.fullPrice * this.rollback) / 100;
    this.priceWithRollback = Math.ceil(this.fullPrice - discountAmount);
  },
  showResult: function () {
    if (total) total.value = this.screenPrice;
    if (totalCountOther)
      totalCountOther.value =
        this.servicePricesPercent + this.servicePricesNumber;
    if (fullTotalCount) fullTotalCount.value = this.fullPrice;

    // Вывод количества экранов
    if (totalCount) {
      totalCount.value = this.totalScreensCount;
    }

    // Показываем финальную цену только если был расчёт
    if (totalCountRollback) {
      totalCountRollback.value = this.isCalculated
        ? this.priceWithRollback
        : "";
    }
  },
  validateScreens: function () {
    const currentScreens = document.querySelectorAll(".screen");
    let isValid = true;

    currentScreens.forEach((screen) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input[type='number']");

      // Проверка: выбран ли не пустой option (обычно у первого option value="")
      // И введено ли число больше 0
      if (!select || !input) {
        isValid = false;
        return;
      }

      const isSelectValid = select.selectedIndex > 0;
      const inputValue = parseFloat(input.value);
      const isInputValid = !isNaN(inputValue) && inputValue > 0;

      if (!isSelectValid || !isInputValid) {
        isValid = false;
      }
    });

    if (btnStart) {
      btnStart.disabled = !isValid;
      btnStart.style.opacity = isValid ? "1" : "0.5";
      btnStart.style.cursor = isValid ? "pointer" : "not-allowed";
    }

    return isValid;
  },
  addScreens: function () {
    screens = document.querySelectorAll(".screen");
    this.screens = []; // Очищаем массив перед пересчетом
    this.totalScreensCount = 0; // сбрасываем перед пересчётом

    screens.forEach((screen, index) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");

      // Защита от ошибок, если полей нет
      if (!select || !input) return;

      const countValue = parseFloat(input.value) || 0;

      this.screens.push({
        id: index + 1,
        name: select.options[select.selectedIndex].textContent,
        price: (+select.value || 0) * countValue,
        count: countValue, // добавила свойство count
      });

      // суммируем количество экранов
      this.totalScreensCount += countValue;
    });
  },
  addScreenBlock: function () {
    if (screens.length === 0) return;

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
    itemsPercent.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check && check.checked) {
        this.servicesPercent[label.textContent] = +input.value;
      }
    });

    itemsNumber.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check && check.checked) {
        this.servicesNumber[label.textContent] = +input.value;
      }
    });
  },
  addPrices: function () {
    // 1. Считаем стоимость экранов
    this.screenPrice = this.screens.reduce((acc, item) => acc + item.price, 0);

    // 2. Считаем услуги фиксированной стоимостью
    this.servicePricesNumber = 0; //защита от удвоения суммы
    for (const key in this.servicesNumber) {
      this.servicePricesNumber += this.servicesNumber[key];
    }

    // 3. Считаем услуги в процентах от стоимости экранов
    this.servicePricesPercent = 0; //защита от удвоения суммы
    for (const key in this.servicesPercent) {
      this.servicePricesPercent +=
        this.screenPrice * (this.servicesPercent[key] / 100);
    }

    // 4. Считаем полную стоимость (до скидки/отката)
    this.fullPrice =
      this.screenPrice + this.servicePricesNumber + this.servicePricesPercent;
  },

  logger: function () {
    for (const key in this) {
      if (typeof this[key] !== "function") {
        console.log(`${key}:  ${this[key]}`);
      }
    }
    console.log("Typeof array ", Array.isArray(appData.screens));
  },
};

appData.init();
