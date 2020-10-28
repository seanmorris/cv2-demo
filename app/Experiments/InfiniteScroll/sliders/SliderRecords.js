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
		const id    = k + 1;
		const title = ((k + 0xFF * 0xFF + 30) / 77).toString(36);
		const value = k % 100;

		return {index: k, id, title, value};
	}
}
