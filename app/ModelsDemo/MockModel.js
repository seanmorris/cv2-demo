import { Model    } from 'curvature/model/Model';
import { Database } from 'curvature/model/Database';

export class MockModel extends Model
{
	static get keyProps(){ return ['id', 'class'] };

	constructor()
	{
		super();

		this.created = null;
		this.updated = null;
		this.deleted = null;
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
