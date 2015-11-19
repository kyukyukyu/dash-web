(function () {
  /* jshint latedef: nofunc */
  'use strict';

  describe('Controller: GeneratorOptionsCtrl', function () {

    var $scope;
    var TimetableGenerator;
    var GeneratorOptionsCtrl;

    beforeEach(module('dashApp.create'));

    // mock TimetableGenerator
    beforeEach(function () {
      TimetableGenerator = {};
      TimetableGenerator.getOptions = getOptions;
      TimetableGenerator.setOption = jasmine.createSpy('setOption', setOption);

      var options = {
        minCredits: null,
        maxCredits: null,
        minDailyClassCount: null,
        maxDailyClassCount: null,
        minWeeklyClassCount: null,
        maxWeeklyClassCount: null
      };

      function getOptions() {
        return options;
      }

      function setOption(name, value) {
        options[name] = value;
      }
    });

    beforeEach(inject(function ($controller, $rootScope) {
      $scope = $rootScope.$new();
      GeneratorOptionsCtrl = $controller('GeneratorOptionsCtrl as vm', {
        'TimetableGenerator': TimetableGenerator,
        '$scope': $scope
      });
    }));

    // mock methods provided by ui.bootstrap.modal:$modal
    beforeEach(function () {
      $scope.$close = jasmine.createSpy('$close');
      $scope.$dismiss = jasmine.createSpy('$dismiss');
    });

    it('should check if lower bound of credits <= upper bound of credits', function () {
      GeneratorOptionsCtrl.userInput.minCredits = '';
      GeneratorOptionsCtrl.userInput.maxCredits = '';
      expect(GeneratorOptionsCtrl.isValidRange('credits')).toEqual(true);

      GeneratorOptionsCtrl.userInput.minCredits = '';
      GeneratorOptionsCtrl.userInput.maxCredits = '4';
      expect(GeneratorOptionsCtrl.isValidRange('credits')).toEqual(true);

      GeneratorOptionsCtrl.userInput.minCredits = '-2';
      GeneratorOptionsCtrl.userInput.maxCredits = '4';
      expect(GeneratorOptionsCtrl.isValidRange('credits')).toEqual(false);

      GeneratorOptionsCtrl.userInput.minCredits = '2';
      GeneratorOptionsCtrl.userInput.maxCredits = '4';
      expect(GeneratorOptionsCtrl.isValidRange('credits')).toEqual(true);

      GeneratorOptionsCtrl.userInput.minCredits = '8';
      GeneratorOptionsCtrl.userInput.maxCredits = '4';
      expect(GeneratorOptionsCtrl.isValidRange('credits')).toEqual(false);

      GeneratorOptionsCtrl.userInput.minCredits = '8';
      GeneratorOptionsCtrl.userInput.maxCredits = '';
      expect(GeneratorOptionsCtrl.isValidRange('credits')).toEqual(true);

      GeneratorOptionsCtrl.userInput.minCredits = '-8';
      GeneratorOptionsCtrl.userInput.maxCredits = '';
      expect(GeneratorOptionsCtrl.isValidRange('credits')).toEqual(false);
    });

    it('should check if lower/upper bound of credits is valid', function () {
      expect(GeneratorOptionsCtrl.isValidBound('credits', '')).toEqual(true);
      expect(GeneratorOptionsCtrl.isValidBound('credits', '2.5')).toEqual(true);
      expect(GeneratorOptionsCtrl.isValidBound('credits', '2')).toEqual(true);
      expect(GeneratorOptionsCtrl.isValidBound('credits', '-1')).toEqual(false);
    });

    it('should check if lower bound of # of classes/day <= upper bound', function () {
      GeneratorOptionsCtrl.userInput.minDailyClassCount = '';
      GeneratorOptionsCtrl.userInput.maxDailyClassCount = '';
      expect(GeneratorOptionsCtrl.isValidRange('dailyClassCount')).toEqual(true);

      GeneratorOptionsCtrl.userInput.minDailyClassCount = '';
      GeneratorOptionsCtrl.userInput.maxDailyClassCount = '4';
      expect(GeneratorOptionsCtrl.isValidRange('dailyClassCount')).toEqual(true);

      GeneratorOptionsCtrl.userInput.minDailyClassCount = '-2';
      GeneratorOptionsCtrl.userInput.maxDailyClassCount = '4';
      expect(GeneratorOptionsCtrl.isValidRange('dailyClassCount')).toEqual(false);

      GeneratorOptionsCtrl.userInput.minDailyClassCount = '2';
      GeneratorOptionsCtrl.userInput.maxDailyClassCount = '4';
      expect(GeneratorOptionsCtrl.isValidRange('dailyClassCount')).toEqual(true);

      GeneratorOptionsCtrl.userInput.minDailyClassCount = '8';
      GeneratorOptionsCtrl.userInput.maxDailyClassCount = '4';
      expect(GeneratorOptionsCtrl.isValidRange('dailyClassCount')).toEqual(false);

      GeneratorOptionsCtrl.userInput.minDailyClassCount = '8';
      GeneratorOptionsCtrl.userInput.maxDailyClassCount = '';
      expect(GeneratorOptionsCtrl.isValidRange('dailyClassCount')).toEqual(true);

      GeneratorOptionsCtrl.userInput.minDailyClassCount = '-8';
      GeneratorOptionsCtrl.userInput.maxDailyClassCount = '';
      expect(GeneratorOptionsCtrl.isValidRange('dailyClassCount')).toEqual(false);
    });

    it('should check if lower/upper bound of # of classes/day is valid', function () {
      expect(GeneratorOptionsCtrl.isValidBound('dailyClassCount', '')).toEqual(true);
      expect(GeneratorOptionsCtrl.isValidBound('dailyClassCount', '2.5')).toEqual(false);
      expect(GeneratorOptionsCtrl.isValidBound('dailyClassCount', '2')).toEqual(true);
      expect(GeneratorOptionsCtrl.isValidBound('dailyClassCount', '-1')).toEqual(false);
    });

    it('should check if lower bound of # of days w/classes <= upper bound', function () {
      GeneratorOptionsCtrl.userInput.minWeeklyClassCount = '';
      GeneratorOptionsCtrl.userInput.maxWeeklyClassCount = '';
      expect(GeneratorOptionsCtrl.isValidRange('weeklyClassCount')).toEqual(true);

      GeneratorOptionsCtrl.userInput.minWeeklyClassCount = '';
      GeneratorOptionsCtrl.userInput.maxWeeklyClassCount = '4';
      expect(GeneratorOptionsCtrl.isValidRange('weeklyClassCount')).toEqual(true);

      GeneratorOptionsCtrl.userInput.minWeeklyClassCount = '-2';
      GeneratorOptionsCtrl.userInput.maxWeeklyClassCount = '4';
      expect(GeneratorOptionsCtrl.isValidRange('weeklyClassCount')).toEqual(false);

      GeneratorOptionsCtrl.userInput.minWeeklyClassCount = '0';
      GeneratorOptionsCtrl.userInput.maxWeeklyClassCount = '4';
      expect(GeneratorOptionsCtrl.isValidRange('weeklyClassCount')).toEqual(false);

      GeneratorOptionsCtrl.userInput.minWeeklyClassCount = '2';
      GeneratorOptionsCtrl.userInput.maxWeeklyClassCount = '4';
      expect(GeneratorOptionsCtrl.isValidRange('weeklyClassCount')).toEqual(true);

      GeneratorOptionsCtrl.userInput.minWeeklyClassCount = '8';
      GeneratorOptionsCtrl.userInput.maxWeeklyClassCount = '4';
      expect(GeneratorOptionsCtrl.isValidRange('weeklyClassCount')).toEqual(false);

      GeneratorOptionsCtrl.userInput.minWeeklyClassCount = '8';
      GeneratorOptionsCtrl.userInput.maxWeeklyClassCount = '';
      expect(GeneratorOptionsCtrl.isValidRange('weeklyClassCount')).toEqual(false);
    });

    it('should check if lower/upper bound of # of days w/classes is valid', function () {
      expect(GeneratorOptionsCtrl.isValidBound('weeklyClassCount', '')).toEqual(true);
      expect(GeneratorOptionsCtrl.isValidBound('weeklyClassCount', '2.5')).toEqual(false);
      expect(GeneratorOptionsCtrl.isValidBound('weeklyClassCount', '2')).toEqual(true);
      expect(GeneratorOptionsCtrl.isValidBound('weeklyClassCount', '8')).toEqual(false);
      expect(GeneratorOptionsCtrl.isValidBound('weeklyClassCount', '-1')).toEqual(false);
      expect(GeneratorOptionsCtrl.isValidBound('weeklyClassCount', '0')).toEqual(false);
    });

    it('should watch bound values and check their validity', function () {
      $scope.$digest();

      expect(GeneratorOptionsCtrl.validity.range.credits).toEqual(true);
      expect(GeneratorOptionsCtrl.validity.range.dailyClassCount).toEqual(true);
      expect(GeneratorOptionsCtrl.validity.range.weeklyClassCount).toEqual(true);

      GeneratorOptionsCtrl.userInput.minCredits = '2';
      GeneratorOptionsCtrl.userInput.maxCredits = '-1.5';
      GeneratorOptionsCtrl.userInput.minDailyClassCount = '2';
      GeneratorOptionsCtrl.userInput.maxDailyClassCount = '5';
      GeneratorOptionsCtrl.userInput.minWeeklyClassCount = '-1';
      GeneratorOptionsCtrl.userInput.maxWeeklyClassCount = '5';

      $scope.$digest();

      expect(GeneratorOptionsCtrl.validity.range.credits).toEqual(false);
      expect(GeneratorOptionsCtrl.validity.range.dailyClassCount).toEqual(true);
      expect(GeneratorOptionsCtrl.validity.range.weeklyClassCount).toEqual(false);
    });

    it('should save changes and close the modal', function () {
      GeneratorOptionsCtrl.userInput.minCredits = '2';
      GeneratorOptionsCtrl.userInput.maxCredits = '4.5';
      GeneratorOptionsCtrl.userInput.minDailyClassCount = '2';
      GeneratorOptionsCtrl.userInput.maxDailyClassCount = '5';
      GeneratorOptionsCtrl.userInput.minWeeklyClassCount = '1';
      GeneratorOptionsCtrl.userInput.maxWeeklyClassCount = '5';
      GeneratorOptionsCtrl.save();

      expect(TimetableGenerator.setOption).toHaveBeenCalledWith('minCredits', 2);
      expect(TimetableGenerator.setOption).toHaveBeenCalledWith('maxCredits', 4.5);
      expect(TimetableGenerator.setOption).toHaveBeenCalledWith('minDailyClassCount', 2);
      expect(TimetableGenerator.setOption).toHaveBeenCalledWith('maxDailyClassCount', 5);
      expect(TimetableGenerator.setOption).toHaveBeenCalledWith('minWeeklyClassCount', 1);
      expect(TimetableGenerator.setOption).toHaveBeenCalledWith('maxWeeklyClassCount', 5);
      expect($scope.$close).toHaveBeenCalled();
    });

  });
})();
