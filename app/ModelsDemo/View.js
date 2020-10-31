import { Model } from 'curvature/model/Model';

import { Tag } from 'curvature/base/Tag';
import { View as BaseView } from 'curvature/base/View';

import { InfiniteScroller as Scroller } from '../Experiments/InfiniteScroll/lib/InfiniteScroller';

import { ModelScroller } from './ModelScroller';
import { ExampleDatabase } from './ExampleDatabase';

import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';

import { rawquire } from 'rawquire/rawquire.macro';

import { ModelMap } from './ModelMap';

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

		this.args.rangeValue = 'value';

		this.db = new Promise((accept, reject) => {
			ExampleDatabase.open('models-db', 1).then(db => {
				accept(db);
			});
		});

		ExampleDatabase.open('models-db', 1).then(db => {
			const store = 'Mock-store';
			const index = 'id';
			const query = {store, index, limit: 0, type: Model};

			this.args.stores = db.listStores();

			this.onNextFrame(()=>this.useDb('Mock-store'));

			this.args.queryStore = this.args.stores[0] ?? null;

			Promise.all(Array(500).fill().map((x,y)=>{

				const id = 1+y;
				const qq = Object.assign({}, query, {range: id});

				return db.select(qq).then(({index}) => {
						if(index)
						{
							return;
						}

						return db.insert(store, Model.from({
							class: 'Mock'
							, id:  id
						}));
					});
			}))
		});

		this.args.bindTo('queryStore', v => {

			if(!v) return;

			ExampleDatabase.open('models-db', 1).then(db => {
				this.args.queryIndexes = [db.listIndexes(v),db.listIndexes(v)].flat();
			});
		});
	}

	postRender()
	{
		const modelEdit = this.newEditor();

		modelEdit.setValue(rawquire('./ModelMap.js'));

		this.args.modelEdit = modelEdit.display.wrapper;

		const dbEdit = this.newEditor();

		dbEdit.setValue(rawquire('./ExampleDatabase.js'));

		this.args.databaseEdit = dbEdit.display.wrapper;

		this.listen('focusin', event => event.srcElement.select && event.srcElement.select());
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
		const query = {
			store: `${this.args.newClass}-store`
			, index: 'id'
			, range: Number(this.args.newId)
		};

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
			, limit: Number(this.args.queryLimit || 0)
			, type: Model
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

		if(this.args.advancedValue)
		{
			console.log(
				this.isNumeric(this.args.queryValue) ? Number(this.args.queryValue) : this.args.queryValue ?? ''
				, this.isNumeric(this.args.queryMaxValue) ? Number(this.args.queryMaxValue) : this.args.queryMaxValue ?? ''
				, false
				, false
			);

			query.range = IDBKeyRange.bound(
				this.isNumeric(this.args.queryValue) ? Number(this.args.queryValue) : this.args.queryValue ?? this.isNumeric(this.args.queryMaxValue) ? 0 : ''
				, this.isNumeric(this.args.queryMaxValue) ? Number(this.args.queryMaxValue) : this.args.queryMaxValue ?? ''
				, false
				, false
			);
		}

		console.log(query);

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

	useDb(selected, event)
	{
		this.args.total = null;

		this.args.resultScroller.args.content = [];

		for(const storeName in this.tags.dbSelectors)
		{
			const tag = this.tags.dbSelectors[storeName];

			console.log(storeName);

			if(storeName === selected)
			{
				tag.parent.args.active = 'db-active';
				continue;
			}

			tag.parent.args.active = '';
		}

		this.args.queryStore = selected;
	}

	storeModel(event, model)
	{
		const store = `${model.class}-store`
		const query = {store, index: 'id', range: model.id, type: Model};

		ExampleDatabase.open('models-db', 1).then(db => {
			db.select(query).one(record=>{

				const keys = Object.keys(model);

				Object.keys(record).map(k=>{
					if(!keys.includes(k))
					{
						delete record[k];
					}
				});

				const newRecord = Object.assign({}, record, model);

				console.log(model, record, newRecord);

				db.update(store, newRecord).then(()=>{
					model.stored();
					console.log('!!');
				});

			}).then(({index})=> {
				if(index === 0)
				{
					db.insert(store, model).then(()=>{
						model.stored();
					});

					model.stored();
				}
			});
		});
	}

	newEditor()
	{
		const textbox = new Tag(`<textarea>`);

		const editor = CodeMirror(textbox, {
			theme:        'elegant'
			, autoRefresh: true
			, mode:        'javascript'
		});

		this.onNextFrame(()=> editor.refresh());

		return editor;
	}

	advancedValue()
	{
		this.args.advancedValue = !this.args.advancedValue;

		this.args.rangeValue = this.args.advancedValue
			? 'range'
			: 'value';
	}

	isNumeric(input)
	{
		if(!isNaN(input)
			&& input.length
			&& input == Number(input)
			&& input.length === String(Number(input)).length
		){
			return true;
		}

		return false;
	}
}
