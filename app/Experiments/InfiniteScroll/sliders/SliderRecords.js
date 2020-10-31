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
		const id    = k;
		const title = ((k + 0xFF * 0xFF + 30) / 77).toString(36);
		const value = 1024 - k % 1024;

		return {index: k, id, title, value};
	}
}
