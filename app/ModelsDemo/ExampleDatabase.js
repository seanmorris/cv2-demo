import { Database } from 'curvature/model/Database';

export class ExampleDatabase extends Database
{
	static _version_1(database)
	{
		const mockModelStore = database.createObjectStore(
			'Mock-store', {keyPath: 'id'}
		);

		mockModelStore.createIndex('id', 'id', {unique: true});

		const fakeModelStore = database.createObjectStore(
			'Fake-store', {keyPath: 'id'}
		);

		fakeModelStore.createIndex('id', 'id', {unique: true});
	}
}
