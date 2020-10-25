import { View } from 'curvature/base/View';

export class DragDrop extends View
{
	constructor(args, parent, callback)
	{
		super(args, parent);

		this.template = require('./drag-drop');

		this.dragging = false;
		this.callback = callback;

		this.originalCursor = document.documentElement.style.cursor;

		this.onRemove(() => {
			document.documentElement.style.cursor = this.originalCursor;
		});
	}

	setCursor(cursor)
	{
		document.documentElement.style.cursor = cursor;

		if(cursor)
		{
			document.documentElement.style.userSelect = 'none';
		}
		else
		{
			document.documentElement.style.userSelect = null;			
		}
	}

	attached()
	{
		this.tags.frame.style({
			position:    'absolute'
			, transform: 'translate(-50%,-100%)'
		});

		this.tags.stage.style({
			pointerEvents: 'none'
			, position:    'fixed'
			, width:       '100%'
			, height:      '100%'
		});
	}

	grab(event, parent, index)
	{
		if(this.dragging)
		{
			return;
		}

		const nodes = parent.childNodes;

		const cvDragDrop = new CustomEvent('cvDragGrab', {cancelable: true});

		if(!parent.dispatchEvent(cvDragDrop))
		{
			this.setCursor(null);
			return false;
		}

		this.setCursor('grabbing');

		this.grabIndex = index;
		this.dragging  = true;

		const stage = this.tags.stage;
		const frame = this.tags.frame;

		frame.style({
			left:  `${event.x}px`
			, top: `${event.y}px`
		});

		[...nodes].map(node => frame.element.appendChild(node));
		
		this.stop = this.listen(document, 'mousemove', e => this.drag(e));
	}

	drag(event)
	{
		this.tags.frame.style({
			left:  `${event.clientX}px`
			, top: `${event.clientY}px`
		});

		const hovering = document.elementFromPoint(event.clientX, event.clientY);

		if(hovering && hovering !== this.hovering)
		{
			if(this.hovering && !this.hovering.contains(hovering))
			{
				this.hovering.dispatchEvent(new CustomEvent(
					'cvDragUnhover', {bubbles: true}
				));
			}

			hovering.dispatchEvent(new CustomEvent(
				'cvDragHover', {bubbles: true}
			));
		}

		this.hovering = hovering;
	}

	drop(event, newParent, index)
	{
		const frame = this.tags.frame.element;

		if(!this.hovering)
		{
			return false;
		}

		const cvDragDrop = new CustomEvent('cvDragDrop', {cancelable: true});

		newParent.dispatchEvent(new CustomEvent('cvDragUnhover'));

		if(!newParent.dispatchEvent(cvDragDrop))
		{
			return false;
		}

		while(frame.firstChild)
		{
			this.dragFrom.appendChild(frame.firstChild);
		}

		this.callback && this.callback(this.grabIndex, index);

		this.stop && this.stop();

		this.grabIndex = this.stop = this.dragging = false;

		this.setCursor('');

		return true;
	}

	containerMousedown(event, tag, index)
	{
		if(this.dragging)
		{
			return;
		}

		if(event.button !== 0)
		{
			return;
		}

		this.dragFrom = tag;

		this.grab(event, tag, index);

		this.listen(document, 'mouseup', (event) => {
			if(this.dragFrom)
			{
				this.drop(event, this.dragFrom, this.grabIndex);
			}
		}, {once: true});
	}

	containerMouseup(event, tag, index)
	{
		if(!this.dragging)
		{
			return;
		}

		const existing = [...tag.childNodes];

		const frame = this.tags.frame.element;

		if(this.drop(event, tag, index))
		{
			this.dragFrom = false;
		}
		else if(this.dragFrom)
		{
			this.drop(event, this.dragFrom, this.grabIndex);
		}
		
		this.setCursor(null);
	}
}
