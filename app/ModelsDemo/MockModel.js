import { Model    } from 'curvature/model/Model';
import { Database } from 'curvature/model/Database';

export class MockModel extends Model
{
	constructor()
	{
		super();

		this.created = 0;
		this.updated = 0;
		this.deleted = 0;
	}

	[Database.BeforeUpdate](detail)
	{
		this.updated = Date.now();
	}

	[Database.BeforeInsert](detail)
	{
		this.created = this.updated = Date.now();
	}
}
