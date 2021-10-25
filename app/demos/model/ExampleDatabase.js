import { Database } from 'curvature/model/Database';

export class ExampleDatabase extends Database
{
	_version_1(database)
	{
		const mockModelStore = this.createObjectStore('Mock-store', {
			highWater: 'updated'
			, keyPath: 'id'
		});

		mockModelStore.createIndex('id', 'id', {unique: true});

		const fakeModelStore = this.createObjectStore('Fake-store', {
			highWater: 'id'
			, keyPath: 'id'
		});

		fakeModelStore.createIndex('id', 'id', {unique: true});
	}
}
