import { RecordSet } from 'cv2-hyperscroll/RecordSet';

export class Records extends RecordSet
{
	length = 1000000;

	fetch(k)
	{
		return `String #${k}!`;
	}
}
