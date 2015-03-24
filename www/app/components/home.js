/**
 * Home
 *
 * @flow
 */
var React = require("react/addons");

class Home extends React.Component {
	render () {
		return (
			<div className="home">
				<h1 ref="title">Hello world</h1>
			</div>
		);
	}
}

module.exports = Home;
