angular.module('resources.people', ['resources.departments', 'resources.positions', 'resources.locations', 'services.utilities'])

.factory('People', ['$filter', '$log', '$q', '$dialogAlert', 'ShptRestService', 'ShptCsomService', 'Departments', 'Positions', 'Locations', function ($filter, $log, $q, $dialogAlert, ShptRestService, ShptCsomService, Departments, Positions, Locations) {

    var People = {};

    var peopleList = null;

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
                        position: {title: v.EmploymentPosition.Label, id: v.EmploymentPosition.Wssid, guid: v.EmploymentPosition.TermGuid},
                        department: { title: v.KwtrpDepartment.Label, id: v.KwtrpDepartment.Wssid, guid: v.KwtrpDepartment.TermGuid },
                        location: { title: v.KWTRPLocation.Label, id: v.KWTRPLocation.Wssid, guid: v.KWTRPLocation.TermGuid }
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

            var returnedPeople = $filter('filter')(peopleList, { id: id });
            deferred.resolve(returnedPeople[0]);
        });
        
        return deferred.promise;

    };

    People.fetchByDepartment = function (department) {

        People.fetchAll();

        return _.filter(peopleList, function (thatPerson) {

            return thatPerson.department == department;

        });

    };

    People.addPerson = function (person) {

        peopleList.push(person);

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

    return People;

}]);
