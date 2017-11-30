angular.module('resources.traininglogs', ['resources.trainings', 'resources.attendances', 'services.utilities'])

.factory('TrainingLogs', ['$filter', '$q', 'ArrayUtils', 'Trainings', 'Attendances', 'ShptRestService', function ($filter, $q, ArrayUtils, Trainings, Attendances, ShptRestService) {

    var TrainingLogs = {};

    var logs = null;

    var trainings = null;

    var getLog = function (selectedLog) {

        var returnedLogs = $filter('filter')(logs, { id: selectedLog.id });

        return returnedLogs[0];

    };

    TrainingLogs.fetchAll = function () {

        var deferred = $q.defer();

        if (logs === null) {

            logs = [];

            var promises = [];

            promises.push(Attendances.fetchAll());

            $q.all(promises).then(function (response) {

                var viewXml = '<View><Query></Query></View>';

                attendances = response[0];

                ShptRestService.getListItemsWithCaml('Trainingslog', viewXml).then(function (data) {

                    angular.forEach(data.results, function (v, k) {
                        var traininglog = {};
                        traininglog.id = v.ID;
                        traininglog.startDate = v.StartDate;
                        traininglog.target = v.Target;
                        if (traininglog.target = "selected") {
                            traininglog.targetDepartment = v.TargetDepartment.results;
                        }
                        traininglog.training = { title: v.TrainingTitle.Label, id: v.TrainingTitle.WssId, guid: v.TrainingTitle.TermGuid };
                        traininglog.attendances = _.filter(attendances, { traininglogId: v.ID });

                        //Get the facilitator(s)
                        var queryParams = '$select=Facilitator/ID,Facilitator/Title&$expand=Facilitator&$filter=ID eq ' + traininglog.id;
                        ShptRestService.getListItems('Trainingslog', queryParams).then(function (data) {
                            if (data.results.length > 0) {
                                traininglog.facilitator = [];
                                angular.forEach(data.results[0].Facilitator.results, function (facilitator, key) {
                                    traininglog.facilitator.push({ title: facilitator.Title, id: facilitator.ID });
                                });
                                logs.push(traininglog);
                            }

                            deferred.resolve(logs);

                        });

                    });

                });

            });

        } else {

            deferred.resolve(logs);

        }

        return deferred.promise;;

    }

    TrainingLogs.fetchById = function (id) {

        var deferred = $q.defer();

        TrainingLogs.fetchAll().then(function (logs) {

            var returnedTraininglog = _.find(logs, { id: id });

            deferred.resolve(returnedTraininglog);

        });

        return deferred.promise;

    };

    TrainingLogs.addLog = function (traininglog) {

        logs.push(traininglog);
        //TODO persist to db

    };

    TrainingLogs.updateLog = function (traininglog) {

        ArrayUtils.updateByAttr(AttendanceList, 'id', traininglog.id, traininglog);

        //TODO persist to db;

    };

    TrainingLogs.remove = function (traininglog) {

        ArrayUtils.removeByAttr(logs, 'id', traininglog.id);

    };

    TrainingLogs.addAttendee = function (selectedTraininglog) {

        Attendance.addAttendee(selectedTraininglog);

        selectedTraininglog.attendances.push(selectedTraininglog.attendance);

    };

    TrainingLogs.updateAttendee = function (selectedTraininglog) {

        Attendance.updateAttendee(selectedTraininglog);

    };

    TrainingLogs.removeAttendee = function (selectedTraininglog, attendee) {

        Attendance.removeAttendee(selectedTraininglog, attendee);

    };

    /*
    *Check if person is in the attendance list for a training
    *@param {object} traininglog - Training Log (Contains attendance list)
    *@param {object} person - Person to search for in attendance list
    *@returns {bool} True if person has been registred for training , Faklse if not
    */
    TrainingLogs.isPersonInAttendanceList = function (traininglog, person) {

        var attendanceList = traininglog.attendances;

        var found = _.some(attendanceList, function (attendance) {

            return attendance.attendee.id == person.id;

        });

        return found;

    };

    return TrainingLogs;

}]);
