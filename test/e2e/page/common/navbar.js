'use strict';

function NavBar() {}

function MenuItem(elem) {
  this.elem = elem;
}

MenuItem.prototype = Object.create({});
MenuItem.prototype.isSelected = function () {
  return this.elem.$('i.fa.fa-check').isDisplayed();
};

NavBar.prototype = Object.create({}, {
  elem: { get: function () { return $('nav'); }},
  campusDropdown: { get: function () {
    var elem = this.elem.$('[dropdown]');

    var ret = {
      elem: elem,
      selectedCampus: elem.$('[dropdown-toggle]'),
      menu: elem.$('[role=menu]')
    };

    ret.menuItemAt = function (index) {
      return new MenuItem(ret.menu.$$('li').get(index));
    };

    ret.toggle = function () {
      ret.selectedCampus.click();
    };
    return ret;
  }}
});
NavBar.prototype.setSelectedCampus = function (index) {
  var dropdown = this.campusDropdown;
  return dropdown.menu.isDisplayed()
    .then(function (isDisplayed) {
      if (!isDisplayed) {
        dropdown.toggle();
      }

      return dropdown.menuItemAt(index).elem.click();
    });
};

module.exports = NavBar;
