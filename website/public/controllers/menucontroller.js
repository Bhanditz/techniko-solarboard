app.controller("MenuController", function () {
    var vm = this;
    this.currentTab = 0;

    this.isTab = function (tab) {
        return vm.currentTab === tab;
    };

    this.setTab = function (tab) {
        vm.currentTab = tab;
    };
});