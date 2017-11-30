angular.module('resources.positions', ['services.utilities'])

.factory('Positions', ['$filter', '$q', 'ShptCsomService', function ($filter, $q, ShptCsomService) {

    var Positions = {};

    var positionsList = null;

    Positions.fetchAll = function () {

        var deferred = $q.defer();

        if (positionsList === null) {

            positionsList = [];

            ShptCsomService.loadTerms('0ffadd5f-1a33-41cf-8c95-1dc482e1f6e0').then(function (termsData) {

                angular.forEach(termsData, function (v, k) {
                    positionsList.push({ id: v.ID, title: v.Name });
                });
                deferred.resolve(positionsList);

            }).catch(function (response) {

                deferred.reject(response);

            });

        } else {

            deferred.resolve(positionsList);

        }

        return deferred.promise;

    };

    Positions.fetchById = function (id) {

        Positions.fetchAll();

        var returnedPositions = $filter('filter')(positionsList, { id: id });

        return returnedPositions[0];

    };

    Positions.addPosition = function (position) {

        positionsList.push(position);

    };

    return Positions;

}]);
