import { RecordSet } from 'cv2-hyperscroll/RecordSet';

export class SliderRecords extends RecordSet
{
	changed(length)
	{
		length = Number(length);

		this.length = length + (this.header() ? 1 : 0);

		this.content && this.content.splice(length);
	}

	header()
	{
		return {id: 'id', title: 'title', value: 'value'};
		return false;
	}

	count()
	{
		return Number(this.length);
	}

	fetch(k)
	{
		if(k > this.length)
		{
			return;
		}

		const id    = k + (this.header() ? 0 : 1);
		const title = ((k + 0xFF * 0xFF + 30) / 77).toString(36);
		const value = 1024 - k % 1024;

		return {index: k, id, title, value};
	}
}
