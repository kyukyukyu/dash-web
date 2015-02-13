/* jshint unused: false */
'use strict';

/**
 * @ngdoc directive
 * @name dashApp.common:dsSubject
 * @description
 * # dsSubject
 */
angular.module('dashApp.common')
  .directive('dsSubject', function () {
    var SUBJECT_ACTIONS_ARIA_LABEL = function (code) {
      return 'Actions for subject ' + code;
    };
    var CHEVRON_ARIA_LABEL_EXPAND = 'Expand';
    var CHEVRON_ARIA_LABEL_COLLAPSE = 'Collapse';

    var BTN_CART_ARIA_LABEL_ADD = 'Add to cart';
    var BTN_CART_ARIA_LABEL_REMOVE = 'Remove from cart';

    var COURSE_ACTIONS_ARIA_LABEL = function (code) {
      return 'Actions for cousre ' + code;
    };

    return {
      templateUrl: 'common/ds_subject.tpl.html',
      restrict: 'E',
      scope: {
        subject: '=',
        courses: '=',
        expanded: '=',
        addedToCart: '='
      },
      link: function postLink(scope, element, attrs) {
        var actionsElem = element.find('.actions');
        var chevronElem = actionsElem.find('.chevron');
        var btnCartElem = actionsElem.find('.btn-cart');

        // array of deregisteration functions for $watch listener
        var deregFns = [];
        var deregFn;

        deregFn = scope.$watch('subject', function (subject) {
          if (!subject) {
            element.removeData('id');
            actionsElem.removeAttr('aria-label');
          } else {
            element.data('id', subject.id);
            actionsElem.attr('aria-label', SUBJECT_ACTIONS_ARIA_LABEL(subject.code));
          }
        });
        deregFns.push(deregFn);

        deregFn = scope.$watchCollection(
          'courses',
          function (courses, _, scope) {
            scope.courseAddedToCart = {};
            // TODO: populate scope.courseAddedToCart by querying ClassCart
            element.find('.courses > .course').each(function (index, courseElem) {
              var course = courses[index];
              courseElem = angular.element(courseElem);
              courseElem.data('id', course.id);
              courseElem.find('.actions').attr('aria-label', COURSE_ACTIONS_ARIA_LABEL(course.code));
            });
          }
        );
        deregFns.push(deregFn);

        deregFn = scope.$watch('expanded', function (expanded) {
          var ariaLabel = expanded ?
              CHEVRON_ARIA_LABEL_COLLAPSE :
              CHEVRON_ARIA_LABEL_EXPAND;
          chevronElem.attr('aria-label', ariaLabel);
        });
        deregFns.push(deregFn);

        deregFn = scope.$watch('addedToCart', function (addedToCart) {
          var ariaLabel = addedToCart ?
              BTN_CART_ARIA_LABEL_REMOVE :
              BTN_CART_ARIA_LABEL_ADD;
          btnCartElem.attr('aria-label', ariaLabel);
        });
        deregFns.push(deregFn);

        element.on('$destroy', function () {
          angular.forEach(deregFns, function (deregFn) {
            deregFn();
          });
        });
      }
    };
  });
