document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('getDiscountButton');
    const successMessage = document.getElementById('successMessage');
    const failureMessage = document.getElementById('failureMessage');
    const promoCodeElement = document.getElementById('promoCode');

    let timerInterval;

    // Генерируем промокод
    function generatePromoCode(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let promoCode = '';
        for (let i = 0; i < length; i++) {
            promoCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return promoCode;
    }

    // Обновляем таймер на странице
    function updateTimerDisplay(timeRemaining) {
        const hours = Math.floor(timeRemaining / (60 * 60));
        const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
        const seconds = timeRemaining % 60;
        document.getElementById('timer').textContent = `${hours} часов ${minutes} минут ${seconds} секунд`;
    }

    // Запускаем таймер
    function startTimer(timeRemaining) {
        let timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay(timeRemaining);

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                unlockButton();
            }
        }, 1000);
        return timerInterval;
    }

    // Функция блокировки кнопки
    function disableButton() {
        button.disabled = true;
        button.classList.add('disabled'); // Добавляем класс 'disabled'
    }

    // Функция разблокировки кнопки
    function unlockButton() {
        button.disabled = false;
        button.classList.remove('disabled');
        failureMessage.style.display = "none";
        clearState(); // Очищаем состояние при разблокировке
    }

    // Функция сохранения состояния
    function saveState(lastAttemptTime, hasWon, promoCode) {
      localStorage.setItem('lastAttemptTime', lastAttemptTime);
      localStorage.setItem('hasWon', hasWon);
      localStorage.setItem('promoCode', promoCode);
    }

    // Функция загрузки состояния
    function loadState() {
      return {
        lastAttemptTime: localStorage.getItem('lastAttemptTime'),
        hasWon: localStorage.getItem('hasWon') === 'true',
        promoCode: localStorage.getItem('promoCode')
      };
    }

    // Функция очистки состояния
    function clearState() {
        localStorage.removeItem('lastAttemptTime');
        localStorage.removeItem('hasWon');
        localStorage.removeItem('promoCode');
    }

    const state = loadState();

    // Если уже выиграл
    if (state.hasWon) {
      promoCodeElement.textContent = state.promoCode;
      successMessage.style.display = "block";
      button.disabled = true;
      button.classList.add('disabled');
      return;
    }

    // Если была неудачная попытка
    if (state.lastAttemptTime) {
      const timeLeft = (parseInt(state.lastAttemptTime) + 12 * 60 * 60 * 1000) - Date.now();
      if (timeLeft > 0) {
        disableButton();
        failureMessage.style.display = "block";
        const timeRemaining = Math.ceil(timeLeft / 1000);
        updateTimerDisplay(timeRemaining);
        timerInterval = startTimer(timeRemaining);
      } else {
        clearState(); // Очищаем состояние, если таймер истек
      }
    }

    button.addEventListener('click', function() {
        if (Math.random() < 0.4) {
            // Успех
            const promo = generatePromoCode(10);
            promoCodeElement.textContent = promo;
            successMessage.style.display = "block";
            failureMessage.style.display = "none";
            disableButton();

            // Сохраняем состояние
            saveState(null, true, promo);

            setTimeout(() => {
              successMessage.style.display = "none";
            }, 5000);

        } else {
            // Неудача
            failureMessage.style.display = "block";
            successMessage.style.display = "none";
            disableButton();

            const now = Date.now();

            // Сохраняем состояние
            saveState(now, false, null);

            const timeLeft = 12 * 60 * 60;
            updateTimerDisplay(timeLeft);
            timerInterval = startTimer(timeLeft);
        }
    });

    // Функция для остановки таймера (если нужно)
    function stopTimer() {
      clearInterval(timerInterval);
    }
});