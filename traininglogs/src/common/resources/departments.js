angular.module('resources.departments', ['services.utilities'])

.factory('Departments', ['$filter', '$q', 'ShptCsomService', function ($filter, $q, ShptCsomService) {

    var Departments = {};

    var departmentsList = null;

    Departments.fetchAll = function () {

        var deferred = $q.defer();

        if (departmentsList === null) {

            departmentsList = [];

            ShptCsomService.loadTerms('29099b0e-7913-4334-9923-037e136bd3ac').then(function (termsData) {

                angular.forEach(termsData, function (v, k) {
                    departmentsList.push({ id: v.ID, title: v.Name });
                });
                deferred.resolve(departmentsList);

            }).catch(function (response) {

                deferred.reject(response);

            });

        } else {

            deferred.resolve(departmentsList);

        }

        return deferred.promise;

    };

    Departments.fetchById = function (id) {

        Departments.fetchAll().then(function () {

            var returnedDepartments = $filter('filter')(departmentsList, { id: id });

            $q.defer().resolve(returnedDepartments[0]);

        });

        return $q.defer().promise

    };

    Departments.addDepartment = function (department) {

        departmentsList.push(department);

    };

    return Departments;

}]);
