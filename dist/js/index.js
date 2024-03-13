/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// Promo timer
const createTimerAppearance = timer => {
  const title = document.createElement('p');
  title.classList.add('block-one__text');
  title.textContent = 'До конца акции:';
  const mainBlock = document.createElement('div');
  mainBlock.classList.add('block-one__timer');
  const createTimerItemBlock = typeClass => {
    const itemBlock = document.createElement('div');
    itemBlock.classList.add('block-one__timer-item', typeClass);
    const value = document.createElement('p');
    value.classList.add('block-one__timer-value');
    const parameter = document.createElement('p');
    parameter.classList.add('block-one__timer-parameter');
    itemBlock.append(value, parameter);
    itemBlock.value = value;
    itemBlock.parameter = parameter;
    return itemBlock;
  };
  const dayBlock = createTimerItemBlock('block-one__timer-item_type_days');
  const hourBlock = createTimerItemBlock('block-one__timer-item_type_hours');
  const minBlock = createTimerItemBlock('block-one__timer-item_type_minutes');
  mainBlock.append(dayBlock, hourBlock, minBlock);
  timer.append(title, mainBlock);
  return {
    title,
    mainBlock,
    dayNum: dayBlock.value,
    dayParam: dayBlock.parameter,
    hourNum: hourBlock.value,
    hourParam: hourBlock.parameter,
    minNum: minBlock.value,
    minParam: minBlock.parameter
  };
};
const timer = (timer, deadline, gmt) => {
  const {
    title,
    mainBlock,
    dayNum,
    dayParam,
    hourNum,
    hourParam,
    minNum,
    minParam
  } = createTimerAppearance(timer);
  const getTimeRemaining = () => {
    const dateStop = new Date(`${deadline} GMT${gmt}:00`).getTime();
    const dateNow = Date.now();
    const timeRemaining = dateStop - dateNow;
    const seconds = Math.floor(timeRemaining / 1000 % 60);
    const minutes = Math.floor(timeRemaining / 1000 / 60 % 60);
    const hours = Math.floor(timeRemaining / 1000 / 60 / 60 % 24);
    const days = Math.floor(timeRemaining / 1000 / 60 / 60 / 24);
    return {
      timeRemaining,
      seconds,
      minutes,
      hours,
      days
    };
  };
  const start = () => {
    const timer = getTimeRemaining();
    const setOptions = unit => ({
      style: 'unit',
      unit,
      unitDisplay: 'long',
      maximumSignificantDigits: '2'
    });
    const daysText = new Intl.NumberFormat('ru', setOptions('day'));
    const hoursText = new Intl.NumberFormat('ru', setOptions('hour'));
    const minText = new Intl.NumberFormat('ru', setOptions('minute'));
    const secText = new Intl.NumberFormat('ru', setOptions('second'));
    dayNum.textContent = timer.days < 10 ? '0' + timer.days : timer.days;
    dayParam.textContent = daysText.format(timer.days).slice(2).trim();
    hourNum.textContent = timer.hours < 10 ? '0' + timer.hours : timer.hours;
    hourParam.textContent = hoursText.format(timer.hours).slice(2).trim();
    minNum.textContent = timer.minutes < 10 ? '0' + timer.minutes : timer.minutes;
    minParam.textContent = minText.format(timer.minutes).slice(2).trim();
    const intervalId = setTimeout(start, 1000);
    if (timer.timeRemaining < 86400000) {
      dayNum.textContent = timer.hours < 10 ? '0' + timer.hours : timer.hours;
      dayParam.textContent = hoursText.format(timer.hours).slice(2).trim();
      hourNum.textContent = timer.minutes < 10 ? '0' + timer.minutes : timer.minutes;
      hourParam.textContent = minText.format(timer.minutes).slice(2).trim();
      minNum.textContent = timer.seconds < 10 ? '0' + timer.seconds : timer.seconds;
      minParam.textContent = secText.format(timer.seconds).slice(2).trim();
    }
    if (timer.timeRemaining <= 0) {
      clearTimeout(intervalId);
      dayNum.textContent = '00';
      hourNum.textContent = '00';
      minNum.textContent = '00';
      title.remove();
      mainBlock.remove();
    }
  };
  start();
};
const setTimer = gmt => {
  const timerBlock = document.querySelector('[data-timer-deadline]');
  return timerBlock ? timer(timerBlock, timerBlock.dataset.timerDeadline, gmt) : null;
};
window.addEventListener('DOMContentLoaded', () => {
  setTimer('+03');
});

// Drop menu
const menuBtn = document.querySelector('.header__menu-button');
const menuBtnIcon = document.querySelector('.header__button-icon');
const menuContent = document.querySelector('.header__menu-box');
const menuOverlay = document.querySelector('.header__menu-overlay');
menuBtn.addEventListener('click', () => {
  menuBtnIcon.classList.toggle('header__button-icon_active');
  if (menuContent.classList.contains('header__menu-box_active')) {
    menuContent.style.height = '';
    menuContent.classList.remove('header__menu-box_active');
    menuOverlay.style.opacity = '0';
    setTimeout(() => menuOverlay.classList.remove('header__menu-overlay_active'), 400);
  } else {
    menuOverlay.classList.add('header__menu-overlay_active');
    menuOverlay.style.opacity = '1';
    menuContent.style.height = `${menuContent.scrollHeight}px`;
    menuContent.classList.add('header__menu-box_active');
  }
});
menuOverlay.addEventListener('click', e => {
  if (e.target === menuOverlay || e.target.classList.contains('navigation-block__link')) {
    menuBtnIcon.classList.remove('header__button-icon_active');
    menuContent.classList.remove('header__menu-box_active');
    menuContent.style.height = '';
    setTimeout(() => menuOverlay.classList.remove('header__menu-overlay_active'), 400);
  }
});

//Footer accordeon
const accordeonBtnsArr = document.querySelectorAll('.navigation-block__accordeon-btn');
const accordeonArrowsArr = document.querySelectorAll('.navigation-block__accordeon-arrow');
const accordeonListsArr = document.querySelectorAll('.navigation-block__list');
accordeonBtnsArr.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    accordeonArrowsArr[index].classList.toggle('navigation-block__accordeon-arrow_active');
    accordeonListsArr[index].style.height = accordeonListsArr[index].classList.contains('navigation-block__list_active') ? '' : `${accordeonListsArr[index].scrollHeight}px`;
    accordeonListsArr[index].classList.toggle('navigation-block__list_active');
  });
});
window.addEventListener('resize', () => {
  if (document.documentElement.scrollWidth > 640) {
    accordeonListsArr.forEach(list => {
      list.classList.remove('navigation-block__list_active');
      list.style.height = '';
    });
    accordeonArrowsArr.forEach(arrow => {
      arrow.classList.remove('navigation-block__accordeon-arrow_active');
    });
  }
});
/******/ })()
;