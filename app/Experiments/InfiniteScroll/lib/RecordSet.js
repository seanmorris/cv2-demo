import { Bindable } from 'curvature/base/Bindable';

const _Fetch = Symbol('_Fetch');

export class RecordSet
{
	length  = 0;

	constructor()
	{
		this.length = 1000000;

		const get = (t, k) => {

			if(k === 'length')
			{
				return this.count();
			}

			if(typeof k === 'symbol' || parseInt(k) !== Number(k))
			{
				return t[k];
			}

			return this[_Fetch](Number(k));
		};

		const set = (t, k, v) => {

			if(typeof k === 'symbol' || parseInt(k) !== Number(k))
			{
				return true;
			}

			return true;
		};

		const del = (t, k) => {
			return true;
		};

		return new Proxy(Bindable.make(this), {get, set, delete:del});
	}

	count()
	{
		const offset = this.header()
			? -1
			: 0;

		return this.length - offset;
	}

	header()
	{
		return false;
	}

	[_Fetch](k)
	{
		const header = this.header();

		if(k === 0 && header)
		{
			header.___header = 'is-header';

			return header;
		}

		const offset = header
			? -1
			: 0;

		if(!this.content)
		{
			this.content = [];
		}

		if(this.content[k + offset])
		{
			return this.content[k + offset];
		}

		return this.content[k + offset] = this.fetch(k + offset);
	}

	fetch(k)
	{
		return undefined;
	}
}
