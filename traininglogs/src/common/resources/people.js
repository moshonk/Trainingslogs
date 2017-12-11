angular.module('resources.people', ['resources.departments', 'resources.positions', 'resources.locations', 'services.utilities'])

.factory('People', ['$filter', '$log', '$q', '$dialogAlert', 'ShptRestService', 'TermStoreService', 'ArrayUtils', 'Departments', 'Positions', 'Locations', function ($filter, $log, $q, $dialogAlert, ShptRestService, TermStoreService, ArrayUtils, Departments, Positions, Locations) {

    var People = {};

    var peopleList = null;

    const PEOPLE_LIST_NAME = 'People';

    People.fetchAll = function () {

        var deferred = $q.defer();

        if (peopleList === null) {

            peopleList = [];

            var viewXml = '<View><Query></Query></View>';

            ShptRestService.getListItemsWithCaml('People', viewXml).then(function (data) {

                angular.forEach(data.results, function (v, k) {
                    peopleList.push({
                        id: v.ID,
                        payrollNo: v.PayrollNo,
                        name: v.Title,
                        gender: v.Gender,
                        position: { title: v.EmploymentPosition.Label, id: v.EmploymentPosition.TermGuid },
                        department: { title: v.KwtrpDepartment.Label, id: v.KwtrpDepartment.TermGuid },
                        location: { title: v.KWTRPLocation.Label, id: v.KWTRPLocation.TermGuid }
                    }
                    );
                });

                deferred.resolve(peopleList);

            });

        } else {

            deferred.resolve(peopleList);

        }

        return deferred.promise;

    };

    People.fetchById = function (id) {

        var deferred = $q.defer();

        People.fetchAll().then(function () {

            var returnedPeople = _.find(peopleList, { id: id });

            deferred.resolve(returnedPeople);
        });

        return deferred.promise;

    };

    People.fetchByDepartment = function (department) {

        var deferred = $q.defer();

        People.fetchAll().then(function () {

            deferred.resolve(_.filter(peopleList, function (thatPerson) {

                return thatPerson.department.id == department.id;

            }));

        });

        return deferred.promise;
    };

    People.addPerson = function (person) {

        var defer, data;

        defer = $q.defer();

        data = {
            Title: person.name,
            PayrollNo: person.payrollNo,
            Gender: person.gender,
            KWTRPLocation: {
                "TermGuid": person.location.id,
                "WssId": -1
            },
            KwtrpDepartment: {
                "TermGuid": person.department.id,
                "WssId": -1
            },
            EmploymentPosition: {
                "TermGuid": person.position.id,
                "WssId": -1
            }
        }

        if (!person.id) {

            ShptRestService.createNewListItem(PEOPLE_LIST_NAME, data).then(function (response) {

                person.id = response.Id;

                peopleList.push(person);

                defer.resolve(person)

            }).catch(function (error) {

                defer.reject(error);

            });

        } else {

            ShptRestService.updateListItem(PEOPLE_LIST_NAME, person.id, data).then(function (response) {

                person.id = response.Id;

                //Update PeopleList
                peopleList = ArrayUtils.updateItemInArray(peopleList, person, { id: person.id });

                defer.resolve(person)

            }).catch(function (error) {

                defer.reject(error);

            });

        }

        return defer.promise;

    };

    /*
    *Check if person exists in the people list
    *@param {object} person
    *@returns {bool} true if person found, false if not found
    */
    People.personExists = function (person) {

        return _.some(peopleList, function (thatPerson) {

            thatPerson.id === person.id;

        });

    };

    People.remove = function (person) {

        var deferred = $q.defer();

        ShptRestService.deleteListItem(PEOPLE_LIST_NAME, person.id).then(function () {

            _.remove(peopleList, { id: person.id });

            deferred.resolve(peopleList);

        }).catch(function (error) {

            deferred.reject(error)

        });

        return deferred.promise;

    };

    return People;

}]);
