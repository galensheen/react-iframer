> React component a layer for message transfer between iframe and parent.

# In React
---
```javascript
// Parent page, which have a iframe page
import React, {Component} from 'react';
import {IFramer} from '@ali/iframer';

class Parent extends Component {
	render() {
		const src='https://the.url.of.iframe.page';
		return (
			<IFramer src={src} />
		);
	}
}
```
```javascript
// Child page，which will iframed in parent page
import React, {Component} from 'react';
import {iframer} from '@ali/iframer';

@iframer
class Child extends Component {
	render() {
		return (
			<div style={{height: 1000}}>
				This is the iframe page.
			</div>
		);
	}
}
```

# IFramer
> React component, which is replace of iframe label
> IFramer component consist of message listener, message executor and message emitter
> IFramer component realized the syncHeight action inside of it, needn't the action again other you need custom syncHeight action.
* src: string required, the url for iframe
* style: object optional，the custom style for iframe label
* width: string || number optional, the width of iframe, default is 100%
* height: string || number optional, the height of iframe, default is 800
* iframeName: string optional, the name for iframe page, which will send to iframe page within the message body as to field
* actions: object optional, method set, the action in set will execute once the iframe send action message to parent page

## IFramer.emit
> Send message to iframe page, e.g.: this.iframe.emit({action: 'updateTimestamp', data: Date.now()})
> the format of message the iframe page received is:
> {action: 'updateTimestamp', data: '150693657122', to: iframeName, source: 'IFramer'}

# iframer
> High Order Component, enhance the iframe component, consist of message listener, message executor and message emitter
> There are 3 types for using:
> * Decorator: add the decorator to iframe component directly
> ```javascript
> @iframer
> class Child extends Component { ... }
> ```
> * Decorator with config: add the decorator with a config
> ```javascript
> const config = {
> 	dom: 'body', // get the DOM with document.querySelector(dom) if set, default DOM is the iframe page component
> 	targetOrigin: 'https://www.xxx.com' // default is '*'
> }
> ```
> * Function
> ```javascript
> class Child extends Component { ... }
> export iframer(Child, config);
> ```

## iframer.emit
> Send message to parent page: this.emit({action: 'updateTimestamp', data: Date.now()})
> The format for message parent received:
> {action: 'updateTimestamp', data: '150693657122', from: iframeName, source: 'IFramer'}

# Example
The requirement:
1. The Parent page need embed a iframe page which we called Child
2. Each page for Parent and Child have a state field with "timestamp" individually) for display
3. There is a Button in Parent need update the timestamp in Child, in turn, same as Child
> There is not some stupid requirement in real world, it's just a demo
> Method: Parent and Child realized the "updateTimestamp" action individually for themselves, the Parent will send action message to iframe to invoke the "updateTimestamp" method, the same as Child.


```javascript
// Parent
import React, {Component} from 'react';
import {IFramer} from 'react-iframer';

class Parent extends Component {
	state = {
		timestamp: 0
	}

	/**
	 * update the timestamp field, for invoking by iframe
	 * there will have no effect if this method was supply
	 * @param timestamp, the data value in message
	 * @param message, the message body
	 */
	updateTimestamp = (timestamp, message) => {
		this.setState({timestamp})
	}

	/**
	 * send action message to iframe page to invoke method in iframe component
	 */
	invokeIframeMethod = (action) => {
		return () => {
			let timestamp = Date.now();
			this.iframe.emit({action, timestamp});
		};
	}

	render() {
		let {timestamp} = this.state;
		let src = 'http://www.iframe.url.page';

		let actions = {updateTimestamp: this.updateTimestamp};

		return (
			<div>
				<div>
				  <button type="primary"
					  onClick={this.invokeIframeMethod('updateTimestamp')}>
				  update the iframe (Child) timestamp
				  </button>
				</div>
				<div>{timestamp}</div>
				<div>
					<Iframer
					src={src}
					iframeName="Child" style={{height: 100}}
					ref={ref => {this.iframe = ref}} actions={actions} />
				</div>
			</div>
		)
	}
}
```

```javascript
// Child
import React, {Component} from 'react';
import {iframer} from '@ali/iframer';
import {Button} from '@alife/next';

@iframer
class Child extends Component {
	state = {
		timestamp: 0
	};

	/**
	 * Update the timestamp field, for invoking by parent's action message
	 * @param timestamp, the data value in message
     * @param message, the message body
	 */
	updateTimestamp = (timestamp, message) => {
		this.setState({timestamp})
	}

	/**
	 * send action message to Parent page
	 */
	invokeParentMethod = (action) => {
		return () => {
			let timestamp = Date.now();
			this.props.emit({action, timestamp});
		};
	}

	render() {
		let {timestamp} = this.state;

		return (
			<div>
				<div>
				  <button onClick={this.invokeParentMethod('updateTimestamp')}>
				  Update Parent's timestamp
				  </button>
				</div>
				<div>{timestamp}</div>
			</div>
		)
	}

}
```
