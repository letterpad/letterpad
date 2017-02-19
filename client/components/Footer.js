import React, { Component } from 'react'

export default class Footer extends Component {

	render() {

		let d = new Date()

		return (
			<footer className="text-center copy site-footer"> 
				<p> 
					© {d.getFullYear()} ClipTales by Anand Saha, Theme by <a target='_blank' href="http://ajaxtown.com/"> Ajaxtown</a> 
				</p> 
			</footer>
		)
	}
}