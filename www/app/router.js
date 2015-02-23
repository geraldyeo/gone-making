/**
 * Router
 *
 * This directive is necessary to enable preprocessing of JSX tags:
 * @jsx React.DOM
 */
var React = require("react/addons");
var Router = require("react-router");
var Route = Router.Route;

var routes = [
	<Route
		name="home"
		path="/"
		handler={require("./components/home")} />
];

module.exports = Router.create({
	routes: routes,
	location: Router.HistoryLocation
});
