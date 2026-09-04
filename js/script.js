"use strict";

// Получаем элементы и сразу проверяем, что они существуют
const title = document.getElementsByTagName("h1")[0];
const btnPlus = document.querySelector(".screen-btn");
const itemsPercent = document.querySelectorAll(".other-items.percent");
const itemsNumber = document.querySelectorAll(".other-items.number");

const inputRange = document.querySelector(".rollback input[type='range']");
const inputRangeValue = document.querySelector(".rollback .range-value");

// Используем id вместо getElementsByClassName
const btnStart = document.getElementById("start");
const btnReset = document.getElementById("reset");

const total = document.getElementsByClassName("total-input")[0];
const totalCount = document.getElementsByClassName("total-input")[1];
const totalCountOther = document.getElementsByClassName("total-input")[2];
const fullTotalCount = document.getElementsByClassName("total-input")[3];
const totalCountRollback = document.getElementsByClassName("total-input")[4];

let screens = document.querySelectorAll(".screen");

// Регулярка для строгого числа: опциональный минус, цифры, опционально точка и цифры
const numberRegex = /^-?\d+(\.\d+)?$/;

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

    // Безопасная подписка на события: проверяем наличие элемента перед addEventListener
    if (btnStart) {
      btnStart.addEventListener("click", () => this.start());
    } else {
      console.warn(
        "Элемент .handler_btn (кнопка «Старт») не найден — клик не будет обработан.",
      );
    }

    if (btnReset) {
      btnReset.addEventListener("click", () => this.resetAll());
    } else {
      console.warn("Кнопка «Сброс» не найдена.");
    }

    if (btnPlus) {
      btnPlus.addEventListener("click", () => this.addScreenBlock());
    } else {
      console.warn(
        "Элемент .screen-btn (кнопка «+ экран») не найден — добавление экрана недоступно.",
      );
    }

    // Ползунок: только если есть и сам ползунок, и элемент для вывода значения
    if (inputRange && inputRangeValue) {
      // Устанавливаем начальное значение при загрузке
      inputRangeValue.textContent = `${this.rollback}%`;
      inputRange.value = this.rollback;

      inputRange.addEventListener("input", (e) => {
        const currentValue = parseInt(e.target.value, 10);
        if (isNaN(currentValue)) return; // защита от некорректных значений

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
    } else if (inputRange || inputRangeValue) {
      // Если один из двух элементов отсутствует — логируем предупреждение
      console.warn(
        "Ползунок или его индикатор значения не найдены — функционал отката не будет работать.",
      );
    }

    // Делегирование событий для полей экранов
    // 1. Для инпутов используем input (мгновенно)
    document.body.addEventListener("input", (e) => {
      const target = e.target;
      if (target.closest(".screen") && target.type === "number") {
        this.validateSingleInput(target);
        this.validateScreens();
      }
    });

    // Также проверяем при вводе чисел (на случай если change не сработает сразу)
    // 2. Для селектов используем change (при потере фокуса) И input (мгновенно в новых браузерах)
    document.body.addEventListener("change", (e) => {
      const target = e.target;
      if (target.closest(".screen") && target.tagName === "SELECT") {
        this.validateScreens();
      }
    });
  },

  addTitle: function () {
    if (title) {
      document.title = title.textContent;
    } else {
      console.warn(
        "Заголовок <h1> не найден — document.title не будет обновлён.",
      );
    }
  },

  start: function () {
    // Сначала валидируем, чтобы не считать при ошибках
    const isValid = this.validateScreens();
    if (!isValid) return;

    this.addScreens();
    this.addServices();
    this.addPrices();

    // После расчёта кнопкой включаем режим «реального времени» для ползунка
    this.isCalculated = true;
    this.calculateRollbackPrice(); // считаем финальную цену с откатом
    this.showResult();

    // Блокируем левую часть: все input[type=text] и select
    const inputsText = document.querySelectorAll("input[type='text']");
    const selects = document.querySelectorAll("select");

    inputsText.forEach((el) => (el.disabled = true));
    selects.forEach((el) => (el.disabled = true));

    // Скрываем Старт, показываем Сброс
    if (btnStart) btnStart.style.display = "none";
    if (btnReset) btnReset.style.display = "inline-block";
  },

  resetAll: function () {
    // Разблокируем поля
    const inputsText = document.querySelectorAll("input[type='text']");
    const selects = document.querySelectorAll("select");

    inputsText.forEach((el) => (el.disabled = false));
    selects.forEach((el) => (el.disabled = false));

    // Показываем Старт, скрываем Сброс
    if (btnStart) btnStart.style.display = "inline-block";
    if (btnReset) btnReset.style.display = "none";

    // Сбрасываем состояние
    this.isCalculated = false;
    this.priceWithRollback = 0;
    this.fullPrice = 0;
    this.screenPrice = 0;
    this.servicePricesPercent = 0;
    this.servicePricesNumber = 0;
    this.totalScreensCount = 0;
    this.screens = [];

    // Очищаем итоговые поля
    if (total) total.value = "";
    if (totalCountOther) totalCountOther.value = "";
    if (fullTotalCount) fullTotalCount.value = "";
    if (totalCount) totalCount.value = "";
    if (totalCountRollback) totalCountRollback.value = "";

    // Убираем подсветку ошибок
    const invalidInputs = document.querySelectorAll(".invalid-input");
    invalidInputs.forEach((el) => el.classList.remove("invalid-input"));

    // Пересчитываем валидность (чтобы кнопка Старт снова могла стать активной)
    this.validateScreens();
  },

  calculateRollbackPrice: function () {
    const discountAmount = (this.fullPrice * this.rollback) / 100;
    this.priceWithRollback = Math.ceil(this.fullPrice - discountAmount);
  },

  showResult: function () {
    // Заполняем только те поля, которые реально существуют
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

  validateSingleInput: function (input) {
    // Валидация одного инпута (для мгновенной подсветки)
    const rawValue = input.value.trim();
    const isValid = numberRegex.test(rawValue) && parseFloat(rawValue) > 0;

    if (!isValid) {
      input.classList.add("invalid-input");
    } else {
      input.classList.remove("invalid-input");
    }
  },

  validateScreens: function () {
    const currentScreens = document.querySelectorAll(".screen");
    let isValid = true;

    currentScreens.forEach((screen) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input[type='number']");

      // Если в блоке экрана нет обязательных полей — считаем его невалидным
      if (!select || !input) {
        isValid = false;
        return;
      }

      const isSelectValid = select.selectedIndex > 0;

      // Вызываем единую валидацию инпута — она сама поставит/уберёт .invalid-input
      const rawValue = input.value.trim();

      const isInputValid =
        numberRegex.test(rawValue) && parseFloat(rawValue) > 0;

      // Подсветка инпута
      if (!isInputValid) {
        input.classList.add("invalid-input");
      } else {
        input.classList.remove("invalid-input");
      }

      if (!isSelectValid || !isInputValid) {
        isValid = false;
      }
    });

    // Кнопка Start только если она существует
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

      const rawValue = input.value.trim();

      // Если невалидно — считаем как 0, но класс уже поставлен в validateScreens
      const countValue = numberRegex.test(rawValue) ? parseFloat(rawValue) : 0;

      if (countValue <= 0) {
        return; // не добавляем в расчёт
      }

      this.screens.push({
        id: index + 1,
        name: select.options[select.selectedIndex].textContent,
        price: (+select.value || 0) * countValue,
        count: countValue, // добавляем свойство count
      });

      // суммируем количество экранов
      this.totalScreensCount += countValue;
    });
  },

  addScreenBlock: function () {
    if (screens.length === 0) {
      console.warn("Нет блоков .screen — невозможно клонировать новый.");
      return;
    }

    const cloneScreen = screens[0].cloneNode(true);

    // Cбрасываем значения, чтобы новый блок считался пустым
    const newSelect = cloneScreen.querySelector("select");
    const newInput = cloneScreen.querySelector("input");

    if (newSelect) newSelect.selectedIndex = 0; // Сброс на первый пункт
    if (newInput) {
      newInput.value = "";
      newInput.classList.remove("invalid-input"); // убираем подсветку у нового поля
    }

    screens[screens.length - 1].after(cloneScreen);

    // Пересчитываем список экранов и сразу проверяем валидность
    screens = document.querySelectorAll(".screen");
    this.validateScreens();
  },

  addServices: function () {
    // Очищаем объекты перед новым расчётом, чтобы снятые галочки не учитывались
    this.servicesPercent = {};
    this.servicesNumber = {};

    itemsPercent.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      // Проверяем, что все элементы существуют и чекбокс отмечен
      if (check && check.checked && label && input) {
        this.servicesPercent[label.textContent] = +input.value;
      }
    });

    itemsNumber.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check && check.checked && label && input) {
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
    console.log("Typeof array ", Array.isArray(this.screens));
  },
};

appData.init();
