(function() {
  'use strict';

  angular.module('materialDrive')
    .controller('NavbarController', [
      '$scope',
      '$window',
      '$state',
      '$q',
      '$cacheFactory',
      '$mdSidenav',
      'google',
      'MimeType',
      NavbarController
    ]);

  function NavbarController($scope, $window, $state, $q, $cacheFactory, $mdSidenav, google, MimeType) {
    var self = this;
    var detailsCache = $cacheFactory.get('details');

    self.toggleSidenav = toggleSidenav;
    self.toggleDetails = toggleDetails;
    self.querySearchText = querySearchText;
    self.searchItemSelected = searchItemSelected;
    self.MimeType = MimeType;

    self.status = $cacheFactory.get('drive').get('status');
    self.breadcrumb = $cacheFactory.get('drive').get('breadcrumb');

    $scope.$on('$stateChangeSuccess', function() {
      self.status.search = false;
      self.searchText = '';
    });

    function toggleSidenav() {
      $mdSidenav('sidenav').toggle();
    }

    function toggleDetails() {
      var details = $mdSidenav('details');
      if (details.isOpen() || details.isLockedOpen()) {
        detailsCache.put('visible' , false);
        details.close();
      } else {
        detailsCache.put('visible' , true);
        details.open();
      }
    }

    function querySearchText(searchText) {
      var deferred = $q.defer();

      google.filesList({
        query: google.query.fullText.concat(' or title contains \'%s\'').replace('%s', searchText)
      }).then(function(response) {
        deferred.resolve(response.data.items);
      }, deferred.reject);

      return deferred.promise;
    }

    function searchItemSelected() {
      if (!self.selectedItem) {
        return;
      }

      if (self.selectedItem.mimeType === MimeType.folder) {
        $state.go('drive.folder', {
          folderId: self.selectedItem.id
        });
      } else {
        $window.open(self.selectedItem.alternateLink);
      }
    }
  }

}());