'use strict';

var HttpBackend = require('http-backend-proxy');
var mockCampuses = require('../../mock/campuses');
var mockDepartments = require('../../mock/departments');
var mockGenEduCategories = require('../../mock/gen_edu_categories');
var mockCourses = require('../../mock/courses');

var NavBar = require('../page/common/navbar');
var SearchOptionBox = require('../page/create/search_option_box');
var SearchResultBox = require('../page/create/search_result_box');
var CourseCartBox = require('../page/create/course_cart_box');

describe('Main', function () {

  var proxy;

  var navbar,
    keywordBox, gearIcon,
    searchOptionBox,
    searchResultBox,
    courseCartBox,
    backdrop;

  beforeEach(function () {
    proxy = new HttpBackend(browser);
    mockCampuses(proxy.onLoad);
    mockDepartments(proxy.onLoad);
    mockGenEduCategories(proxy.onLoad);
    mockCourses(proxy.onLoad);
    browser.get('index_e2e.html');
  });

  beforeEach(function () {
    navbar = new NavBar();

    keywordBox = element(by.model('userInput.keyword'));
    gearIcon = $('.box-group-top button');

    searchOptionBox = new SearchOptionBox($('.box-group-bottom .box-search-option'));
    searchResultBox = new SearchResultBox($('.box-group-bottom .box-search-result'));
    courseCartBox = new CourseCartBox($('.box-group-bottom .box-course-cart'));

    backdrop = $('#dsBackdrop');
  });

  it('should automatically redirect to / when location hash is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch('/');
  });

  describe('searching', function () {
    describe('keyword box', function () {
      beforeEach(function () {
        expect(searchOptionBox.elem.isDisplayed()).toBeFalsy();
        expect(backdrop.isPresent()).toBeFalsy();
      });

      describe('when element is focused', function () {
        it('should open option box with backdrop when the keyword box is focused', function () {
          keywordBox.click();
        });

        it('should open option box with backdrop when the gear icon is clicked', function () {
          gearIcon.click();
        });

        afterEach(function () {
          expect(searchOptionBox.elem.isDisplayed()).toBeTruthy();
          expect(backdrop.isPresent()).toBeTruthy();
        });
      });

      it('should hide backdrop and boxes when backdrop is clicked', function () {
        keywordBox.click();
        backdrop.click();
        expect(backdrop.isPresent()).toBeFalsy();
        expect(searchOptionBox.elem.isDisplayed()).toBeFalsy();
      });

      describe('toggling option box', function () {
        it('should toggle option box with gear icon', function () {
          keywordBox.click();
          gearIcon.click();
          expect(searchOptionBox.elem.isDisplayed()).toBeFalsy();
          gearIcon.click();
          expect(searchOptionBox.elem.isDisplayed()).toBeTruthy();
        });

        it('should preserve status of option box even if keyword box is focused out', function () {
          keywordBox.click();
          gearIcon.click();
          expect(searchOptionBox.elem.isDisplayed()).toBeFalsy();
          backdrop.click();
          keywordBox.click();
          expect(searchOptionBox.elem.isDisplayed()).toBeFalsy();
        });
      });
    });

    describe('search options', function () {
      beforeEach(function () {
        gearIcon.click();
      });

      it('should show no other options than course type at first', function () {
        expect(searchOptionBox.btnGroupGrade.isDisplayed()).toBeFalsy();
      });

      it('should show options related to major courses when type option is set to major', function () {
        var selectBoxDepartment = searchOptionBox.selectBoxDepartment;
        searchOptionBox.setType(searchOptionBox.TYPE_MAJOR);
        expect(searchOptionBox.btnGroupGrade.isDisplayed()).toBeTruthy();
        expect(selectBoxDepartment.isDisplayed()).toBeTruthy();
        expect(selectBoxDepartment.$('option:checked').getText()).toEqual('(All)');
        expect(selectBoxDepartment.$$('option').count()).toBe(1 + 11);
        expect(searchOptionBox.selectBoxCategory.isDisplayed()).toBeFalsy();
      });

      it('should show options related to general courses when type option is set to general', function () {
        var selectBoxCategory = searchOptionBox.selectBoxCategory;
        searchOptionBox.setType(searchOptionBox.TYPE_GENERAL);
        expect(selectBoxCategory.isDisplayed()).toBeTruthy();
        expect(selectBoxCategory.$('option:checked').getText()).toEqual('(All)');
        expect(selectBoxCategory.$$('option').count()).toBe(1 + 4);
        expect(searchOptionBox.btnGroupGrade.isDisplayed()).toBeFalsy();
        expect(searchOptionBox.selectBoxDepartment.isDisplayed()).toBeFalsy();
      });
    });

    it('should show result box only after retrieving search results', function () {
      keywordBox.click();
      expect(searchResultBox.elem.isDisplayed()).toBeFalsy();
      keywordBox.sendKeys('software engineering', protractor.Key.ENTER);
      expect(searchResultBox.elem.isDisplayed()).toBeTruthy();
    });

    describe('result box', function () {

      beforeEach(function () {
        keywordBox.click();
        keywordBox.sendKeys('software engineering', protractor.Key.ENTER);
      });

      it('should show search results', function () {
        var subject, course;
        expect(searchResultBox.numOfSubjects).toBe(4);

        subject = searchResultBox.getSubjectAt(0);
        expect(subject.verticalBarBgColor)
          .toEqual(subject.VERTICAL_BAR_COLOR.UNAVAILABLE);
        expect(subject.code).toEqual('CSE4006');
        expect(subject.name).toEqual('Software Engineering');
        expect(subject.credit).toEqual('3.00');
        expect(subject.numOfCourses).toBe(2);
        course = subject.getCourseAt(0);
        expect(course.code).toEqual('10029');
        expect(course.instructor).toEqual('Minsoo Ryu');
        course = subject.getCourseAt(1);
        expect(course.code).toEqual('10030');
        expect(course.instructor).toEqual('IN RYU');
      });

      it('should be able to expand and collapse list of courses', function () {
        var subject, chevron, coursesElem;
        subject = searchResultBox.getSubjectAt(0);
        chevron = subject.chevron;
        coursesElem = subject.coursesElem;

        expect(coursesElem.isDisplayed()).toBeTruthy();
        chevron.click();
        expect(coursesElem.isDisplayed()).toBeFalsy();
        chevron.click();
        expect(coursesElem.isDisplayed()).toBeTruthy();
      });

      it('should be able to add and remove all courses of a subject to/from course cart', function () {
        var subjectInResult;
        var subjectInCart;
        subjectInResult = searchResultBox.getSubjectAt(0);

        expect(subjectInResult.verticalBarBgColor).toEqual(subjectInResult.VERTICAL_BAR_COLOR.UNAVAILABLE);

        subjectInResult.clickCartButton();
        expect(subjectInResult.verticalBarBgColor).toEqual(subjectInResult.VERTICAL_BAR_COLOR.REQUIRED);
        expect(courseCartBox.numOfSubjects).toBe(1);
        subjectInCart = courseCartBox.getSubjectAt(0);
        expect(subjectInCart.code).toEqual(subjectInResult.code);
        for (var i = 0; i < subjectInCart.numOfCourses; ++i) {
          expect(subjectInCart.getCourseAt(i).code).toEqual(subjectInResult.getCourseAt(i).code);
        }

        subjectInResult.clickCartButton();
        expect(subjectInResult.verticalBarBgColor).toEqual(subjectInResult.VERTICAL_BAR_COLOR.UNAVAILABLE);
        expect(courseCartBox.numOfSubjects).toBe(0);
      });

      it('should be able to add and remove single course to/from course cart', function () {
        var subjectInResult, courseInResult;
        var subjectInCart;
        subjectInResult = searchResultBox.getSubjectAt(0);

        expect(subjectInResult.verticalBarBgColor).toEqual(subjectInResult.VERTICAL_BAR_COLOR.UNAVAILABLE);

        // add the first course
        courseInResult = subjectInResult.getCourseAt(0);
        courseInResult.clickCartButton();

        // check course cart
        subjectInCart = courseCartBox.getSubjectAt(0);
        expect(subjectInResult.verticalBarBgColor).toEqual(subjectInResult.VERTICAL_BAR_COLOR.REQUIRED);
        expect(courseCartBox.numOfSubjects).toBe(1);
        expect(subjectInCart.code).toEqual(subjectInResult.code);
        expect(subjectInCart.numOfCourses).toBe(1);
        expect(subjectInCart.getCourseAt(0).code).toEqual(courseInResult.code);

        // add the second course
        courseInResult = subjectInResult.getCourseAt(1);
        courseInResult.clickCartButton();

        // check course cart
        expect(subjectInResult.verticalBarBgColor).toEqual(subjectInResult.VERTICAL_BAR_COLOR.REQUIRED);
        expect(courseCartBox.numOfSubjects).toBe(1);
        expect(subjectInCart.code).toEqual(subjectInResult.code);
        expect(subjectInCart.numOfCourses).toBe(2);
        expect(subjectInCart.getCourseAt(1).code).toEqual(courseInResult.code);

        // remove the second course
        courseInResult.clickCartButton();
        expect(subjectInResult.verticalBarBgColor).toEqual(subjectInResult.VERTICAL_BAR_COLOR.REQUIRED);
        expect(courseCartBox.numOfSubjects).toBe(1);
        expect(subjectInCart.numOfCourses).toBe(1);

        // remove the first course
        courseInResult = subjectInResult.getCourseAt(0);
        courseInResult.clickCartButton();
        expect(subjectInResult.verticalBarBgColor).toEqual(subjectInResult.VERTICAL_BAR_COLOR.UNAVAILABLE);
        expect(courseCartBox.numOfSubjects).toBe(0);
      }, 45000);

      it('should set the course group required or optional when one is created in course cart', function () {
        var subjectInResult;
        var subjectInCart;

        function assertSubject(subjectInResult, subjectInCart, colorBefore, colorAfter) {
          expect(subjectInResult.verticalBarBgColor).toEqual(colorBefore);

          subjectInResult.clickCartButton();

          expect(subjectInResult.verticalBarBgColor).toEqual(colorAfter);
          expect(subjectInCart.verticalBarBgColor).toEqual(colorAfter);
        }

        // add courses of the first subject
        subjectInResult = searchResultBox.getSubjectAt(0);
        subjectInCart = courseCartBox.getSubjectAt(0);
        assertSubject(
          subjectInResult,
          subjectInCart,
          subjectInResult.VERTICAL_BAR_COLOR.UNAVAILABLE,
          subjectInResult.VERTICAL_BAR_COLOR.REQUIRED
        );

        // add courses of the fourth subject
        subjectInResult = searchResultBox.getSubjectAt(3);
        subjectInCart = courseCartBox.getSubjectAt(1);
        assertSubject(
          subjectInResult,
          subjectInCart,
          subjectInResult.VERTICAL_BAR_COLOR.UNAVAILABLE,
          subjectInResult.VERTICAL_BAR_COLOR.OPTIONAL
        );
      });

      it('should be able to create a course group in cart and set this ' +
         'required or optional by clicking vertical bars', function () {
        var subjectInResult;
        var subjectInCart;

        function assertSubject(subjectInResult, subjectInCart, colorBefore, colorAfter) {
          expect(subjectInResult.verticalBarBgColor).toEqual(colorBefore);

          subjectInResult.clickVerticalBar();

          expect(subjectInResult.verticalBarBgColor).toEqual(colorAfter);
          expect(subjectInCart.verticalBarBgColor).toEqual(colorAfter);
        }

        // add courses of the first subject
        subjectInResult = searchResultBox.getSubjectAt(0);
        subjectInCart = courseCartBox.getSubjectAt(0);
        assertSubject(
          subjectInResult,
          subjectInCart,
          subjectInResult.VERTICAL_BAR_COLOR.UNAVAILABLE,
          subjectInResult.VERTICAL_BAR_COLOR.REQUIRED
        );

        // add courses of the fourth subject
        subjectInResult = searchResultBox.getSubjectAt(3);
        subjectInCart = courseCartBox.getSubjectAt(1);
        assertSubject(
          subjectInResult,
          subjectInCart,
          subjectInResult.VERTICAL_BAR_COLOR.UNAVAILABLE,
          subjectInResult.VERTICAL_BAR_COLOR.OPTIONAL
        );
      });

      it('should be able to switch any course group between required and ' +
         'optional in course cart by clicking vertical bars', function () {
        var subjectInResult, verticalBar;
        var subjectInCart;

        // add courses of the first subject
        subjectInResult = searchResultBox.getSubjectAt(0);
        subjectInCart = courseCartBox.getSubjectAt(0);

        verticalBar = subjectInResult.verticalBar;

        subjectInResult.clickCartButton();

        var colorBefore = subjectInResult.VERTICAL_BAR_COLOR.REQUIRED;
        var colorAfter = subjectInResult.VERTICAL_BAR_COLOR.OPTIONAL;

        expect(subjectInResult.verticalBarBgColor).toEqual(colorBefore);
        expect(subjectInCart.verticalBarBgColor).toEqual(colorBefore);

        subjectInResult.clickVerticalBar();

        expect(subjectInResult.verticalBarBgColor).toEqual(colorAfter);
        expect(subjectInCart.verticalBarBgColor).toEqual(colorAfter);

        subjectInResult.clickVerticalBar();

        expect(subjectInResult.verticalBarBgColor).toEqual(colorBefore);
        expect(subjectInCart.verticalBarBgColor).toEqual(colorBefore);
      });

    });
  });

  // TODO: test course cart
  describe('managing course cart', function () {

    function openResultBox() {
      expect(backdrop.isElementPresent()).toBeFalsy();
      keywordBox.click();
    }

    function closeResultBox() {
      expect(backdrop.isDisplayed()).toBeTruthy();
      backdrop.click();
    }

    beforeEach(function () {
      keywordBox.click();
      keywordBox.sendKeys('software engineering', protractor.Key.ENTER);

      var subject;

      subject = searchResultBox.getSubjectAt(0);
      subject.clickCartButton();

      subject = searchResultBox.getSubjectAt(1);
      subject.clickCartButton();

      closeResultBox();
    });

    it('should be able to expand or collapse the list of courses using chevron button', function () {
      var subjectInCart, chevron, coursesElem;

      subjectInCart = courseCartBox.getSubjectAt(0);
      chevron = subjectInCart.chevron;
      coursesElem = subjectInCart.coursesElem;

      expect(coursesElem.isDisplayed()).toBeTruthy();
      chevron.click();
      expect(coursesElem.isDisplayed()).toBeFalsy();
      chevron.click();
      expect(coursesElem.isDisplayed()).toBeTruthy();

      subjectInCart = courseCartBox.getSubjectAt(1);
      chevron = subjectInCart.chevron;
      coursesElem = subjectInCart.coursesElem;

      expect(coursesElem.isDisplayed()).toBeTruthy();
      chevron.click();
      expect(coursesElem.isDisplayed()).toBeFalsy();
      chevron.click();
      expect(coursesElem.isDisplayed()).toBeTruthy();
    });

    it('should be able to remove subjects from course cart', function () {
      var subjectInCart;
      var subjectInResult;

      subjectInCart = courseCartBox.getSubjectAt(0);
      subjectInCart.clickCartButton();
      expect(courseCartBox.numOfSubjects).toBe(1);

      openResultBox();
      subjectInResult = searchResultBox.getSubjectAt(0);
      expect(subjectInResult.verticalBarBgColor)
        .toEqual(subjectInResult.VERTICAL_BAR_COLOR.UNAVAILABLE);
      subjectInResult = searchResultBox.getSubjectAt(1);
      expect(subjectInResult.verticalBarBgColor)
        .toEqual(subjectInResult.VERTICAL_BAR_COLOR.REQUIRED);

      closeResultBox();
      subjectInCart = courseCartBox.getSubjectAt(0);
      subjectInCart.clickCartButton();
      expect(courseCartBox.numOfSubjects).toBe(0);

      openResultBox();
      subjectInResult = searchResultBox.getSubjectAt(1);
      expect(subjectInResult.verticalBarBgColor)
        .toEqual(subjectInResult.VERTICAL_BAR_COLOR.UNAVAILABLE);
    });

    it('should be able to remove courses from course cart', function () {
      var subjectInCart, courseInCart;
      var subjectInResult;

      subjectInCart = courseCartBox.getSubjectAt(0);
      courseInCart = subjectInCart.getCourseAt(0);
      courseInCart.clickCartButton();
      expect(subjectInCart.numOfCourses).toBe(1);

      openResultBox();
      subjectInResult = searchResultBox.getSubjectAt(0);
      expect(subjectInResult.verticalBarBgColor)
        .toEqual(subjectInResult.VERTICAL_BAR_COLOR.REQUIRED);
      subjectInResult = searchResultBox.getSubjectAt(1);
      expect(subjectInResult.verticalBarBgColor)
        .toEqual(subjectInResult.VERTICAL_BAR_COLOR.REQUIRED);

      closeResultBox();
      courseInCart = subjectInCart.getCourseAt(0);
      courseInCart.clickCartButton();
      expect(courseCartBox.numOfSubjects).toBe(1);

      openResultBox();
      subjectInResult = searchResultBox.getSubjectAt(0);
      expect(subjectInResult.verticalBarBgColor)
        .toEqual(subjectInResult.VERTICAL_BAR_COLOR.UNAVAILABLE);
      subjectInResult = searchResultBox.getSubjectAt(1);
      expect(subjectInResult.verticalBarBgColor)
        .toEqual(subjectInResult.VERTICAL_BAR_COLOR.REQUIRED);

      closeResultBox();
      subjectInCart = courseCartBox.getSubjectAt(0);
      courseInCart = subjectInCart.getCourseAt(0);
      courseInCart.clickCartButton();
      expect(courseCartBox.numOfSubjects).toBe(0);

      openResultBox();
      subjectInResult = searchResultBox.getSubjectAt(0);
      expect(subjectInResult.verticalBarBgColor)
        .toEqual(subjectInResult.VERTICAL_BAR_COLOR.UNAVAILABLE);
      subjectInResult = searchResultBox.getSubjectAt(1);
      expect(subjectInResult.verticalBarBgColor)
        .toEqual(subjectInResult.VERTICAL_BAR_COLOR.UNAVAILABLE);
    });

    it('should be able to switch required course group to optional one or ' +
       'vice versa by clicking vertical bar', function () {
      var subjectInCart;
      var subjectInResult;

      subjectInCart = courseCartBox.getSubjectAt(0);
      subjectInCart.clickVerticalBar();
      expect(subjectInCart.verticalBarBgColor).toEqual(subjectInCart.VERTICAL_BAR_COLOR.OPTIONAL);
      subjectInCart = courseCartBox.getSubjectAt(1);
      expect(subjectInCart.verticalBarBgColor).toEqual(subjectInCart.VERTICAL_BAR_COLOR.REQUIRED);

      openResultBox();
      subjectInResult = searchResultBox.getSubjectAt(0);
      expect(subjectInResult.verticalBarBgColor).toEqual(subjectInResult.VERTICAL_BAR_COLOR.OPTIONAL);
      subjectInResult = searchResultBox.getSubjectAt(1);
      expect(subjectInResult.verticalBarBgColor).toEqual(subjectInResult.VERTICAL_BAR_COLOR.REQUIRED);

      closeResultBox();
      subjectInCart = courseCartBox.getSubjectAt(0);
      subjectInCart.clickVerticalBar();
      expect(subjectInCart.verticalBarBgColor).toEqual(subjectInCart.VERTICAL_BAR_COLOR.REQUIRED);
      subjectInCart = courseCartBox.getSubjectAt(1);
      expect(subjectInCart.verticalBarBgColor).toEqual(subjectInCart.VERTICAL_BAR_COLOR.REQUIRED);

      openResultBox();
      subjectInResult = searchResultBox.getSubjectAt(0);
      expect(subjectInResult.verticalBarBgColor).toEqual(subjectInResult.VERTICAL_BAR_COLOR.REQUIRED);
      subjectInResult = searchResultBox.getSubjectAt(1);
      expect(subjectInResult.verticalBarBgColor).toEqual(subjectInResult.VERTICAL_BAR_COLOR.REQUIRED);
    });

  });

  afterEach(function () {
    proxy.onLoad.reset();
  });

});
