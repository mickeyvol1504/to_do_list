var my_lists = [];
// var my_cards = [];
window.eList = new EventEmitter();
window.eCard = new EventEmitter();

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
		}
		return (
			<div className='cards'>
				<strong className={'cards-count ' + (data.length > 0 ? '':'none') }>Всего задач: {data.length}</strong>
				{cardsTemplate}
			</div>
		);
	}
});

var AddCard = React.createClass({
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
		window.eCard.emit('Cards.add', item);
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
			<form className='add-card-form'>
				<textarea
					className='add-text'
					onChange={this.onTextChange}
					placeholder='Текст задачи'
					ref='text'>
				</textarea>
				<button
					className='add_card'
					onClick={this.onBtnClickHandler}
					disabled={textIsEmpty}>
					Добавить задачу
				</button>
			</form>
		);
	}
});

var AppCard = React.createClass({
	getInitialState: function() {
		var my_cards = [];
		return {
				cards: my_cards
			};
	},
	componentDidMount: function() {
		var self = this;
		window.eCard.addListener('Cards.add', function(item) {
			// var nextCards = item.concat(self.state.cards);	//Добавление новой заметки на первое место
			var nextCards = self.state.cards.concat(item);
			self.setState({cards: nextCards});
		});
	},
	componentWillUnmount: function() {
		window.eCard.removeListener('Cards.add');
	},
	render: function(index) {
		return (
			<div key={index}>
				<Cards data={this.state.cards} />
			</div>
		);
	}
});

var List = React.createClass({
	propTypes: {
		data: React.PropTypes.shape({
			name: React.PropTypes.string.isRequired
		})
	},
	getInitialState: function() {
		return {
			visible: false
		};
	},
	render: function() {
		var name = this.props.data.name,
			visible = this.state.visible,
			id = name.trim();
		return (
			<div className='list' id={id}>
				<h3>{name}</h3>
				<AppCard />
				<AddCard />
			</div>
		)
	}
});

var Lists = React.createClass({
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
		var listsTemplate;

		if (data.length > 0) {
			listsTemplate = data.map(function(item, index) {
				return (
					<div key={index}>
						<List data={item} />
					</div>
				)
			})
		}
		return (
			<div className='lists'>
				{listsTemplate}
			</div>
		);
	}
});

var AddList = React.createClass({
	getInitialState: function() {
		return {
			nameIsEmpty: true
		};
	},
	componentDidMount: function() {
		ReactDOM.findDOMNode(this.refs.name).focus();
	},
	onBtnClickHandler: function(e) {
		e.preventDefault();
		var nameEI = ReactDOM.findDOMNode(this.refs.name);
		console.log(nameEI); 
		var name = nameEI.value;
		var item = [{
			name: name
		}];
		window.eList.emit('Lists.add', item);
		nameEI.value = '';
		this.setState({nameIsEmpty: true});
	},
	onNameChange: function(e) {
		if (e.target.value.trim().length > 0) {
			this.setState({nameIsEmpty:false})
		} else {
			this.setState({nameIsEmpty:true})
		}
	},
	render: function() {
		var 	nameIsEmpty = this.state.nameIsEmpty;
		return (
			<ul className='add-list'>
				<li>
					<input
					type="text"
					onChange={this.onNameChange}
					placeholder='Имя доски'
					ref='name' />
				</li>
				<li>
					<button
					onClick={this.onBtnClickHandler}
					disabled={nameIsEmpty}>
					Добавить доску
					</button>
				</li>
			</ul>
		);
	}
});

var AppList = React.createClass({
	getInitialState: function() {
		return {
			lists: my_lists
		};
	},
	componentDidMount: function() {
		var self = this;
		window.eList.addListener('Lists.add', function(item) {
			var nextLists = self.state.lists.concat(item);
			self.setState({lists: nextLists});
		});
	},
	componentWillUnmount: function() {
		window.eList.removeListener('Lists.add');
	},
	render: function() {
		return (
			<div className='app-list'>
				<Lists data={this.state.lists} />
			</div>
		);
	}
});

ReactDOM.render(
	<div className="menu-wrap">
		<h1>Доска задач</h1>
		<AddList />
	</div>,
	document.getElementById('menu')
);

ReactDOM.render(
	<div className="lists-wrap">
		<AppList />
	</div>,
	document.getElementById('content')
);
