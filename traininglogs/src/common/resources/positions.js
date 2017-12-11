angular.module('resources.positions', ['services.utilities'])

.factory('Positions', ['$filter', '$q', 'TermStoreService', function ($filter, $q, TermStoreService) {

    var Positions = {};

    var positionsList = null;

    const POSITIONS_TERMSET_GUID = '0ffadd5f-1a33-41cf-8c95-1dc482e1f6e0';

    Positions.fetchAll = function () {

        var deferred = $q.defer();

        if (positionsList === null || positionsList.length === 0) {

            positionsList = [];

            TermStoreService.loadTerms(POSITIONS_TERMSET_GUID).then(function (termsData) {

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

        var defer = $q.defer();

        if (!position.id) {

            TermStoreService.addTerm(position.title, POSITIONS_TERMSET_GUID).then(function (response) {

                position.id = response.Id;

                positionsList.push(position);

                defer.resolve(position)

            }).catch(function (error) {

                defer.reject(error);

            });

        }

        return defer.promise;

    };

    Positions.remove = function (position) {

        var deferred = $q.defer();

        TermStoreService.removeTerm(POSITIONS_TERMSET_GUID, position.id).then(function () {

            _.remove(positionsList, { id: position.id });

            deferred.resolve(positionsList);

        }).catch(function (error) {

            deferred.reject(error)

        });

        return deferred.promise;

    };

    return Positions;

}]);
