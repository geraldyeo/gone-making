/**
 * Home
 *
 * This directive is necessary to enable preprocessing of JSX tags:
 * @jsx React.DOM
 */
var React = require("react/addons"),

	Home = React.createClass({
		render: function() {
			return (
				<div className="home">
					<h1 ref="title">Hello world</h1>
				</div>
			);
		}
	});

module.exports = Home;
