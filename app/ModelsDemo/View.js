import { Model    } from 'curvature/model/Model';
import { Database } from 'curvature/model/Database';

import { Tag } from 'curvature/base/Tag';
import { View as BaseView } from 'curvature/base/View';

import { InfiniteScroller as Scroller } from '../Experiments/InfiniteScroll/lib/InfiniteScroller';

import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';

class ExampleDatabase extends Database
{
	static _version_1(database)
	{
		const modelStore = database.createObjectStore(
			'models-store', {keyPath: 'id'}
		);

		modelStore.createIndex('id',    'id',    {unique: false});
		modelStore.createIndex('class', 'class', {unique: false});
	}
}

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		this.args.newClass = 'Fake';
		this.args.newId    = 1;

		this.args.models = [];
		this.modelCount  = 0;

		this.args.content = [1,2,3];

		this.args.resultScroller = new Scroller({rowHeight: 33});

		ExampleDatabase.open('models-db', 1).then(db => {
			const store = 'models-store';
			const index = 'id';
			const query = {store, index, type: Model};

			this.args.stores = db.listStores();

			this.args.queryStore = this.args.stores[0] ?? null;

			Promise.all(Array(10).fill().map((x,y)=>{

				const id = 1+y;
				const qq = Object.assign({}, query, {range: id});

				return db.select(qq).one().then(({record,index}) => {
					if(!record)
					{
						return db.insert(store, Model.from({
							id:        id
							, class:   'Mock'
							, created: Date.now()
						}));
					}
				});
			})).then(() => {

				return db.select(query).each((record, index)=>{

					if(record.id > 6)
					{
						record.consume({updated: Date.now()});

						return db.update(store, record);
					}
					else
					{
						return db.delete(store, record);
					}

				});
			}).then(() => {

				// db.select(query).each((record, index) => console.log(record, index));

			});
		});

		this.args.bindTo('queryStore', v => {

			if(!v) return;

			ExampleDatabase.open('models-db', 1).then(db => {
				this.args.queryIndexes = db.listIndexes(v);
			});
		});
	}

	postRender()
	{
		const exampleSource = `// sample code to test out CodeMirror
// as a replacement for ACE-editor
function findSequence(goal) {
  function find(start, history) {
    if (start == goal)
      return history;
    else if (start > goal)
      return null;
    else
      return find(start + 5, "(" + history + " + 5)") ||
             find(start * 3, "(" + history + " * 3)");
  }
  return find(1, "1");
}`;

		const textbox = new Tag(`<textarea>`);

		const editor = CodeMirror(textbox, {
			theme:        'elegant'
			, autoRefresh: true
			, mode:        'javascript'
		});

		editor.setValue(exampleSource);
		textbox.value = 123;
		this.onNextFrame(()=> editor.refresh());

		this.args.editor = editor.display.wrapper;

		this.listen(
			this
			, 'focusin'
			, event => event.srcElement.select
				&& event.srcElement.select()
		);
	}

	removeKey(key, index)
	{
		if(['id', 'class'].includes(key))
		{
			return;
		}

		delete this.args.models[index][key];
	}

	addKey(event, key, index)
	{
		event.preventDefault();

		this.args.models[index][key] = this.args.models[index][key] || '';
	}

	closeModel(event, index)
	{
		this.args.models.splice(index,1);
	}

	loadModel()
	{
		this.args.models.push(Model.from({
			id: Number(this.args.newId)
			, class: this.args.newClass
		}));
	}

	fieldAttached(event)
	{
		if(!event.target.matches('[data-property=id],[data-property=class]'))
		{
			return;
		}

		event.target.setAttribute('disabled', 'disabled');
	}

	queryDatabase(event)
	{
		event.preventDefault();

		const query = {
			store: this.args.queryStore
			, index: this.args.queryIndex
			, range: Number(this.args.queryValue) == this.args.queryValue
				? Number(this.args.queryValue)
				: this.args.queryValue
			, limit: Number(this.args.queryLimit)
		};

		ExampleDatabase.open('models-db', 1).then(db => {

			db.listIndexes(this.args.queryStore);

			const scroller = this.args.resultScroller;
			const content  =  [];

			this.args.total       = null;

			scroller.args.content && scroller.args.content.splice(0);

			db.select(query)
				.each(record => content.push(JSON.stringify(record)))
				.then(({index})  => {
					this.args.total = index;
					scroller.args.content = content;

					console.log(content);
				});
		});
	}

	useDb(event, database)
	{
		this.args.queryStore = database
	}
}
