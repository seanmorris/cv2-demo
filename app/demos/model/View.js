import { Model } from 'curvature/model/Model';

import { MockModel } from './MockModel';

import { Tag } from 'curvature/base/Tag';
import { View as BaseView } from 'curvature/base/View';

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

		this.template = rawquire('./template.html');

		this.args.newClass = 'Mock';
		this.args.newId    = 1;

		this.args.models = [];
		this.modelCount  = 0;

		this.args.content = [...Array(100)].map((v,k)=>k+1);

		this.args.resultScroller = new ModelScroller({rowHeight: 33});

		this.args.rangeValue = 'value';

		this.db = ExampleDatabase.open('models-db', 1);

		this.db.then(db => {
			const store = 'Mock-store';
			const index = 'id';
			const query = {
				store, index, limit: 0
				, map: record => (ModelMap[record.class] || Model).from(record, true)
			};

			// this.args.stores = db.listStores();

			this.args.stores = {
				'Mock-store':   MockModel
				, 'Fake-store': Model
			};

			this.onNextFrame(()=>this.useDb('Mock-store'));

			this.args.queryStore = this.args.stores[0] ?? null;

			db.addEventListener('write', event => {
				const model = event.detail.record;
			});

			db.addEventListener(
				'highWaterMoved'
				, event => {

					switch(event.detail.origin)
					{
						case 'server':
							// console.log(`[ ${event.detail.value} ] Got model ${event.detail.record.id} from server!`);
							break;

						case 'user':
						default:
							// console.log(`[  ${event.detail.value}  ] Send model ${event.detail.record.id} server!`);
							break;
					}
				}
			);

			this.args.created = 0;

			Promise.all(Array(5).fill().map((x,y)=>{

				const id = 1+y;
				const qq = Object.assign({}, query, {range: id});

				this.args.created = id;

				return db.select(qq).then(({index}) => {
					if(index)
					{
						return;
					}

					return db.insert(
						store
						, MockModel.from({id, class: 'Mock'})
						, 'user'
					)
				});
			}))
		});

		this.args.bindTo('queryStore', v => {
			v && this.db.then(db => {
				this.args.queryIndexes = [db.listIndexes(v),db.listIndexes(v)].flat();
			});
		});
	}

	onRender()
	{
		const modelEdit = this.newEditor();

		modelEdit.setValue(rawquire('./ModelMap.js'));

		this.args.modelEdit = modelEdit.display.wrapper;

		const dbEdit = this.newEditor();

		dbEdit.setValue(rawquire('./ExampleDatabase.js'));

		this.args.databaseEdit = dbEdit.display.wrapper;

		this.listen('focusin', event => event.srcElement.select && event.srcElement.select());
		this.listen('cvDomAttached', event => {
			if(!event.target.matches('[data-property=id],[data-property=class],[data-property=created],[data-property=updated],[data-property=deleted]'))
			{
				return;
			}

			if(event.target.tagName !== 'INPUT')
			{
				event.target.querySelector('input').setAttribute('disabled', 'disabled');
			}

			event.target.setAttribute('disabled', 'disabled');
		});
	}

	removeKey(key, index)
	{
		if(['id', 'class'].includes(key))
		{
			return;
		}

		delete this.args.models[index][key];
	}

	addKey(event, key, index, subview)
	{
		event.preventDefault();

		this.args.models[index][key] = this.args.models[index][key] || '';

		subview.args.newField = '';
	}

	closeModel(event, index)
	{
		this.args.models.splice(index,1);
	}

	loadModel(event)
	{
		event && event.preventDefault();

		const query = {
			store: `${this.args.newClass}-store`
			, index: 'id'
			, range: Number(this.args.newId)
			, map: record => (ModelMap[record.class] || Model).from(record, true)
		};

		this.db.then(db => db.select(query)
			.one(record => this.args.models.push(record))
			.then(result => {
				if(result.index !== 0)
				{
					return;
				}

				const model = (ModelMap[this.args.newClass] || Model).from({
					id: Number(this.args.newId), class: this.args.newClass
				});

				model.markDeleted();

				this.args.models.push(model);
			})
		);
	}

	fieldAttached(event)
	{
		if(!event.target.matches('[data-property=id],[data-property=class],[data-property=created],[data-property=updated],[data-property=deleted]'))
		{
			return;
		}

		event.target.setAttribute('disabled', 'disabled');
	}

	queryDatabase(event)
	{
		event.preventDefault();

		const content = [];

		const query = {
			store: this.args.queryStore
			, index: this.args.queryIndex
			, limit: Number(this.args.queryLimit || 0)
			, map: record => (ModelMap[record.class] || Model).from(record, true)
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
			query.range = IDBKeyRange.bound(
				this.isNumeric(this.args.queryValue) ? Number(this.args.queryValue) : this.args.queryValue ?? this.isNumeric(this.args.queryMaxValue) ? 0 : ''
				, this.isNumeric(this.args.queryMaxValue) ? Number(this.args.queryMaxValue) : this.args.queryMaxValue ?? ''
				, false
				, false
			);
		}

		const scroller  = this.args.resultScroller;
		scroller.args.content.splice(0);

		this.db.then(db => db.select(query).each(
			record => content.push(record)
		))
		.then(({index})  => {
			this.args.total = index;

			scroller.args.content = content;
		});
	}

	useDb(selected, event)
	{
		this.args.total = null;

		this.args.resultScroller.args.content = [];

		for(const storeName in this.tags.dbSelectors)
		{
			const tag = this.tags.dbSelectors[storeName];

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
		event.preventDefault();

		const origin = 'user';
		const store  = `${model.class}-store`
		const query  = {store, index: 'id', range: model.id, type: MockModel};

		this.db.then(db => {
			db.select(query).one(record=>{

				const keys = Object.keys(model);

				Object.keys(record).map(k=>{
					if(!keys.includes(k))
					{
						delete record[k];
					}
				});

				const newRecord = Object.assign(record, model);

				db.update(store, newRecord, origin).then(()=>{
					model.markStored();
				});

			}).then(({index})=> {
				if(index === 0)
				{
					db.insert(store, model, origin).then(()=>{
						model.markStored();
					});
				}
			});
		});
	}

	deleteModel(event, model)
	{
		event.preventDefault();

		const origin = 'user';
		const store  = `${model.class}-store`
		const query  = {store, index: 'id', range: model.id, type: MockModel};

		this.db
		.then(db => db.delete(store, model, origin))
		.then(() => model.markDeleted());
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

	newModelEditor(event, model, $subview)
	{
		// console.log(event.target);

		// $subview.onRemove( model.bindTo(Model.Saved, v => {
		// 	$subview.args.saved = !!v;
		// }));
		// $subview.onRemove( model.bindTo(Model.Deleted, v => {
		// 	$subview.args.deleted = !!v;
		// }));

		// $subview.args.saved = model[Model.Saved];
		// $subview.args.saved = model[Model.Saved];
	}
}
