import { RecordSet } from '../lib/RecordSet';

export class SliderRecords extends RecordSet
{
	changed(length)
	{
		length = Number(length);

		this.length = length;

		this.content && this.content.splice(length);
	}

	header()
	{
		return {id: 'id', title: 'title', value: 'value'};
	}

	count()
	{
		return Number(this.length) + 1;
	}

	fetch(k)
	{
		if(k > this.length)
		{
			return;
		}

		const id    = k; //this.header() ? k - 1 : k;
		const title = ((k + 0xFF * 0xFF + 30) / 77).toString(36);
		const value = 1024 - k % 1024;

		return {index: k, id, title, value};
	}
}
