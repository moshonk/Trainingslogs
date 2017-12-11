angular.module('resources.departments', ['services.utilities'])

.factory('Departments', ['$filter', '$q', 'TermStoreService', function ($filter, $q, TermStoreService) {

    const DEPARTMENTS_TERMSET_GUID = '29099b0e-7913-4334-9923-037e136bd3ac';

    var Departments = {};

    var departmentsList = null;

    Departments.fetchAll = function () {

        var deferred = $q.defer();

        if (departmentsList === null) {

            departmentsList = [];

            TermStoreService.loadTerms(DEPARTMENTS_TERMSET_GUID).then(function (termsData) {

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

        var defer = $q.defer();

        if (!department.id) {

            TermStoreService.addTerm(department.title, DEPARTMENTS_TERMSET_GUID).then(function (response) {

                department.id = response.Id;

                departmentsList.push(department);

                defer.resolve(department)

            }).catch(function (error) {

                defer.reject(error);

            });

        }

        return defer.promise;

    };

    Departments.remove = function (department) {

        var deferred = $q.defer();

        TermStoreService.removeTerm(DEPARTMENTS_TERMSET_GUID, department.id).then(function () {

            _.remove(departmentsList, { id: department.id });

            deferred.resolve(departmentsList);

        }).catch(function (error) {

            deferred.reject(error)

        });

        return deferred.promise;

    };

    return Departments;

}]);
