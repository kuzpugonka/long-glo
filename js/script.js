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
      btnReset.addEventListener("click", () => this.reset());
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

    // Подключаем логику CMS-блока
    this.initCmsToggle();
    this.initCmsSelectToggle();
  },

  initCmsToggle: function () {
    // Новый метод: управление видимостью .hidden-cms-variants
    const cmsCheckbox = document.getElementById("cms-open");
    const cmsBlock = document.querySelector(".hidden-cms-variants");

    if (!cmsCheckbox) {
      console.warn("#cms-open не найден — логика CMS не подключится.");
      return;
    }

    // Если блока нет — просто не показываем, но не ломаем скрипт
    if (!cmsBlock) {
      console.warn(
        ".hidden-cms-variants не найден — блок не будет переключаться.",
      );
      return;
    }

    cmsCheckbox.addEventListener("change", () => {
      if (cmsCheckbox.checked) {
        cmsBlock.style.display = "flex";
      } else {
        cmsBlock.style.display = "none";
      }
    });

    // Инициализация состояния при загрузке страницы
    if (cmsCheckbox.checked) {
      cmsBlock.style.display = "flex";
    } else {
      cmsBlock.style.display = "none";
    }
  },

  initCmsSelectToggle: function () {
    const cmsBlock = document.querySelector(".hidden-cms-variants");

    if (!cmsBlock) {
      console.warn(
        ".hidden-cms-variants не найден — логика select не подключится.",
      );
      return;
    }

    const cmsSelect = cmsBlock.querySelector("select");
    const cmsInputBlock = cmsBlock.querySelector(".main-controls__input");

    if (!cmsSelect) {
      console.warn("select внутри .hidden-cms-variants не найден.");
      return;
    }

    if (!cmsInputBlock) {
      console.warn(
        ".main-controls__input внутри .hidden-cms-variants не найден.",
      );
      return;
    }

    // Инициализация при загрузке
    if (cmsSelect.value === "other") {
      cmsInputBlock.style.display = "block";
    } else {
      cmsInputBlock.style.display = "none";
    }

    // Реакция на выбор
    cmsSelect.addEventListener("change", () => {
      if (cmsSelect.value === "other") {
        cmsInputBlock.style.display = "block";
      } else {
        cmsInputBlock.style.display = "none";
      }
    });
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

    // Блокируем все input[type=text] и select
    const inputsText = document.querySelectorAll("input[type='text']");
    const selects = document.querySelectorAll("select");

    inputsText.forEach((el) => (el.disabled = true));
    selects.forEach((el) => (el.disabled = true));

    // Скрываем Старт, показываем Сброс
    if (btnStart) btnStart.style.display = "none";
    if (btnReset) btnReset.style.display = "inline-block";
  },

  reset: function () {
    // 1. Сбрасываем свойства объекта к исходным значениям
    this.screens = [];
    this.screenPrice = 0;
    this.servicePricesPercent = 0;
    this.servicePricesNumber = 0;
    this.fullPrice = 0;
    this.servicesPercent = {};
    this.servicesNumber = {};
    this.totalScreensCount = 0;
    this.priceWithRollback = 0;
    this.isCalculated = false;

    // 2. Сбрасываем ползунок отката
    this.rollback = 0;
    if (inputRange) inputRange.value = 0;
    if (inputRangeValue) inputRangeValue.textContent = "0%";

    // 3. Удаляем все динамически добавленные блоки .screen (оставляем первый)
    screens = document.querySelectorAll(".screen");
    for (let i = screens.length - 1; i > 0; i--) {
      screens[i].remove();
    }

    // 4. Очищаем значения в оставшемся (первом) блоке .screen
    screens = document.querySelectorAll(".screen");
    screens.forEach((screen) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input[type='number']");
      const errorEl = screen.querySelector(".error-message");

      if (select) select.selectedIndex = 0;
      if (input) {
        input.value = "";
        input.classList.remove("invalid-input");
      }
      if (errorEl) {
        errorEl.textContent = "";
        errorEl.classList.remove("visible");
      }
    });

    // 5. Снимаем все чекбоксы услуг
    const allCheckboxes = document.querySelectorAll("input[type='checkbox']");
    allCheckboxes.forEach((cb) => (cb.checked = false));

    // 6. Очищаем текстовые поля услуг
    const serviceInputs = document.querySelectorAll(
      ".other-items input[type='text']",
    );
    serviceInputs.forEach((el) => (el.value = ""));

    // 7. Разблокируем все input[type=text] и select
    const inputsText = document.querySelectorAll("input[type='text']");
    const selects = document.querySelectorAll("select");

    inputsText.forEach((el) => (el.disabled = false));
    selects.forEach((el) => (el.disabled = false));

    // 8. Очищаем итоговые поля
    if (total) total.value = "";
    if (totalCountOther) totalCountOther.value = "";
    if (fullTotalCount) fullTotalCount.value = "";
    if (totalCount) totalCount.value = "";
    if (totalCountRollback) totalCountRollback.value = "";

    // 9. Переключаем кнопки: Сброс → Старт
    if (btnStart) btnStart.style.display = "inline-block";
    if (btnReset) btnReset.style.display = "none";

    // 10. Скрываем CMS-блок и сбрасываем его внутренности
    const cmsBlock = document.querySelector(".hidden-cms-variants");
    if (cmsBlock) {
      cmsBlock.style.display = "none";

      const cmsInputBlock = cmsBlock.querySelector(".main-controls__input");
      if (cmsInputBlock) cmsInputBlock.style.display = "none";

      const cmsSelect = cmsBlock.querySelector("select");
      if (cmsSelect) cmsSelect.selectedIndex = 0;
    }

    // 11. Пересчитываем валидность (кнопка Старт должна стать неактивной,
    //     т.к. поля очищены)
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

  addTitle: function () {
    if (title) {
      document.title = title.textContent;
    } else {
      console.warn(
        "Заголовок <h1> не найден — document.title не будет обновлён.",
      );
    }
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
    this.servicesPercent = {};
    this.servicesNumber = {};

    itemsPercent.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");

      if (check && check.checked && label) {
        this.servicesPercent[label.textContent] = +check.value;
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

    // 2. Считаем услуги с фиксированной стоимостью
    this.servicePricesNumber = 0;
    for (const key in this.servicesNumber) {
      this.servicePricesNumber += this.servicesNumber[key];
    }

    // 3. Базовая стоимость = экраны + фиксированные услуги
    const basePrice = this.screenPrice + this.servicePricesNumber;

    // 4. Считаем процентные услуги от базовой стоимости
    this.servicePricesPercent = 0;
    for (const key in this.servicesPercent) {
      this.servicePricesPercent +=
        basePrice * (this.servicesPercent[key] / 100);
    }

    // 5. Полная стоимость = базовая + процентные услуги
    this.fullPrice = basePrice + this.servicePricesPercent;
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
