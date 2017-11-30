angular.module('resources.attendances', ['resources.people', 'services.utilities'])

.factory('Attendances', ['$filter', '$q', 'ArrayUtils', 'People', function ($filter, $q, ArrayUtils, People) {

    var Attendances = {};

    var AttendanceList = null;

    /*
    *Get all training attendances
    *@returns {array} person - Array of training attendances
    */
    Attendances.fetchAll = function () {
        
        var deferred = $q.defer();
        
        if (AttendanceList === null) {

            AttendanceList = [];
            
            People.fetchAll().then(function (people) {
                
                AttendanceList.push(
                    { id: 1, attendee: _.find(people, { id: 1 }), remarks: 'Excellent', traininglogId: 1, trainingId: 1 },
                    { id: 2, attendee: _.find(people, { id: 2 }), remarks: 'Excellent', traininglogId: 2, trainingId: 2 }
                );
                
                deferred.resolve(AttendanceList);
            });

        }

        return deferred.promise;

    };

    /*
    *Get attendance by transaction id
    *@param {integer} id - Training Attendee Id
    *@returns {object} TrainingAttendance - A training attendance
    */
    Attendances.fetchById = function (id) {

        Attendances.fetchAll();

        var returnedAttendances = $filter('filter')(AttendanceList, { id: id });

        return returnedAttendance[0];

    };

    /*
    *Get attendances filtered by Training Log Id
    *@param {integer} id - Training Log Id
    *@returns {array} person - A training attendance
    */
    Attendances.fetchByTraininglogId = function (id) {

        Attendances.fetchAll();

        var returnedAttendances = $filter('filter')(AttendanceList, { traininglogId: id });

        return returnedAttendances;

    };

    /*
    *Get attendances filtered by Training Id
    *@param {integer} id - The Training Id
    *@returns {object} trainingattendance - A training attendance
    */
    Attendances.fetchByTrainingId = function (id) {

        Attendances.fetchAll();

        var returnedAttendances = $filter('filter')(AttendanceList, { trainingId: id });

        return returnedAttendance[0];

    };

    /*
    *Get attendances filtered by a provided criteria
    *@param {object} filterCriteria - The filter criteria
    *@returns {array} trainingattendance - array of Training attendances
    */
    Attendances.fetch = function (filterCriteria) {

        if (angular.isObject(filterCriteria)) {

            Attendances.fetchAll();

            var returnedAttendances = $filter('filter')(AttendanceList, filterCriteria);

            return returnedAttendances;

        }

    };

    Attendances.addAttendee = function (traininglog) {

        traininglog.attendance.id = 1;

        traininglog.attendance.traininglogId = traininglog.id;

        AttendanceList.push(traininglog.attendance);

        //TODO Persist to DB
    };

    Attendances.updateAttendee = function (traininglog) {

        ArrayUtils.updateByAttr(AttendanceList, 'id', traininglog.attendance.id, traininglog.attendance);

        //TODO Persist to DB

    };

    Attendances.removeAttendee = function (traininglog, attendee) {

        var matchingPerson = _.find(traininglog.attendances, function (thatAttendee) {

            return thatAttendee.id == attendee.id;

        });

        traininglog.attendances = _.without(traininglog.attendances, matchingPerson);

        //TODO Persist removal to database

    };

    return Attendances;

}]);
