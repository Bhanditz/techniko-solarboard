app.controller("MenuController", function($scope, $state, solars) {
    $(".button-collapse").sideNav();
    var vm = this;
    var cacheSolars = [];
    solars.all.success(function(data) {
        data.forEach(function(solar) {
            cacheSolars.push(solar._id);
        });

        cacheSolars.sort(function(s1, s2) {
            if (s1 > s2)
                return 1;
            if (s1 < s2)
                return -1;
            return 0;
        });

        if (this.open) {
            this.solars = cacheSolars;
        }
    });

    this.open = false; //Special boolean for when solars aren't loaded yet
    this.solars = [];
    this.toggleTabs = function() {
        if (this.solars.length === 0) {
            this.solars = cacheSolars;
            vm.open = true;
        } else {
            this.solars = [];
            vm.open = false;
        }
    };

    function openTabs() {
        vm.solars = cacheSolars;
        vm.open = true;
    }

    //Automatically open menu when page loads
    $scope.$watch(function() {
        return $state.current.name;
    }, function(newValue) {
        if ($state.is('solars')) {
            openTabs();
        }
    });

    //Mobile topnav for scrolling
    var iScrollPos = 0;
    var topNav = $('.top-nav');
    var lastScrolledUp = true;
    $(window).scroll(function() {
        var iCurScrollPos = $(this).scrollTop();
        var delta = (iCurScrollPos - iScrollPos);
        var oldTop = topNav.css('top').split('px')[0];
        if (iCurScrollPos > iScrollPos) {
            if (oldTop > -80) {
                if (oldTop - delta < -80)
                    topNav.css('top', '-80px');
                else
                    topNav.css('top', '-=' + delta + 'px');
            }
            lastScrolledUp = false;
        } else {
            if (oldTop < 0) {
                if (oldTop - delta > 0)
                    topNav.css('top', '0px');
                else
                    topNav.css('top', '-=' + delta + 'px');
            }
            lastScrolledUp = true;
        }
        iScrollPos = iCurScrollPos;

    });

    (document).addEventListener('touchend', function(e) {
        //Only if all fingers lifted the screen
        if (e.touches.length === 0) {
            topNav.animate({
                'top': (lastScrolledUp ? 0 : -80) + 'px'
            }, 400);
        }
    });


});