angular.module('resources.trainings', ['resources.departments'])

.factory('Trainings', ['$filter', '$log', '$q', 'Departments', function ($filter, $log, $q, Departments) {

    var Trainings = {};

    var trainingsList = null;

    Trainings.fetchAll = function () {

        var deferred = $q.defer();

        if (trainingsList === null) {

            trainingsList = [];

            trainingsList.push(
              { id: 1, title: 'Health & Safety Policy', target: ['ICT', 'HSRE'] },
              { id: 2, title: 'Risk Assessment Policy', target: ['All'] }
              );

            deferred.resolve(trainingsList);

        }

        return deferred.promise;

    };

    Trainings.fetchById = function (id) {
        var deferred = $q.defer();

        Trainings.fetchAll().then(function () {

            var returnedTraining = _.find(trainingsList, { id: id });

            deferred.resolve(returnedTraining);

        });

        return deferred.promise;

    };

    Trainings.addTraining = function (training) {

        trainingsList.push(training);

    };

    Trainings.removeTraining = function (training) {

        var thatTraining = _.find(trainingsList, function (thatTraining) {

            return thatTraining.id == training.id;

        });

        var deferred = $q.defer();

        trainingsList = _.without(trainingsList, thatTraining);

        deferred.resolve(trainingsList);

        return deferred.promise;

        //TODO Perist removal to database

    };


    return Trainings;

}])
