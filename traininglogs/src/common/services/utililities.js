angular.module('services.utilities', [])

.factory('ArrayUtils', function () {

    /*
     Utility function to remove an item from an array of objects based on a property value
    */

    var arrayUtils = {};

    arrayUtils.removeByAttr = function (arr, attr, value) {
        var i = arr.length;
        while (i--) {
            if (arr[i]
                && arr[i].hasOwnProperty(attr)
                && (arguments.length > 2 && arr[i][attr] === value)) {

                arr.splice(i, 1);

            }
        }
        return arr;
    };

    arrayUtils.updateByAttr = function (arr, attr, value, newValue) {
        var i = arr.length;
        while (i--) {
            if (arr[i]
                && arr[i].hasOwnProperty(attr)
                && (arguments.length > 3 && arr[i][attr] === value)) {

                arr[i] = newValue;

            }
        }
        return arr;
    };

    arrayUtils.recordExists = function (arr, attr, value) {
        var i = arr.length;
        var found = false;
        while (i-- && found === false) {
            if (arr[i]
                && arr[i].hasOwnProperty(attr)
                && (arguments.length > 2 && arr[i][attr] === value)) {

                found = true;

            }
        }
        return arr;
    };

    arrayUtils.containsObject = function (arr, attr, obj) {
        var i;
        for (i = 0; i < arr.length; i++) {
            if (arr[i][attr] === obj[attr]) {
                return true;
            }
        }
    };

    return arrayUtils;

})

.factory('UtilService', ['$log', '$q', function ($log, $q) {
    var utilService = {};
    //utility function to get parameter from query string
    utilService.getQueryStringParameter = function (urlParameterKey) {
        var params = document.URL.split('?')[1].split('&');
        var strParams = '';
        for (var i = 0; i < params.length; i = i + 1) {
            var singleParam = params[i].split('=');
            if (singleParam[0] == urlParameterKey)
                return singleParam[1];
        }
    };

    utilService.showSuccessMessage = function (domSelector, message) {
        $(domSelector).append($('<div/>', { id: 'myAlerts' }).addClass('alert alert-success').append(message));
        setTimeout(function () {
            $("#myAlerts").fadeTo(3000, 0).slideUp(500, function () {
                $(this).alert('close');
            });
        }, 2000);
    }

    return utilService;
}])

