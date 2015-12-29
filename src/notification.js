(function() {
  'use strict';

  if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
    module.exports = 'tenphi.notification';
  }

  angular.module('tenphi.notification', [])
    .factory('Notification', ['$compile', '$sce', '$q', '$timeout', function($compile, $sce, $q, $timeout) {
      let instances = [];

      function show(type, message) {
        let item = { type, message };

        instances.push(item);

        if (instances.length > 3) {
          instances.shift();
        }

        $timeout( () => instances.splice(instances.indexOf(item), 1), 5000);
      }

      let Notification = {
        instances,

        info(message) {
          show('info', message);
        },

        warning(message) {
          show('warning', message);
        },

        error(message) {
          show('error', message);
        }
      };

      return Notification;
    }])

    .directive('tnpNotification', ['Notification', '$compile', function(Notification, $compile) {

      class tnpNotificationCtrl {
        constructor() {
          this.instances = Notification.instances;
        }
      }

      return {
        restrict: 'E',
        replace: true,
        template: ( require('./notification.less'), require('./notification.html') ),
        controller: tnpNotificationCtrl,
        controllerAs: 'notification'
      }
    }])

    .run(['$rootScope', '$document', '$compile', function($rootScope, $document, $compile) {
      let template = angular.element('<tnp-notification></tnp-notification>');
      let linkFn = $compile(template);
      let element = linkFn($rootScope)[0];
      let document = $document[0];

      document.body.appendChild(element);
    }]);

})();