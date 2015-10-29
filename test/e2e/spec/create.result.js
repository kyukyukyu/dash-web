'use strict';

var HttpBackend = require('http-backend-proxy');
var mockCampuses = require('../../mock/campuses');
var mockDepartments = require('../../mock/departments');
var mockGenEduCategories = require('../../mock/gen_edu_categories');
var mockCourses = require('../../mock/courses');

var SearchResultBox = require('../page/create/search_result_box');
var CourseCartBox = require('../page/create/course_cart_box');
var CreateResultBox = require('../page/create/create_result_box');
var Timetable = require('../page/widgets/ds_timetable');

describe('Create Section - Generation Result', function () {

  var proxy;

  beforeEach(function () {
    // Load catalog fixtures.
    proxy = new HttpBackend(browser);
    mockCampuses(proxy.onLoad);
    mockDepartments(proxy.onLoad);
    mockGenEduCategories(proxy.onLoad);
    mockCourses(proxy.onLoad);
    browser.get('index_e2e.html');
  });

  beforeEach(function () {
    // Locate UI components for configuration.
    var keywordBox = element(by.model('userInput.keyword'));
    var searchResultBox = new SearchResultBox($('.box-search-result'));
    var backdrop = $('#dsBackdrop');
    var courseCartBox = new CourseCartBox($('.box-course-cart'));

    // Search courses and generate timetables.
    var subject;
    keywordBox.click();
    keywordBox.sendKeys(protractor.Key.ENTER);
    subject = searchResultBox.getSubjectAt(0);
    subject.clickCartButton();
    subject.clickVerticalBar();   // Set optional.
    subject = searchResultBox.getSubjectAt(1);
    subject.clickCartButton();
    subject = searchResultBox.getSubjectAt(2);
    subject.clickCartButton();
    subject = searchResultBox.getSubjectAt(3);
    subject.clickCartButton();
    backdrop.click();
    courseCartBox.clickGenerateButton();
    browser.waitForAngular();
  });

  // Page object for timetable on the left column.
  var ttLeftCol;
  // Page object for generation result box.
  var genResBox;
  /*
  // Expected list of timetables. Each of timetables is represented as a list
  // of course IDs.
  var expectedTimetables = [
    [3, 4],   // 1
    [1, 3, 4], [2, 3, 4], [3, 4, 5],    // 3
    [2, 3, 4, 5]  // 1
  ];
  */

  beforeEach(function () {
    // Locate UI components for timetable generation results.
    ttLeftCol = new Timetable($('ds-timetable'));
    genResBox = new CreateResultBox($('.box-create-result'));
  });

  it('should show the list of generated timetables', function () {
    // List of expected timetable information.
    var expectedTimetableInfos = [
      {
        credits: '6.00',
        nClassDays: '4',  // 2, 3, 4, 5
        nFreeHours: '0.0'
      },
      {
        credits: '8.00',
        nClassDays: '4',  // 2, 3, 4, 5
        nFreeHours: '3.0'
      },
      {
        credits: '9.00',
        nClassDays: '4',  // 2, 3, 4, 5
        nFreeHours: '5.0'
      },
      {
        credits: '9.00',
        nClassDays: '4',  // 2, 3, 4, 5
        nFreeHours: '4.5'
      },
      {
        credits: '11.00',
        nClassDays: '4',  // 2, 3, 4, 5
        nFreeHours: '7.5'
      }
    ];
    expect(genResBox.nTimetables).toBe(expectedTimetableInfos.length);
    for (var i = 0; i < expectedTimetableInfos.length; ++i) {
      // Item in timetable list.
      var ttListItem = genResBox.getItemAt(i);
      // Expected timetable information.
      var expectedTtInfo = expectedTimetableInfos[i];
      expect(ttListItem.credits).toEqual(expectedTtInfo.credits);
      expect(ttListItem.nClassDays).toEqual(expectedTtInfo.nClassDays);
      expect(ttListItem.nFreeHours).toEqual(expectedTtInfo.nFreeHours);
    }
  });

  afterEach(function () {
    proxy.onLoad.reset();
  });

});
