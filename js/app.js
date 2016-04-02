var my_news = [];

window.ee = new EventEmitter();

var Article = React.createClass({
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
			<div className='card'>
				<p className='card-text'>{text}</p>
			</div>
		)
	}
});

var News = React.createClass({
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
		var newsTemplate;

		if (data.length > 0) {
			newsTemplate = data.map(function(item, index) {
				return (
					<div key={index}>
						<Article data={item} />
					</div>
				)
			})
		} else {
			newsTemplate = <p>Текущих задач нет</p>
		}
		return (
			<div className='cards'>
			<strong className={'cards-count ' + (data.length > 0 ? '':'none') }>Всего задач: {data.length}</strong>
				{newsTemplate}
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
		window.ee.emit('News.add', item);
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
			news: my_news
		};
	},
	componentDidMount: function() {
		var self = this;
		window.ee.addListener('News.add', function(item) {
			var nextNews = item.concat(self.state.news);
			self.setState({news: nextNews});
		});
	},
	componentWillUnmount: function() {
		window.ee.removeListener('News.add');
	},
	render: function() {
		console.log('render');
		return (
			<div className='app'>
				<h3>Новости</h3>
				<News data={this.state.news} />
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
