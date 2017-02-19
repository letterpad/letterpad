import React, {Component} from 'react'

export default class About extends Component {
	
	constructor(props){
		super(props);
	}
	render() {
        return (
            <section className="widget">      
                <h2 className="widget-title">About</h2>     
                ClipTales is about framing a story using paperclips and a little bit of imagination. 
                It begins with a plot in mind, and a couple of paperclips in hand. 
                And ends with a few stickmen trying to realise what I had imagined. I try to do them justice to the best of my ability :)

        		<p>Hope you like them!</p>
				<p>Created by Anand Saha from India </p>
				<p>PS: I primarily post cliptales to my <strong>instagram</strong> account 
					<a href='http://www.instagram.com/anand.saha'> @anand.saha</a> and <strong>facebook </strong> 
					 account <a href='http://www.facebook.com/cliptales'>@cliptales</a>. 
					Join me there if you can.
				</p>
            </section>
        )
	}
}