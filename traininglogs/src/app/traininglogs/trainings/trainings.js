angular.module('trainings', ['ui.bootstrap.dialogs', 'resources.trainings'])

.controller('trainingCtrl', ['$scope', '$log', '$routeParams', '$location', '$dialog', '$dialogConfirm', 'Trainings', function ($scope, $log, $routeParams, $location, $dialog, $dialogConfirm, Trainings) {

    $scope.int = function () {

        $scope.trainings = Trainings.fetchAll();

    };

    var trainingId = $routeParams.id;

    if (!angular.isUndefined(trainingId)) { //View existing training log 

        trainingId = parseInt($routeParams.id);

        $scope.training = Trainings.fetchById(trainingId);

    } else { //Add new Training

        $scope.training = {};

    }

    $scope.addTraining = function () {

        $scope.training = {};

        $dialog('training-add.tpl.html', 'md').then(function (traininglog) {

            //$location.path( "/editTraining/" + training.id );

        });

        //$location.path("/editTraining/" + $scope.training.id);
    };

    this.updateTraining = function (training) {

        if (!trainingId) { //Add a new Training Log

            Trainings.addTraining(training);

        } else { //Update exisiting Training log

            Trainings.updateTraining(training);

        }

    };

    $scope.deleteTraining = function (training) {

        if (training) {

            $dialogConfirm('Are you sure you want to delete this record (' + training.title + ' )', 'Delete Training').then(function () {

                Trainings.removeTraining(training).then(function (data) {

                    $scope.trainings = data;

                });

            });

        }

    };

}]);