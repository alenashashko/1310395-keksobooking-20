'use strict';

window.pins = (function () {
  var PinSize = {
    HEIGHT: 70,
    WIDTH: 50
  };

  var errorMessageTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');
  var mainContainer = document.querySelector('main');
  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var pinsList = document.querySelector('.map__pins');
  var announcements = [];
  var activePin;

  var load = {
    successHandler: function (data) {
      announcements = data;

      // draw pins
      drawPins(announcements);

      window.page.toggleDisabledElementsAttribute(window.page.mapFilters, false);

      Array.from(window.page.mapFilters).forEach(function (filter) {
        filter.style.cursor = 'pointer';
      });
      Array.from(window.page.featuresFromMapFilters).forEach(function (feature) {
        feature.style.cursor = 'pointer';
      });
    },
    errorHandler: function (message) {
      var errorMessage = errorMessageTemplate.cloneNode(true);
      var errorMessageText = errorMessage.querySelector('.error__message');
      var errorButton = errorMessage.querySelector('.error__button');

      errorMessageText.textContent = message;
      mainContainer.appendChild(errorMessage);

      var openedErrorMessageEscapePressHandler = function (evt) {
        if (window.util.isEscapeEvent(evt)) {
          errorMessage.remove();
          document.removeEventListener('keydown', openedErrorMessageEscapePressHandler);
        }
      };

      errorButton.addEventListener('click', function () {
        errorMessage.remove();
        window.page.setInactiveStatus();
        window.backend.loadData(load.successHandler, load.errorHandler);
        document.removeEventListener('keydown', openedErrorMessageEscapePressHandler);
      });

      errorMessage.addEventListener('click', function (evt) {
        if (evt.target === errorMessage) {
          errorMessage.remove();
          document.removeEventListener('keydown', openedErrorMessageEscapePressHandler);
        }
      });

      document.addEventListener('keydown', openedErrorMessageEscapePressHandler);
    }
  };

  var getUniquePin = function (announcement) {
    var pin = pinTemplate.cloneNode(true);
    var pinImage = pin.querySelector('img');

    pin.style.left = announcement.location.x - PinSize.WIDTH / 2 + 'px';
    pin.style.top = announcement.location.y - PinSize.HEIGHT + 'px';

    pinImage.src = announcement.author.avatar;
    pinImage.alt = announcement.offer.title;

    pin.addEventListener('click', function () {
      if (activePin === pin) {
        return;
      }

      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }

      pin.classList.add('map__pin--active');
      window.card.close();
      window.card.open(announcement);

      activePin = pin;
    });

    return pin;
  };

  var removePins = function () {
    var pins = document.querySelectorAll('button.map__pin:not(.map__pin--main)');

    pins.forEach(function (it) {
      it.remove();
    });
  };

  var drawPins = function (data) {
    var filteredData = window.filter.data(data);
    var fragment = document.createDocumentFragment();

    // remove current pins
    removePins();

    // draw new pins
    filteredData.forEach(function (pin) {
      var uniquePin = getUniquePin(pin);
      fragment.appendChild(uniquePin);
    });

    pinsList.appendChild(fragment);
  };

  var getAnnouncements = function () { // return current state
    return announcements;
  };

  var getActivePin = function () { // return current state
    return activePin;
  };

  var clearActivePin = function () {
    activePin = undefined;
  };

  return {
    active: getActivePin,
    clearActive: clearActivePin,
    load: load,
    remove: removePins,
    drawWithDebounce: window.util.debounce(drawPins),
    getAnnouncements: getAnnouncements
  };
})();
