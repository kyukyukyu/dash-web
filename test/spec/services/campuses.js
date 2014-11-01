'use strict';

describe('Service: Campuses', function () {
  /* jshint unused: false */

  // load the service's module
  beforeEach(module('dashApp'));

  // instantiate service
  var $httpBackend, Campuses;
  beforeEach(inject(function (_$httpBackend_, _Campuses_) {
    $httpBackend = _$httpBackend_;
    Campuses = _Campuses_;
  }));

  // mock campus data
  var mockCampuses = [{
      id: 1,
      name: 'HYU Seoul',
      code: 'H3',
      created_at: '2014-09-12T22:29:00+09:00',
      departments: [{
        id: 1,
        name: 'Division of Computer Science and Engineering',
        code: 'H002866',
        created_at: '2014-09-12T22:35:00+09:00',
        campus_id: 1,
      }, {
        id: 2,
        name: 'Department of Information System',
        code: 'H002867',
        created_at: '2014-09-12T22:39:00+09:00',
        campus_id: 1,
      }],
    }, {
      id: 2,
      name: 'HYU ERICA',
      code: 'E3',
      created_at: '2014-09-12T22:30:00+09:00',
      departments: [{
        id: 3,
        name: 'Department of Computer Science and Engineering',
        code: 'Y000383',
        created_at: '2014-09-12T22:44:00+09:00',
        campus_id: 2,
      }, {
        id: 4,
        name: 'Division of Advertising & Public Relations',
        code: 'Y000490',
        created_at: '2014-09-13T01:06:00+09:00',
        campus_id: 2,
      }],
    },
  ];
});
