import { RecordSet } from '../lib/RecordSet';

export class Records extends RecordSet
{
	length = 1000000;

	fetch(k)
	{
		return `String #${k}!`;
	}
}
