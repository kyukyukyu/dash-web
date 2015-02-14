/* jshint unused: false */
'use strict';

/**
 * @ngdoc directive
 * @name dashApp.common:dsSubject
 * @description
 * # dsSubject
 */
angular.module('dashApp.common')
  .directive('dsSubject', function ($rootScope, CourseCart) {
    var SUBJECT_ACTIONS_ARIA_LABEL = function (code) {
      return 'Actions for subject ' + code;
    };
    var CHEVRON_ARIA_LABEL_EXPAND = 'Expand';
    var CHEVRON_ARIA_LABEL_COLLAPSE = 'Collapse';

    var BTN_CART_ARIA_LABEL_ADD = 'Add to cart';
    var BTN_CART_ARIA_LABEL_REMOVE = 'Remove from cart';

    var COURSE_ACTIONS_ARIA_LABEL = function (code) {
      return 'Actions for course ' + code;
    };

    return {
      templateUrl: 'common/ds_subject.tpl.html',
      restrict: 'E',
      scope: {
        subject: '=',
        courses: '=',
        expanded: '='
      },
      link: function postLink(scope, element, attrs) {
        var actionsElem = element.find('.actions').not('.courses *');
        var chevronElem = actionsElem.find('.chevron');
        var btnCartElem = actionsElem.find('.btn-cart');

        // This is an object that says which course objects of the subject are in course cart.
        // If a course is in the cart, the ID of course exists as a key with value `true` in this object.
        scope.courseAddedToCart = {};

        // array of deregisteration functions for listener
        var independentDeregFns = [];
        var dependentDeregFns = [];

        var deregFn;

        deregFn = scope.$watch('subject', function (subject, _, scope) {

          // update which course objects of this subject is in course cart
          // and whether the course group of this subject is required
          try {
            scope.courseAddedToCart = {};
            var courseGroup = CourseCart.getCourseGroup(subject.id);
            angular.forEach(courseGroup.courses, function (course) {
              scope.courseAddedToCart[course.id] = true;
            });
            scope.required = courseGroup.required;
          } catch (e) {
            // no course object of this subject is in course cart
            // or subject is falsy
            scope.required = false;
          }

          refreshAllOrNothing(scope);

          // deregister listeners for events occurred by course cart
          angular.forEach(dependentDeregFns, function (deregFn) {
            deregFn();
          });
          dependentDeregFns = [];

          if (!subject) {
            // remove data bound to DOM
            element.removeData('id');
            actionsElem.removeAttr('aria-label');

            return;
          }

          // bind subject data to DOM
          element.data('id', subject.id);
          actionsElem.attr('aria-label', SUBJECT_ACTIONS_ARIA_LABEL(subject.code));

          // register listeners for events occurred by course cart
          var deregFn = $rootScope.$on('changerequiredincart', function (event, subjectId, required) {
            scope.$evalAsync(function (scope) {
              if (scope.subject.id === subjectId) {
                scope.required = required;
              }
            });
          });
          dependentDeregFns.push(deregFn);

        });
        independentDeregFns.push(deregFn);

        deregFn = scope.$watchCollection(
          'courses',
          function (courses, _, scope) {

            refreshAllOrNothing(scope);

            if (!courses) {
              return;
            }

            element.find('.courses > .course').each(function (index) {
              var course = courses[index];
              var courseElem = angular.element(this);
              courseElem.data('id', course.id);
              courseElem.find('.actions').attr('aria-label', COURSE_ACTIONS_ARIA_LABEL(course.code));
            });

          }
        );
        independentDeregFns.push(deregFn);

        deregFn = scope.$watch('expanded', function (expanded) {
          var ariaLabel = expanded ?
              CHEVRON_ARIA_LABEL_COLLAPSE :
              CHEVRON_ARIA_LABEL_EXPAND;
          chevronElem.attr('aria-label', ariaLabel);
        });
        independentDeregFns.push(deregFn);

        deregFn = scope.$watch('allInCart', function (allInCart) {
          var ariaLabel = allInCart ?
              BTN_CART_ARIA_LABEL_REMOVE :
              BTN_CART_ARIA_LABEL_ADD;
          btnCartElem.attr('aria-label', ariaLabel);
        });
        independentDeregFns.push(deregFn);

        // register listeners for events occurred by course cart
        deregFn = $rootScope.$on('addtocart', function (event, course, courseGroup) {
          scope.$evalAsync(function (scope) {
            scope.courseAddedToCart[course.id] = true;
            scope.required = courseGroup.required;
            refreshAllOrNothing(scope);
          });
        });
        independentDeregFns.push(deregFn);

        deregFn = $rootScope.$on('removefromcart', function (event, course) {
          scope.$evalAsync(function (scope) {
            delete scope.courseAddedToCart[course.id];
            refreshAllOrNothing(scope);
          });
        });
        independentDeregFns.push(deregFn);

        function refreshAllOrNothing(scope) {
          var courses = scope.courses || [];
          scope.allInCart = courses.reduce(function (prev, course) {
            return prev && (scope.courseAddedToCart[course.id] === true);
          }, true);
          scope.nothingInCart = courses.reduce(function (prev, course) {
            return prev && (scope.courseAddedToCart[course.id] !== true);
          }, true);
        }

        function btnCartHandler() {
          scope.$apply(function (scope) {
            var task;

            if (scope.allInCart) {
              // remove from cart
              task = function (course) { CourseCart.remove(course); };
            } else {
              // add to cart
              task = function (course) { CourseCart.add(course); };
            }

            angular.forEach(scope.courses, task);
          });
        }

        btnCartElem.click(btnCartHandler);

        function btnCartForCourseHandler() {
          /* jshint -W040 */
          var elem = angular.element(this);
          var scopeByNgRepeat = elem.scope();
          scope.$apply(function (scope) {
            var course = scopeByNgRepeat.course;

            if (scope.courseAddedToCart[course.id]) {
              CourseCart.remove(course);
            } else {
              CourseCart.add(course);
            }
          });
        }

        element.find('.courses').on('click', '.btn-cart', btnCartForCourseHandler);

        element.on('$destroy', function () {
          angular.forEach(independentDeregFns.concat(dependentDeregFns), function (deregFn) {
            deregFn();
          });
        });
      }
    };
  });
