import { Model    } from 'curvature/model/Model';
import { Database } from 'curvature/model/Database';

import { Tag } from 'curvature/base/Tag';
import { View as BaseView } from 'curvature/base/View';

import { InfiniteScroller as Scroller } from '../Experiments/InfiniteScroll/lib/InfiniteScroller';
import { ModelScroller } from './ModelScroller';

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

		this.args.newClass = 'Mock';
		this.args.newId    = 1;

		this.args.models = [];
		this.modelCount  = 0;

		this.args.content = [...Array(100)].map((v,k)=>k+1);

		this.args.resultScroller = new ModelScroller({rowHeight: 33});

		this.db = new Promise((accept, reject) => {
			ExampleDatabase.open('models-db', 1).then(db => {
				accept(db);
			});
		});

		ExampleDatabase.open('models-db', 1).then(db => {
			const store = 'models-store';
			const index = 'id';
			const query = {store, index, type: Model};

			this.args.stores = db.listStores();

			this.args.queryStore = this.args.stores[0] ?? null;

			Promise.all(Array(500).fill().map((x,y)=>{

				const id = 1+y;
				const qq = Object.assign({}, query, {range: id});

				return db.select(qq).one().then(({record,index}) => {
					if(!record)
					{
						return db.insert(store, Model.from({
							id:        id
							, class:   'Mock'
						}));
					}
				});
			}))
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
		const query = {store: 'models-store', index: 'id', range: Number(this.args.newId)};

		this.db.then(db =>{
			db.select(query).one(record=>{

				this.args.models.push(Model.from(record));

			}).then(({index})=> {

				if(index === 0)
				{
					this.args.models.push(Model.from({
						id: Number(this.args.newId)
						, class: this.args.newClass
					}));
				}

			});
		});
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
			, limit: Number(this.args.queryLimit)
		};

		if(this.args.queryLimit === '')
		{
			delete query.limit;
		}

		query.range = this.args.queryValue;

		if(this.args.queryValue === '')
		{
			delete query.range;
		}
		else if(!isNaN(query.range)
			&& query.range.length
			&& query.range == Number(query.range)
			&& query.range.length === String(Number(query.range)).length
		){
			query.range = Number(query.range);
		}

		ExampleDatabase.open('models-db', 1).then(db => {
			this.args.total = null;
			const scroller  = this.args.resultScroller;
			const content   = [];
			db.select(query)
				.each(record => content.push(record))
				.then(({index})  => {
					this.args.total = index;
					scroller.args.content = content;
				});
		});
	}

	useDb(event, database)
	{
		this.args.queryStore = database
	}

	showModelStores(event, $subview)
	{
		$subview.args.saving = 'saving';
	}

	storeModel(event, model, store, $subview)
	{
		const query = {store, index: 'id', range: model.id};

		ExampleDatabase.open('models-db', 1).then(db => {
			db.select(query).one(record=>{

				const keys = Object.keys(model);

				Object.keys(record).map(k=>{
					if(!keys.includes(k))
					{
						delete record[k];
					}
				});

				db.update(store, Object.assign({}, record, model));

			}).then(({index})=> {
				if(index === 0)
				{
					db.insert(store, model);
				}
			});
		});

		$subview.args.saving = '';
	}
}
