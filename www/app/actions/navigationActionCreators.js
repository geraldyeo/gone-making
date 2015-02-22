var Marty = require('marty'),
	Router = require('../router'),
	NavigationActionCreators;

function navigateTo(route, params) {
	Router.transitionTo(route, params || {});
}

NavigationActionCreators = Marty.createActionCreators({
	displayName: 'Navigation',
	navigateHome: function() {
		navigateTo('home');
	}
});

module.exports = NavigationActionCreators;
