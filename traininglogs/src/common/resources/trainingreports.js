angular.module('resources.trainingreports', ['resources.traininglogs', 'resources.attendances', 'resources.people', 'resources.trainings'])

.factory('TrainingReports', ['$filter', '$log', 'TrainingLogs', 'Attendances', 'People', function ($filter, $log, TrainingLogs, Attendances, People) {

    var TrainingReports = {};

    var reportData = null;

    var trainings = null;

    TrainingReports.reportRecords = {};

    TrainingReports.attendanceRegister = {};

    TrainingReports.attendanceLogMatrix = {};

    /*
    *Get all attendance records (formatted for reporting)
    *@returns {array} Returns a list of all attendance records
    */
    TrainingReports.reportRecords.fetchAll = function () {

        var deferred = $q.defer();

        if (reportData === null) {

            reportData = [];
            return;
            Attendances.fetchAll().then(function (attendances) {

                angular.forEach(attendances, function (attendance, key) {

                    var reportRecord = {};

                    var traininglog = TrainingLogs.fetchById(attendance.traininglogId);

                    var training = traininglog.training;

                    reportRecord.traininglogId = attendance.traininglogId;
                    reportRecord.training = training;
                    reportRecord.trainingId = training.id;
                    reportRecord.trainingTitle = training.title;
                    reportRecord.year = $filter('date')(traininglog.startDate, 'yyyy', 'africa/nairobi');
                    reportRecord.personId = attendance.attendee.id;
                    reportRecord.payrollNo = attendance.attendee.payrollNo;
                    reportRecord.name = attendance.attendee.name;
                    reportRecord.gender = attendance.attendee.gender;
                    reportRecord.position = attendance.attendee.position;
                    reportRecord.department = attendance.attendee.department;
                    reportRecord.location = attendance.attendee.location;

                    reportData.push(reportRecord);

                });

                deferred.resolve(reportData);

            });

        }

        return deferred.promise;

    };

    /*
    *Get attendance records (formatted for reporting) for a selected training
    *@param {integer} year - The year when the training was conducted
    *@param {object} Training - An instance of training
    *@returns {array} Returns a list of staff with their respective attendance status for the selected training
    */
    TrainingReports.reportRecords.fetchByTraining = function (year, training) {

        TrainingReports.reportRecords.fetchAll();

        return _.filter(reportData, function (reportRecord) {

            return reportRecord.year == year && reportRecord.trainingId == training.id;

        });

    };

    /*
    *Get attendance records (formatted for reporting) for a selected department
    *@param {integer} year - The year when the training was conducted
    *@param {string} Department - 
    *@returns {array} Returns a list of attendance records for the selected department
    */
    TrainingReports.reportRecords.fetchByDepartment = function (year, dept) {

        TrainingReports.reportRecords.fetchAll();

        return _.filter(reportData, function (reportRecord) {

            return reportRecord.year == year && reportRecord.department == dept;

        });

    };

    /*
    *Get attendance records (formatted for reporting) for a selected department and training
    *@param {integer} year - The year when the training was conducted
    *@param {object} Training - An instance of training
    *@param {string} Department - 
    *@returns {array} Returns a list attendance records for the selected training and department
    */
    TrainingReports.reportRecords.fetchByTrainingAndDepartment = function (year, training, dept) {

        TrainingReports.reportRecords.fetchAll();

        return _.filter(reportData, function (reportRecord) {

            return (reportRecord.year == year && reportRecord.trainingId == training.id && reportRecord.department == dept);

        });

    };

    /*
    *Get attendance register for a particular training in a particular year
    *@param {integer} year - The year when the trainiig was conducted
    *@param {object} Training - An instance of training
    *@param {string} Department (Optional) - 
    *@returns {array} Returns a list of staff with their respective attendance status for the selected training
    */
    TrainingReports.attendanceRegister.fetch = function (year, training, department) {

        var attendanceRegisterData = [];

        var people = [];

        if (angular.isUndefined(department)) {

            people = People.fetchAll();

        } else {

            people = People.fetchByDepartment(department);

        }

        TrainingReports.reportRecords.fetchAll();

        angular.forEach(people, function (person, key) {

            var attendanceRecord = {};

            var reportRecord = _.find(reportData, function (item) {

                return item.personId === person.id && item.year == year && item.trainingId == training.id;

            });

            if (angular.isUndefined(reportRecord)) { //Set the training attendance status

                attendanceRecord.attended = 0;

            } else {

                attendanceRecord.attended = 1;

                _.merge(attendanceRecord, reportRecord);

            }

            attendanceRecord.year = year;

            attendanceRecord.trainingTitle = training.title;

            _.merge(attendanceRecord, _.omit(person, ['id'])); //Remove id property form the person object and merge it wih the attendance record object

            attendanceRegisterData.push(attendanceRecord);

        });

        return attendanceRegisterData;

    };

    /*
    *Get attendance register for a particular training in a particular year
    *@param {integer} year - The year when the trainiig was conducted
    *@param {object} Training - An instance of training
    *@param {string} Department (Optional) - 
    *@returns {array} Returns a list of staff with their respective attendance status for the selected training
    */
    TrainingReports.attendanceRegister.fetchAll = function (year, training) {

        return TrainingReports.attendanceRegister.fetch(year, training);

    };

    /*
    *Get attendance attendance register for a particular training in a particular year filtered by department
    *@param {integer} year - The year when the trainiig was conducted
    *@param {object} Training - An instance of training
    *@param {string} Department - 
    *@returns {array} Returns a list of staff within a department with their respective attendance status for the selected training
    */
    TrainingReports.attendanceRegister.fetchByDepartment = function (year, training, department) {

        return TrainingReports.attendanceRegister.fetch(year, training, department);

    };

    var allReportRecords = TrainingReports.reportRecords.fetchAll();

    var allYears = _.map(allReportRecords, function (o) {

        return _.pick(o, ['year']);

    });

    var allTrainings = _.map(allReportRecords, function (o) {

        return _.pick(o, ['year', 'training']);

    });

    /*
    *Get a unique list of years in which at least one training was conducted
    *@param {integer} year - The year when the trainings were conducted
    *@returns {array} Returns a list of trainings conducted in the given year
    */
    TrainingReports.uniqueYears = function () {

        var uniqueYears = [];

        var groupedByYear = _.groupBy(allReportRecords, function (o) {

            return o.year;

        });

        angular.forEach(groupedByYear, function (value, key) {

            uniqueYears.push(key);

        });

        return uniqueYears;
    };

    /*
    *Get a unique list of trainings conducted in the selected year
    *@param {integer} year - The year when the trainings were conducted
    *@returns {array} Returns a list of trainings conducted in the given year
    */
    TrainingReports.uniqueTrainings = function (year) {

        var uniqueTrainings = [];

        var groupedByTraining = _(allReportRecords).filter(function (o) {

            return o.year == year;

        }).groupBy(function (o) {

            return o.trainingId;

        }).value();

        angular.forEach(groupedByTraining, function (value, key) {

            uniqueTrainings.push(value[0].training);

        });

        return uniqueTrainings;

    };

    TrainingReports.uniqueDepartments = _.groupBy(allReportRecords, function (o) {

        return o.department;

    });

    /*
    *Get attendance records (formatted for reporting) for a selected year optionally filtered by department
    *@param {integer} year - The year when the training was conducted
    *@param {string} Department - 
    *@returns {object} An object that contains the the data as an array as well as the list of columns as an object
    */
    TrainingReports.attendanceLogMatrix.fetch = function (year, department) {

        var attendanceLogMatrix = [];

        var trainings = TrainingReports.uniqueTrainings(year);

        var people = [];

        if (angular.isUndefined(department)) {

            people = People.fetchAll();

        } else {

            people = People.fetchByDepartment(department);

        }

        TrainingReports.reportRecords.fetchAll();

        var columns = {}; //This variable will be used to fetch all the column values from the row resultant array of report records

        angular.forEach(people, function (person, key) {

            var attendanceRecord = {};

            attendanceRecord.year = year;

            _.merge(attendanceRecord, _.omit(person, ['id'])); //Remove id property form the person object and merge it with the attendance record object

            angular.forEach(trainings, function (value, key) {

                var training = value;

                var reportRecord = _.find(reportData, function (item) {

                    return item.personId === person.id && item.year == year && item.trainingId == training.id;

                });

                if (angular.isUndefined(reportRecord)) { //Set the training attendance status

                    attendanceRecord[training.title] = 0;

                } else {

                    attendanceRecord[training.title] = 1;

                }

                columns = _.merge(_.keys(attendanceRecord)); //This will ensure that all columns titles represented the dataset are captured.

            });

            attendanceLogMatrix.push(attendanceRecord);

        });

        return { data: attendanceLogMatrix, columns: columns };

    };

    return TrainingReports;

}]);
