import React, {Component} from 'react';

export default class Subscribe extends Component {
	
	render() {
		return (
			<section className="widget">      
                <h2 className="widget-title">CLIPTALES IN YOUR INBOX</h2> 
				<form action="https://tinyletter.com/anandsaha" method="post" target="popupwindow" onsubmit="window.open('https://tinyletter.com/anandsaha', 'popupwindow', 'scrollbars=yes,width=800,height=600');return true">
					<p>
						Get new ClipTales emailed to you!
					</p>
					<div className="tacenter">
						<p>
							<input style={{padding: '3px'}} placeholder="Email address" type="text" className="col-xs-8" name="email" id="tlemail" />
							<input type="submit" value="Subscribe" className="col-xs-4 btn btn-default btn-sm" />
						</p>
						<input type="hidden" value="1" name="embed" />
					</div>
				</form>
			</section>
		)
	}
}
