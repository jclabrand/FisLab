
/****************************************************************************************

	Copyright (c) 2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';

/****************************************************************************************/

class Timekeeper extends React.Component {
	constructor(props) {
		super(props);

		this.clock = {
			m: 0, s: 0, c: 0
		};
	}

	componentDidMount() {

	}

	play() {
		this.control = setInterval(this.onClock.bind(this), 10);
	}

	stop() {
		clearInterval(this.control);
		this.clock = {
			m: 0, s: 0, c: 0
		};

		this.refs.min.innerHTML = ':00';
		this.refs.sec.innerHTML = ':00';
		this.refs.cen.innerHTML = ':00';
	}

	onClock() {
		if (this.clock.c < 99) {
			this.clock.c++;
			if (this.clock.c < 10) { this.clock.c = '0'+this.clock.c; }
			this.refs.cen.innerHTML = ':'+this.clock.c;
		}
		if (this.clock.c == 99) {
			this.clock.c = -1;
		}
		if (this.clock.c == 0) {
			this.clock.s ++;
			if (this.clock.s < 10) { this.clock.s = '0'+this.clock.s; }
			this.refs.sec.innerHTML = ':'+this.clock.s;
		}
		if (this.clock.s == 59) {
			this.clock.s = -1;
		}
		if ( (this.clock.c == 0)&&(this.clock.s == 0) ) {
			this.clock.m++;
			if (this.clock.m < 10) { this.clock.m = '0'+this.clock.m; }
			this.refs.min.innerHTML = ':'+this.clock.m;
		}
		if (this.clock.m == 59) {
			this.clock.m = -1;
		}
	}

	render() {
		return (
			<div className="">
				<div ref="min" className="timekeeper-label">00</div>
				<div ref="sec" className="timekeeper-label">:00</div>
				<div ref="cen" className="timekeeper-label">:00</div>
			</div>
		);
	}
}

class Renderer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			status: 'loading'
		};
	}

	componentDidMount() {
		let element = this.refs.viewport;
		this.loadScript('/js/fislab.render-engine.min.js', ()=>{
			this.renderer = new window.fislab.RenderEngine;
			this.physics = new Worker('/js/fislab.physics-engine.min.js');

			this.setState({status: 'ready'});

			this.renderer.create({viewElement: element});

			this.physics.onmessage = this.onPhysicsUpdate.bind(this);
			this.physics.postMessage({action: 'create', dt: 1/60});
		});
	}

	loadScript(url, callback){
		var script = document.createElement('script');
		script.type = 'text/javascript';

		if(script.readyState){  //IE
			script.onreadystatechange = function(){
				if(script.readyState == 'loaded' || script.readyState == 'complete'){
					script.onreadystatechange = null;
					callback();
				}
			};
		} else {  //Others
			script.onload = function(){
				setTimeout(()=>{
					callback();
				}, 2000);
			};
		}

		script.src = url;
		//document.getElementsByTagName('head')[0].appendChild(script);
		document.body.appendChild(script);
	}

	onStartStop() {
		switch (this.state.status) {
		case 'play':
			this.refs.timer.stop();
			this.setState({status: 'stop'});
			break;
		case 'ready':
		case 'stop':
			this.refs.timer.play();
			this.physics.postMessage({action: 'reset'});
			this.setState({status: 'play'});
			break;
		default:
			break;
		}
	}

	onPhysicsUpdate(e) {
		this.renderer.update(e.data);
	}

	render() {
		let IconStop = this.props.stopIcon,
			IconPlay = this.props.playIcon;

		return (
			<div className="render">
				<div ref="viewport" className="render-container">
				</div>
				{
					this.state.status === 'loading' ?
						<div className="render-loader-container">
							<div className="render-loader">
							</div>
						</div>
						:
						<div className="render-controls">
							<button className="render-control-start" onClick={this.onStartStop.bind(this)}>
								{
									this.state.status === 'play' ? <IconStop style={{width: '1rem', fill: 'white'}}/> : null
								}
								{
									(this.state.status === 'ready' || this.state.status === 'stop') ?
										<IconPlay style={{width: '1rem', fill: 'white'}}/> : null
								}
							</button>
							<Timekeeper ref="timer"/>
						</div>
				}
			</div>
		);
	}
}

export {Renderer};
