/**
 * Router
 *
 * @flow
 */
var React = require("react/addons"),
	Router = require("react-router"),
	Route = Router.Route,

	routes = [
		<Route
			name="home"
			path="/"
			handler={require("./components/home")} />
	];

module.exports = Router.create({
	routes: routes,
	location: Router.HistoryLocation
});
