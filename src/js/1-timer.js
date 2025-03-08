import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;

const datePicker = document.querySelector('#datetime-picker');
datePicker.disabled = false;

const startButton = document.querySelector('[data-start]');
startButton.disabled = true;

const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const date = selectedDates[0];
    if (date < new Date()) {
      startButton.disabled = true;
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      return;
    } else {
      userSelectedDate = date;
      startButton.disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

startButton.addEventListener('click', () => {
  if (timer != null) {
    stopTimer();
  } else {
    startTimer();
  }
});

let timer = null;

function startTimer() {
  if (timer != null) {
    return;
  }
  datePicker.disabled = true;
  startButton.textContent = 'Stop';
  timer = setInterval(updateTimer, 1000);
  updateTimer();
}

function stopTimer() {
  if (timer == null) {
    return;
  }
  clearInterval(timer);
  timer = null;
  datePicker.disabled = false;
  startButton.disabled = userSelectedDate < new Date();
  startButton.textContent = 'Start';
}

function updateTimer() {
  const currentDate = new Date();
  let timeDifference = userSelectedDate - currentDate;
  if (timeDifference <= 0) {
    timeDifference = 0;
    stopTimer();
  }
  const { days, hours, minutes, seconds } = convertMs(timeDifference);
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}
