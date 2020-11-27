import { View } from 'curvature/base/View';

export class MouseDemo extends View
{
	template = require('./template.html');

	BUTTON_1 = 0x1;
	BUTTON_2 = 0x2;
	BUTTON_3 = 0x4;
	BUTTON_4 = 0x8;
	BUTTON_5 = 0x10;

	constructor(args, parent)
	{
		super(args, parent);

		this.args.buttons = '';

		this.buttons = [];

		this.args.x = 0;
		this.args.y = 0;
		this.args.b = 0;
	}

	mousemove(event)
	{
		this.args.x = event.offsetX;
		this.args.y = event.offsetY;
	}

	mousedown(event)
	{
		event.preventDefault();

		if(event.buttons & this.BUTTON_1)
		{
			this.buttons[1] = 1;
		}

		if(event.buttons & this.BUTTON_2)
		{
			this.buttons[2] = 2;
		}

		if(event.buttons & this.BUTTON_3)
		{
			this.buttons[3] = 3;
		}

		if(event.buttons & this.BUTTON_4)
		{
			this.buttons[4] = 4;
		}

		if(event.buttons & this.BUTTON_5)
		{
			this.buttons[5] = 5;
		}

		this.args.buttons = this.buttons.map(b => `button-pressed-${b}`).join(' ');
	}

	mouseup(event)
	{
		event.preventDefault();

		if(event.buttons ^ this.BUTTON_1)
		{
			delete this.buttons[1];
		}

		if(event.buttons ^ this.BUTTON_2)
		{
			delete this.buttons[2];
		}

		if(event.buttons ^ this.BUTTON_3)
		{
			delete this.buttons[3];
		}

		if(event.buttons ^ this.BUTTON_4)
		{
			delete this.buttons[4];
		}

		if(event.buttons ^ this.BUTTON_5)
		{
			delete this.buttons[5];
		}

		this.args.buttons = this.buttons.map(b => `button-pressed-${b}`).join(' ');
	}

	cancelEvent(event)
	{
		event.preventDefault();
	}

	wheel(event)
	{
		if(this.cancelPulse)
		{
			clearTimeout(this.cancelPulse);

			this.cancelPulse = false;
		}

		if(event.deltaY > 0)
		{
			this.args.wheelPulse = 'yPlus';
		}

		if(event.deltaY < 0)
		{
			this.args.wheelPulse = 'yMinus';
		}

		if(event.deltaX > 0)
		{
			this.args.wheelPulse = 'xPlus';
		}

		if(event.deltaX < 0)
		{
			this.args.wheelPulse = 'xMinus';
		}

		this.cancelPulse = this.onTimeout(100, ()=>this.args.wheelPulse = '');
	}
}
