import { Model    } from 'curvature/model/Model';
import { Database } from 'curvature/model/Database';

import { View as BaseView } from 'curvature/base/View';

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

				db.select(query).each((record, index) => console.log(record, index));

			});
		});
	}

	removeKey(key)
	{
		if(['id', 'class'].includes(key))
		{
			return;
		}

		delete this.args.model[key];
	}

	addKey(key)
	{
		this.args.model[key] = this.args.model[key] || '';
	}

	loadModel()
	{
		this.args.model = Model.from({
			id: this.args.newId
			, class: this.args.newClass
		});
	}
}
