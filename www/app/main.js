/**
 * main
 *
 * @flow
 */
var React = require('react/addons'),
	Router = require('./router'),
	Marty = require('marty');

window.React = React; // For React Developer Tools
window.Marty = Marty; // For Marty Developer Tools

if (process.env.NODE_ENV !== 'test') {
	Router.run((Handler, state) => {
		React.render(<Handler {...state.params} />,
						document.getElementById('app'));
	});
}
