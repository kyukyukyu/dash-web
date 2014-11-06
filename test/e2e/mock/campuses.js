var mockCampuses = require('../../mock/campuses.json');

module.exports = {
  request: {
    path: '/api/campuses',
    method: 'GET'
  },
  response: {
    data: mockCampuses
  }
};
