var app = angular.module('app', [
    'ngRoute',
    'ngAnimate',
    'ng-mfb',
    'ui.bootstrap',
    'ui.bootstrap.dialogs',
    'angucomplete-alt',
    'ui.grid',
    'ui.grid.exporter',
    'trainings',
    'traininglogs',
    'reports']);

app.config(['$routeProvider', function ($routeprovider) {

    $routeprovider.

    /*Begin Staff Members*/
    when('/editStaffmember/:id', {
        templateUrl: 'app/traininglogs/people/people-edit.tpl.html',
        controller: 'staffmemberCtrl'
    }).

    when('/addStaffmember', {
        templateUrl: 'app/traininglogs/people/people-add.tpl.html',
        controller: 'staffmemberCtrl'
    }).

    when('/listStaffmember', {
        templateUrl: 'app/traininglogs/people/people-list.tpl.html',
        controller: 'staffmemberCtrl'
    }).
    /*End Staffmembers*/

    /*Begin Departments*/
    when('/editDepartment/:id', {
        templateUrl: 'app/traininglogs/departments/department-edit.tpl.html',
        controller: 'departmentCtrl'
    }).

    when('/addDepartment', {
        templateUrl: 'app/traininglogs/departments/department-add.tpl.html',
        controller: 'departmentCtrl'
    }).

    when('/listDepartment', {
        templateUrl: 'app/traininglogs/departments/department-list.tpl.html',
        controller: 'departmentCtrl'
    }).
    /*End Departments*/

    /*Begin Trainings*/
    when('/editTraining/:id', {
        templateUrl: 'app/traininglogs/trainings/training-edit.tpl.html',
        controller: 'trainingCtrl'
    }).

    when('/addTraining', {
        templateUrl: 'app/traininglogs/trainings/training-add.tpl.html',
        controller: 'trainingCtrl'
    }).

    when('/listTraining', {
        templateUrl: 'app/traininglogs/trainings/training-list.tpl.html',
        controller: 'trainingCtrl'
    }).
    /*End Trainings*/

    /*Begin Training logs*/
    when('/editTraininglog/:id', {
        templateUrl: 'app/traininglogs/traininglog-edit.tpl.html',
        controller: 'traininglogsCtrl'
    }).

    when('/addTraininglog', {
        templateUrl: 'app/traininglogs/traininglog-add.tpl.html',
        controller: 'traininglogsCtrl'
    }).

    when('/listTraininglog', {
        templateUrl: 'app/traininglogs/traininglog-list.tpl.html',
        controller: 'traininglogsCtrl'
    }).
    /*End Training logs*/

    when('/reports/trainingattendance', {
        templateUrl: 'app/traininglogs/reports/trainingattendance-report.tpl.html',
        controller: 'reportsCtrl'
    }).

    when('/reports/trainingattendancematrix', {
        templateUrl: 'app/traininglogs/reports/trainingattendance-matrix.tpl.html',
        controller: 'reportsCtrl'
    }).

    otherwise({
        redirectTo: '/listTraininglog'
    });

}]);

