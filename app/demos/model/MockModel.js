import { Model    } from 'curvature/model/Model';
import { Database } from 'curvature/model/Database';

export class MockModel extends Model
{
	static get keyProps(){ return ['id', 'class'] };

	created = null;
	updated = null;
	deleted = null;
	field   = null;

	constructor()
	{
		super();
	}

	[Database.BeforeRead](detail)
	{
	}

	[Database.AfterRead](detail)
	{
	}

	[Database.BeforeUpdate](detail)
	{
	}

	[Database.BeforeInsert](detail)
	{
		this.created = this.updated = Date.now() / 1000;
	}

	[Database.BeforeWrite](detail)
	{
		this.deleted = null;
		this.updated = Date.now() / 1000;
	}

	[Database.BeforeDelete](detail)
	{
	}

	[Database.AfterDelete](detail)
	{
		this.deleted = Date.now() / 1000;
	}
}
