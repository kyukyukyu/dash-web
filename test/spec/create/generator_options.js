(function () {
  /* jshint latedef: nofunc */
  'use strict';

  describe('Controller: GeneratorOptionsCtrl', function () {

    var TimetableGenerator;
    var GeneratorOptionsCtrl;

    beforeEach(module('dashApp.create'));

    // mock TimetableGenerator
    beforeEach(function () {
      TimetableGenerator = {};
      TimetableGenerator.getOptions = getOptions;

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
    });

    beforeEach(inject(function ($controller) {
      GeneratorOptionsCtrl = $controller('GeneratorOptionsCtrl', {
        'TimetableGenerator': TimetableGenerator
      });
    }));

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

      GeneratorOptionsCtrl.userInput.minWeeklyClassCount = '2';
      GeneratorOptionsCtrl.userInput.maxWeeklyClassCount = '4';
      expect(GeneratorOptionsCtrl.isValidRange('weeklyClassCount')).toEqual(true);

      GeneratorOptionsCtrl.userInput.minWeeklyClassCount = '8';
      GeneratorOptionsCtrl.userInput.maxWeeklyClassCount = '4';
      expect(GeneratorOptionsCtrl.isValidRange('weeklyClassCount')).toEqual(false);

      GeneratorOptionsCtrl.userInput.minWeeklyClassCount = '8';
      GeneratorOptionsCtrl.userInput.maxWeeklyClassCount = '';
      expect(GeneratorOptionsCtrl.isValidRange('weeklyClassCount')).toEqual(true);
    });

    it('should check if lower/upper bound of # of days w/classes is valid', function () {
      expect(GeneratorOptionsCtrl.isValidBound('weeklyClassCount', '')).toEqual(true);
      expect(GeneratorOptionsCtrl.isValidBound('weeklyClassCount', '2.5')).toEqual(false);
      expect(GeneratorOptionsCtrl.isValidBound('weeklyClassCount', '2')).toEqual(true);
      expect(GeneratorOptionsCtrl.isValidBound('weeklyClassCount', '8')).toEqual(false);
      expect(GeneratorOptionsCtrl.isValidBound('weeklyClassCount', '-1')).toEqual(false);
    });
  });
})();
