import { RecordSet } from '../lib/RecordSet';

export class SliderRecords extends RecordSet
{
	changed(length)
	{
		this.length = length;
	}

	header()
	{
		return {id: 'id', title: 'title', value: 'value'};
	}

	fetch(k)
	{
		const value = k
		const id    = (0xFFFFFF * Math.random()).toString(36)
		const title = '';

		return {index: k, id, title, value};
	}
}