.factory('ShptCsomService', ['$q', 'UtilService', function ($q, UtilService) {

    var context, parentContext, web;

    var shptService = {};

    var deferred = $q.defer();

    SP.SOD.executeFunc('sp.js', 'SP.ClientContext.js', 'SP.Taxonomy.js', function () {

        spHostUrl = decodeURIComponent(UtilService.getQueryStringParameter('SPHostUrl'));
        context = new SP.ClientContext.get_current();
        parentContext = new SP.AppContextSite(context, spHostUrl);
        web = parentContext.get_web();

        shptService = {

            loadItemDetails: function (ID, listTitle, success, failed) {
                list = web.get_lists().getByTitle(listTitle);
                listItem = list.getItemById(ID);
                context.load(listItem);
                context.executeQueryAsync(
                    function () {
                        success(listItem);
                    }, failed);
            },

            loadItemDetailsByID: function (ID, listTitle, success, failed) {
                list = web.get_lists().getByTitle(listTitle);
                listItemByID = list.getItemById(ID);
                context.load(listItemByID);
                context.executeQueryAsync(
                    function () {
                        success(listItemByID);
                    }, failed);
            },

            loadItemDetailsByTitle: function (Title, listTitle, success, failed) {
                list = web.get_lists().getByTitle(listTitle);
                listItem = list.getItemByTitle(Title);
                context.load(listItem);
                context.executeQueryAsync(
                    function () {
                        success(listItem);
                    }, failed);
            },

            loadItemsWithCaml: function (listTitle, camlQuery, success, failed) {
                list = web.get_lists().getByTitle(listTitle);
                listItems = list.getItems(camlQuery);
                context.load(listItems);
                context.executeQueryAsync(
                        function () {

                            var entries = [];
                            var itemsCount = listItems.get_count();
                            for (i = 0; i < itemsCount; i++) {
                                var listItem = listItems.itemAt(i);
                                var entry = JSON.stringify(listItem.get_fieldValues());
                                entries.push(entry);
                            }
                            success(entries);
                        }, failed);
            },

            insertListItems: function (listTitle, insertItems, success, failed) {
                var itemArray = [];
                list = web.get_lists().getByTitle(listTitle);
                var itemCreateInfo = new SP.ListItemCreationInformation();
                var listItem;
                var setToInsert, insertItemName, insertItemValue;

                for (var i = 0; i < insertItems.length; i++) {
                    setToInsert = insertItems[i];
                    listItem = list.addItem(itemCreateInfo);
                    for (var j = 0; j < setToInsert.length; j++) {
                        insertItemName = setToInsert[j][0];
                        insertItemValue = setToInsert[j][1];
                        listItem.set_item(insertItemName, insertItemValue);
                    }
                    listItem.update();
                    itemArray[i] = listItem;
                    context.load(itemArray[i]);
                }
                context.executeQueryAsync(
                function () {
                    success();
                }, failed);
            },

            updateListItems: function (listTitle, updateItems, success, failed) {
                var itemArray = [];
                list = web.get_lists().getByTitle(listTitle);
                var listItem;
                var setToUpdate, updateItemId, updateItemName, updateItemValue;

                for (var i = 0; i < updateItems.length; i++) {
                    setToUpdate = updateItems[i];

                    updateItemId = setToUpdate[0];
                    updateItemName = setToUpdate[1];
                    updateItemValue = setToUpdate[2];

                    listItem = list.getItemById(updateItemId);
                    listItem.set_item(updateItemName, updateItemValue);
                    listItem.update();

                    itemArray[i] = listItem;
                    context.load(itemArray[i]);
                }
                context.executeQueryAsync(
               function () {
                   success();
               }, failed);
            },

            updateListItem: function (updateItemID, listTitle, updateItems, success, failed) {
                var updateItemName, updateItemValue;
                list = web.get_lists().getByTitle(listTitle);
                listItem = list.getItemById(updateItemID);

                for (var i = 0; i < updateItems.length; i++) {
                    updateItemName = updateItems[i][0];
                    updateItemValue = updateItems[i][1];
                    listItem.set_item(updateItemName, updateItemValue);
                }

                listItem.update();
                context.executeQueryAsync(
                function () {
                    success();
                }, failed);
            }
        };

    });

    shptService.termStoreName = 'UAT Baraza Metadata Service';

    shptService.loadTerms = function (TermSetGuid, success, failure) {

        var deferred = $q.defer();

        var scriptbase = _spPageContextInfo.webServerRelativeUrl + "/_layouts/15/";

        var context = SP.ClientContext.get_current();

        //Current Taxonomy Session
        var taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);

        //Term Stores
        var termStores = taxSession.get_termStores();

        //Name of the Term Store from which to get the Terms.
        var termStore = termStores.getByName(shptService.termStoreName);

        //GUID of Term Set from which to get the Terms.
        var termSet = termStore.getTermSet(TermSetGuid);

        var terms = termSet.getAllTerms();

        context.load(terms);

        context.executeQueryAsync(function () {

            var termEnumerator = terms.getEnumerator();

            var termList = [];

            while (termEnumerator.moveNext()) {

                var currentTerm = termEnumerator.get_current();

                termList.push({
                    Name: currentTerm.get_name(),
                    ID: currentTerm.get_id().ToSerialized(),
                    Desc: currentTerm.get_description(),
                });

            }

            deferred.resolve(termList);

        }, function (sender, args) {

            console.log(args.get_message());
            deferred.reject(args.get_message());

        });

        return deferred.promise;

    }

    return shptService;

}])

