import { RecordSet } from '../lib/RecordSet';

export class Records extends RecordSet
{
	length = 1000001;

	fetch(k)
	{
		return `String #${k}!`;
	}
}
