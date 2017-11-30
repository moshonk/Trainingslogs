angular.module('traininglogs', ['ui.bootstrap.dialogs', 'resources.traininglogs'])

.controller('traininglogsCtrl', ['$scope', '$routeParams', '$filter', '$q', '$dialog', '$window', '$dialogConfirm', '$dialogAlert', '$location', 'TrainingLogs', function ($scope, $routeParams, $filter, $q, $dialog, $window, $dialogConfirm, $dialogAlert, $location, TrainingLogs) {

    $scope.int = function () {

        TrainingLogs.fetchAll().then(function(traininglogs){
        
            $scope.traininglogs = traininglogs;

        });       

        $scope.personFound = -1;

    };

    var traininglogId = $routeParams.id; //Get this value from the browsers querystring

    if (!angular.isUndefined(traininglogId)) { //View existing training log 

        traininglogId = parseInt($routeParams.id);

        TrainingLogs.fetchById(traininglogId).then(function (traininglog) {

            $scope.traininglog = traininglog;

        });

    } else { //Add new Training Log

        $scope.traininglog = {};

    }

    $scope.addTraininglog = function () {

        $scope.traininglog = {};

        $dialog('app/traininglogs/traininglog-add.tpl.html', 'md').then(function (traininglog) {

            //$location.path( "/editTraininglog/" + traininglog.id );

        });

        $location.path("/editTraininglog/" + $scope.traininglog.id);
    };

    //This function is called whenever a training is selected from the autocomplete box
    $scope.trainingSelected = function (selected) {

        if (selected) {

            $scope.traininglog.training = selected.originalObject;

        }

    };

    this.updateTraininglog = function (traininglog) {

        if (!traininglogId) { //Add a new Training Log

            TrainingLogs.addLog(traininglog);

        } else { //Update existing Training log

            TrainingLogs.updateLog(traininglog);

        }

    };

    $scope.deleteTraininglog = function (traininglog) {

        if (traininglog) {

            $dialogConfirm('Are you sure you want to delete this record (' + traininglog.training.title + ' [' + traininglog.startDate + '] )', 'Delete Training log').then(function () {

                TrainingLogs.remove(traininglog);

            });

        }

    };

    $scope.personSelected = function (selected) {

        if (selected) {

            $scope.personFound = 1;

            $scope.traininglog.attendance.attendee = selected.originalObject;

        } else {

            var newPayrollNo = frm.payrollNo.value;

            $scope.traininglog.attendance.attendee = {};

            $scope.traininglog.attendance.attendee.payrollNo = newPayrollNo;

            $scope.personFound = 0;

        }

    };

    /*
    *Load the dialog window for adding a new training attendee. 
    *@param {object} Training Log Instance
    */
    $scope.addTrainingattendee = function (traininglog) {

        $scope.traininglog.attendance = {};

        $dialog('app/traininglogs/trainingattendee.tpl.html', 'lg');

    };

    /*
    *Add a new or update an existing training log attendance record. 
    *@param {object} Training Log Instance
    */
    this.updateAttendance = function (traininglog) {

        if (angular.isUndefined(traininglog.attendance.id)) {

            /* 
             *Check if attendee has already been added to this training.
            */
            if (!TrainingLogs.isPersonInAttendanceList(traininglog, traininglog.attendance.attendee)) {

                TrainingLogs.addAttendee(traininglog);

            } else {

                $dialogAlert("(" + traininglog.attendance.attendee.name + " - " + traininglog.attendance.attendee.payrollNo + ") has already been added to this training", "Person already exists");

            }

        }

    };

    /*
    *Remove a person(attendee) from a training log attendance record. 
    *@param {object} Training Log Instance
    */
    $scope.removeAttendee = function (selectedTraininglog, attendee) {

        $dialogConfirm("Are you sure you want to remove " + attendee.name + " - " + attendee.payrollNo + " from the attendance list?", "Confirm delete").then(function () {

            TrainingLogs.removeAttendee(selectedTraininglog, attendee);

        });

    };

    $scope.int();

}]);