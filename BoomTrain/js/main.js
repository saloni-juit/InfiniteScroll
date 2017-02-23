var app = angular.module('BoomApp', []);

app.controller('MainCtrl', ['$http', '$scope', function($http, $scope) {
    //getting data from github

    var nextLink = 'https://api.github.com/repositories?since=862';
    var data = [];
    $scope.editIndex = -1;
    $scope.editDataModel = {};
    $scope.message = "";

    function loadData(url) {
        $scope.message = "loading data...";
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            if(response.data.length == 0){
              $scope.message = "data not available";
              return;
            }

            nextLink = response.headers().link.split(';')[0].slice(1, -1) + '&rel=next';
            data = data.concat(response.data);
            $scope.repo = data;
            $scope.message = "";
        }, function errorCallback(response) {
            console.log("Error occurred in loading data");
        });
    }

    loadData(nextLink);

    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            loadData(nextLink);
        }
    });

    $scope.editData = function(index) {
        var elementToEdit = $scope.repo[index];
        $scope.editIndex = index;
        console.log(elementToEdit);
        $scope.editDataModel = elementToEdit;

    };

    $scope.submitData = function(){
        var dataObj = {
            "repoName":$scope.editDataModel.full_name,
            "ownerLogin" : $scope.editDataModel.owner.login,
            "description" : $scope.editDataModel.description,
            "ownerType":$scope.editDataModel.owner.type
          };
        var url = 'http://httpbin.org/post';
        $http({
          method:'POST',
          url:url,
          data:dataObj
        }).then(function successCallback(response){
          $scope.repo[$scope.editIndex] = $scope.editDataModel;
          //response is the same as object
          console.log(response.data);
        },function errorCallback(response){
            console.log(response);
        });
    };

}]);
