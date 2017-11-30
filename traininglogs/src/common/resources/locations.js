angular.module('resources.locations', ['services.utilities'])

.factory('Locations', ['$filter', '$q', 'ShptCsomService', function ($filter, $q, ShptCsomService) {

    var Locations = {};

    var locationsList = null;

    Locations.fetchAll = function () {
        
        var deferred = $q.defer();

        if (locationsList === null) {

            locationsList = [];

            ShptCsomService.loadTerms('561f2cb0-27c9-4239-955e-c8eac6e7d4e8').then(function (termsData) {

                angular.forEach(termsData, function (v, k) {
                    locationsList.push({ id: v.ID, title: v.Name });
                });
                deferred.resolve(locationsList);

            }).catch(function (response) {

                deferred.reject(response);

            });
            
        } else {

            deferred.resolve(locationsList);

        }

        return deferred.promise;

    };

    Locations.fetchById = function (id) {

        Locations.fetchAll();

        var returnedLocations = $filter('filter')(locationsList, { id: id });

        return returnedLocations[0];

    };

    Locations.addLocation = function (location) {

        locationsList.push(location);

    };

    return Locations;

}]);
