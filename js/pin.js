'use strict';

window.pin = (function () {
  var mapPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
  var mapPinsList = document.querySelector('.map__pins');

  var MapPinSizes = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var getUniqueMapPin = function (announcement) {
    var pinElement = mapPinTemplate.cloneNode(true);
    pinElement.style.left = announcement.location.x - MapPinSizes.WIDTH / 2 + 'px';
    pinElement.style.top = announcement.location.y - MapPinSizes.HEIGHT + 'px';

    var mapPinImage = pinElement.querySelector('img');
    mapPinImage.src = announcement.author.avatar;
    mapPinImage.alt = announcement.offer.title;

    pinElement.addEventListener('click', function () {
      window.map.closeCard();
      window.map.openCard(announcement);
    });
    return pinElement;
  };

  var drawMapPins = function (announcements) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < announcements.length; i++) {
      var uniqueMapPin = getUniqueMapPin(announcements[i]);
      fragment.appendChild(uniqueMapPin);
    }
    mapPinsList.appendChild(fragment);
  };

  return {
    drawMapPins: drawMapPins
  };
})();