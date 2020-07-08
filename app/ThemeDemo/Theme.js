export class Theme
{
	static get(key = '')
	{
		if(!this.instances)
		{
			this.instances = {};
		}

		if(!this.instances[key])
		{
			this.instances[key] = new this(key);
		}

		return this.instances[key];
	}

	constructor(key)
	{
		this.key         = key;
		this.viewMap     = new Map();
		this.templateMap = new Map();
		this.fallbacks   = [];
	}

	setFallback(...fallbacks)
	{
		this.fallbacks.push(...fallbacks);

		return this;
	}

	setView(type, viewType)
	{
		this.viewMap.set(type, viewType);

		return this;
	}

	getView(object)
	{
		const type = this.resolve(object, 'viewMap');

		if(!type)
		{
			return null;
		}

		const view = new type(object);

		return view;
	}

	setTemplate(type, template)
	{
		this.templateMap.set(type, template);

		return this;
	}

	getTemplate(object)
	{
		return this.resolve(object, 'templateMap');
	}

	resolve(object, whichMap)
	{
		if(object.___object___ && object.isBound)
		{
			object = object.___object___;
		}

		const type = object.constructor;
		const map  = this[whichMap];

		if(map.has(type))
		{
			return map.get(type);
		}

		let result = null;

		for(const [key, value] of map)
		{
			if(type.prototype instanceof key)
			{
				result = value;
			}
		}

		if(!result)
		{
			for(const theme of this.fallbacks)
			{
				if(result = theme.resolve(object, whichMap))
				{
					return result;
				}
			}
		}

		if(result)
		{
			map.set(type, result);
		}

		return result;
	}
}
