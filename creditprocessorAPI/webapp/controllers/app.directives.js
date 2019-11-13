app.directive('onlyDigits', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
})
app.directive('onlyDouble', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9\.]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
})

app.directive('counter', function counter() {
    return {
        scope: {},
        bindToController: {
            count: '='
        },
        controller: function () {
            function increment() {
                this.count++;
            }
            function decrement() {
                this.count--;
            }
            this.increment = increment;
            this.decrement = decrement;
        },
        controllerAs: 'landingController3',
        template: '<div class="todo"><input type="text" ng-model="$ctrl.count"><button type="button" ng-click="$ctrl.decrement();">-</button><button type="button" ng-click="$ctrl.increment();">+</button></div>'

};
});
app.directive('myCustomer', function() {
    return {
        templateUrl: 'my-customer.html'
    };
});
app.directive('loading', function () {
    return {

      template: '<img ng-if="table_loader" style="display: block;margin: 0 auto;height: 33px;" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>',
      restrict: 'E',
      transclue: true,
      replace: true,
    }
});
app.directive('nsFocusId', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            element.click(function() {
                $timeout(function () { $('#' + attrs.nsFocusId).focus(); }, 0);
            });
        }
    };
}]);
/*Start::Import Defect21651*/
app.directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            element.on('change', function(onChangeEvent) {
                var reader = new FileReader();
                var fileExt = ((onChangeEvent.srcElement || onChangeEvent.target).files[0].name).split('.').pop();
                reader.onload = function(onLoadEvent) {
                    scope.$apply(function() {
                            var data = onLoadEvent.target.result;
                            var workbook;
                            workbook = XLSX.read(data, {type: 'binary',dateNF:"YYYY-MM-DD"});
                            fn(scope, {$fileContent: to_json(workbook)});
                    });
                };
                  //  reader.readAsBinaryString((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                if(fileExt =='csv')
                {
                    reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                }
                else {
                    reader.readAsBinaryString((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                }
            });
        }
    };
});
/*End::Import Defect21651*/

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
})


app.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
app.directive('ngConfirmClick', [
    function(){
        return {
            priority: -1,
            restrict: 'A',
            link: function(scope, element, attrs){
                element.bind('click', function(e){
                    var message = attrs.ngConfirmClick;
                    // confirm() requires jQuery
                    if(message && !confirm(message)){
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                });
            }
        }
    }
]);
app.filter('customFilterSearch', function() {
	  return function(input, option) {
            // option is filter columns and term is the search text
		    // so option.type can be BB Value and search text is 1 or 2 or 10
		    if (!option.type || !option.term) {
		      return input;
		    }
		    var result = [];
		    angular.forEach(input, function(val, key) {
		      var currentValue = val[option.type];
		      if ( currentValue == "undefined" || !currentValue) {
		    	  currentValue = "";
		      }
		      currentValue = currentValue +"";// to change any number etc value to string to that toLowerCase func is available.
		      if (currentValue.toLowerCase().indexOf(option.term.toLowerCase()) > -1) {
		        result.push(val);
		      }
		    })
		    return result;
		  }
});

app.filter('unique', function() {
    return function(collection, keyname) {
        var output = [],
            keys = [];

        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if(keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });

        return output;
    };
});
app.filter('startsWithLetter', function () {
  return function (items, letter,entity) {
    if (!letter && !entity) {
      return items;
    }
    if ( !letter || letter == "undefined" ) {
    	letter = "";
    }
    letter = letter+""; // to make it String
    var filtered = [];
    var letterMatch = new RegExp(letter, 'ig');
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if(!entity)
      {
            if (item.displayname.toLowerCase().startsWith(letter.toLowerCase())) {
            filtered.push(item);
            }
      }
      else{
        if ( ( ( letter && letter.length > 0 && item.displayname.toLowerCase().startsWith(letter.toLowerCase()) ) || !letter || letter.length == 0 ) && (item.entity.toLowerCase() == entity.toLowerCase()) )
        {
        	filtered.push(item);
        }
      }
}
    return filtered;
  };
});

app.filter('startsWithLetter1', function () {
    return function (items, letter,entity) {
        if (!letter && !entity) {
            return items;
        }
        if ( !letter || letter == "undefined" ) {
            letter = "";
        }
        letter = letter+""; // to make it String
        var filtered = [];
        var letterMatch = new RegExp(letter, 'ig');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if(!entity)
            {
                if (item.value.toLowerCase().startsWith(letter.toLowerCase())) {
                    filtered.push(item);
                }
            }
            else{
                if ( ( ( letter && letter.length > 0 && item.value.toLowerCase().startsWith(letter.toLowerCase()) ) || !letter || letter.length == 0 ) && (item.Entity.toLowerCase() == entity.toLowerCase()) )
                {
                    filtered.push(item);
                }
            }
        }
        return filtered;
    };
});

app.directive("limitToMax", function() {
  return {
    link: function(scope, element, attributes) {
      element.on("keydown keyup", function(e) {
        if(attributes.max !='')
        {
    if (Number(element.val()) > Number(attributes.max) &&
          e.keyCode != 46 // delete
          &&
          e.keyCode != 8 // backspace
        ) {
          e.preventDefault();
          element.val();
          /*if(Number(element.val()) > Number(attributes.max))
          {
          element.val(element.val().substr(1,element.val().length-4));
          }
          else{element.val(attributes.max);}
          */
        }
      }
    });

  }
  };
});
