/**
 * Home
 *
 * @flow
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