.factory('ShptRestService', ['$q', '$http', '$log', 'UtilService', function ($q, $http, $log, UtilService) {

    var shptService = {};

    shptService.appWebUrl = decodeURIComponent(UtilService.getQueryStringParameter('SPAppWebUrl')).split('#')[0];
    shptService.hostWebUrl = decodeURIComponent(UtilService.getQueryStringParameter('SPHostUrl')).split('#')[0];

    shptService.getListItems = function (listTitle, queryParams) {
        return $http({
            method: 'GET',
            url: shptService.appWebUrl + '/_api/SP.AppContextSite(@target)/web/Lists/getByTitle(\'' + listTitle + '\')/Items?' + queryParams + '&@target=\'' + shptService.hostWebUrl + '\'',
            headers: { Accept: 'application/json;odata=verbose' }
        }).then(function sendResponseData(response) {
            return response.data.d;
        }).catch(function handleError(response) {
            $log.error('http request error: ' + response.data.error.message.value);
            return $q.reject(response);
        });
    };

    shptService.getListItemsWithCaml = function (listTitle, queryParams) {
        var deferred = $q.defer();
        shptService.retrieveFormDigest().then(function (formDigestValue) {

            $http({
                method: 'POST',
                url: shptService.appWebUrl + '/_api/SP.AppContextSite(@target)/web/Lists/getByTitle(\'' + listTitle + '\')/GetItems(query=@qry)?@qry={\'ViewXml\':\'' + queryParams + '\'}&@target=\'' + shptService.hostWebUrl + '\'',
                headers: {
                    "Accept": 'application/json;odata=verbose',
                    "Content-Length": 0,
                    "X-RequestDigest": formDigestValue,
                }

            }).then(function sendResponseData(response) {
                deferred.resolve(response.data.d);
            }).catch(function handleError(response) {
                $log.error('http request error: ' + response.data.error.message.value);
                deferred.reject(response);
            });

        });

        return deferred.promise;

    };

    shptService.getListProperties = function (listTitle, queryParams) {
        return $http({
            method: 'GET',
            url: shptService.appWebUrl + '/_api/SP.AppContextSite(@target)/web/Lists/getByTitle(\'' + listTitle + '\')?' + queryParams + '&@target=\'' + shptService.hostWebUrl + '\'',
            headers: { Accept: 'application/json;odata=verbose' }
        }).then(function sendResponseData(response) {
            return response.data.d;
        }).catch(function handleError(response) {
            $log.error('http request error: ' + response.status);
            return $q.reject('Error: ' + response.status);
        });
    };

    shptService.retrieveFormDigest = function () {
        var contextInfoUri = shptService.appWebUrl + '/_api/contextinfo?$select=FormDigestValue';
        var deferred = $q.defer();

        $http({
            url: contextInfoUri,
            method: "POST",
            headers: { "Accept": "application/json; odata=verbose" }
        }).then(function (response) {
            formDigestValue = response.data.d.GetContextWebInformation.FormDigestValue;
            deferred.resolve(formDigestValue);
        }).catch(function (response) {
            var errMsg = "Error retrieving the form digest value: "
		                + response.data.error.message.value;
            $log.error(errMsg);
            deferred.reject('Error: ' + response.status + '. ' + errMsg);
        });

        return deferred.promise;
    }

    shptService.retrieveETagValue = function (operationUri) {
        var deferred = $q.defer();

        $http({
            url: operationUri,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" }
        }).then(function (response) {
            eTag = response.data.d.__metadata["etag"];
            deferred.resolve(eTag);
        }).catch(function (response) {
            $log.error(response);
            var errMsg = "Error retrieving ETag value: "
		                + response.data.error.message.value;
            $log.error(errMsg);
            deferred.reject('Error: ' + response.status + '. ' + errMsg);
        });

        return deferred.promise;
    };

    shptService.getListItemEntityTypeFullName = function (listName) {
        var deferred = $q.defer();
        shptService.getListProperties(listName, '$select=ListItemEntityTypeFullName').then(function (response) {
            deferred.resolve(response.ListItemEntityTypeFullName);
        });

        return deferred.promise;
    };

    shptService.createNewListItem = function (listTitle, bodyContent) {
        var operationUri = shptService.appWebUrl + "/_api/web/lists/GetByTitle('" + listTitle + "')/Items" + '?@target=\'' + shptService.hostWebUrl + '\'';
        var deferred = $q.defer();
        shptService.retrieveFormDigest().then(function (formDigestValue) {
            $http({
                url: operationUri,
                method: "POST",
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose",
                    "Content-Length": bodyContent.length,
                    "X-RequestDigest": formDigestValue,
                },
                data: bodyContent
            }).then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                var errMessage = "Error adding List Item '"
                    				+ response.data.error.message.value + "'";
                $log.error(errMessage)
                deferred.reject('Error: ' + response.status + '. ' + errMessage);
            })
        });

        return deferred.promise;
    }

    shptService.updateListItem = function (listTitle, itemId, bodyContent) {
        var operationUri = shptService.appWebUrl +
            "/_api/SP.AppContextSite(@target)/web/lists/GetByTitle('" + listTitle + "')/Items(" + itemId + ")" + '?@target=\'' + shptService.hostWebUrl + '\'';

        shptService.retrieveFormDigest().then(function (formDigestValue) {

            shptService.retrieveETagValue(operationUri).then(function (eTag) {

                // Invoke the real update operation
                $http({
                    url: operationUri,
                    method: "POST",
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "content-type": "application/json;odata=verbose",
                        "content-length": bodyContent.length,
                        "X-RequestDigest": formDigestValue,
                        "X-HTTP-Method": "MERGE",
                        "IF-MATCH": eTag
                    },
                    data: bodyContent
                }).then(function (response) {
                    return response;
                }).catch(function (response, errorCode, errorMessage) {
                    var errMsg = "Error updating list item: " + response.data.error.message.value;
                    $log.error(errMsg);
                    return $q.reject('Error: ' + response.status + '. ' + errorMessage);
                });
            })
        });
    }

    shptService.deleteListItem = function (listTitle, itemId, bodyContent) {
        var operationUri = shptService.appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/GetByTitle('" + listTitle + "')/Items(" + itemId + ")" + '?@target=\'' + shptService.hostWebUrl + '\'';;
        var deferred = $q.defer();

        shptService.retrieveFormDigest().then(function (formDigestValue) {
            shptService.retrieveETagValue(operationUri).then(function (eTag) {
                $http({
                    url: operationUri,
                    method: "POST",
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "content-type": "application/json;odata=verbose",
                        "X-RequestDigest": formDigestValue,
                        "X-HTTP-Method": "DELETE",
                        "IF-MATCH": eTag
                    }
                }).then(function (response) {
                    $log.info('Deleted successfully');
                    deferred.resolve(response);
                }).catch(function (response) {
                    var errMessage = "Error deleting item: '";
                    +response.data.error.message.value + "'";
                    deferred.reject('Error: ' + errMessage);
                });
            });
        });

        return deferred.promise;
    }

    return shptService;
}]);

/*
                /* scriptbase = _spPageContextInfo.webServerRelativeUrl + "/_layouts/15/";
                $.getScript(scriptbase + "SP.Runtime.js", function () {
                    $.getScript(scriptbase + "SP.js", function () {
                        $.getScript(scriptbase + "SP.Taxonomy.js", function () {

                            promises.push(Departments.fetchAll());
                            promises.push(Positions.fetchAll());
                            promises.push(Locations.fetchAll());

                            $q.all(promises).then(function (data) {
                                console.log(data)

                            });
                        });
                    });
                });

                return;
                $q.all(promises).then(function (data) {
                    console.log(data)
                    alert('ss')

                });
                return;*/


*/