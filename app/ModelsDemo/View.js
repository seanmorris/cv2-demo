import { Model    } from 'curvature/model/Model';
import { Database } from 'curvature/model/Database';

import { View as BaseView } from 'curvature/base/View';

import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';

class ExampleDatabase extends Database
{
	static _version_1(database)
	{
		const eventLog = database.createObjectStore(
			'models-store', {keyPath: 'id'}
		);

		eventLog.createIndex('id',    'id',    {unique: false});
		eventLog.createIndex('class', 'class', {unique: false});
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

		ExampleDatabase.open('models-db', 1).then(db => {

			const store = 'models-store';
			const index = 'id';
			const query = {store, index, type: Model};

			Promise.all(Array(10).fill().map((x,y)=>{

				const id = 1+y;
				const qq = Object.assign({}, query, {range: id});

				const select = db.select(qq);

				return select.one().then(({record,index}) => {
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

						return db.update(record);
					}
					else
					{
						return db.delete(record);
					}

				});
			}).then(() => {

				// db.select(query).each((record, index) => console.log(record, index));

			});
		});
	}

	postRender()
	{
		this.edit = CodeMirror.fromTextArea(this.tags.txt.element, {theme: "elegant"});

		console.log(CodeMirror.modes);

		console.log(this.edit);

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
			id: String(this.args.newId).trim()
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
}
