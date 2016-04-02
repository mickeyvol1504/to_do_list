var my_cards = [];

window.ee = new EventEmitter();

var Card = React.createClass({
	propTypes: {
		data: React.PropTypes.shape({
			text: React.PropTypes.string.isRequired
		})
	},
	getInitialState: function() {
		return {
			visible: false
		};
	},
	render: function() {
		var text = this.props.data.text,
			visible = this.state.visible;
		return (
			<div className='card'>{text}	</div>
		)
	}
});

var Cards = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired
	},
	getInitialState: function() {
		return {
			counter: 0
		}
	},
	render: function() {
		var data = this.props.data;
		var cardsTemplate;

		if (data.length > 0) {
			cardsTemplate = data.map(function(item, index) {
				return (
					<div key={index}>
						<Card data={item} />
					</div>
				)
			})
		} else {
			cardsTemplate = <p>Текущих задач нет</p>
		}
		return (
			<div className='cards'>
			<strong className={'cards-count ' + (data.length > 0 ? '':'none') }>Всего задач: {data.length}</strong>
			{cardsTemplate}
			</div>
		);
	}
});

var Add = React.createClass({
	getInitialState: function() {
		return {
			textIsEmpty: true
		};
	},
	componentDidMount: function() {
		ReactDOM.findDOMNode(this.refs.text).focus();
	},
	onBtnClickHandler: function(e) {
		e.preventDefault();
		var textEl = ReactDOM.findDOMNode(this.refs.text);
		var text = textEl.value;
		var item = [{
			text: text,
		}];
		window.ee.emit('Cards.add', item);
		textEl.value = '';
		this.setState({textIsEmpty: true});
	},
	onTextChange: function(e) {
		if (e.target.value.trim().length > 0) {
			this.setState({textIsEmpty:false})
		} else {
			this.setState({textIsEmpty:true})
		}
	},
	render: function() {
		var 	textIsEmpty = this.state.textIsEmpty;
		return (
			<form className='add-form'>
				<textarea
					className='add-text'
					onChange={this.onTextChange}
					placeholder='Текст задачи'
					ref='text'
				></textarea>
				<button
					className='add_btn'
					onClick={this.onBtnClickHandler}
					ref='alert_button'
					disabled={textIsEmpty}
					>
					Добавить задачу
				</button>
			</form>
		);
	}
});

var App = React.createClass({
	getInitialState: function() {
		return {
			cards: my_cards
		};
	},
	componentDidMount: function() {
		var self = this;
		window.ee.addListener('Cards.add', function(item) {
			var nextCards = item.concat(self.state.cards);
			self.setState({cards: nextCards});
		});
	},
	componentWillUnmount: function() {
		window.ee.removeListener('Cards.add');
	},
	render: function() {
		console.log('render');
		return (
			<div className='app'>
				<h3>Задачи</h3>
				<Cards data={this.state.cards} />
			</div>
		);
	}
});

ReactDOM.render(
	<Add />,
	document.getElementById('menu')
);

ReactDOM.render(
	<App />,
	document.getElementById('content')
);
