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
		this.tags.frame.style({position: 'absolute'});

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
			transform: `translate(-50%,-100%)`
			, left:    `${event.x}px`
			, top:     `${event.y}px`
		});

		[...nodes].map(node => frame.element.appendChild(node));

		this.stop = this.listen(document, 'mousemove', e => this.drag(e));
	}

	drag(event)
	{
		if(this.grabIndex === false)
		{
			return;
		}

		this.tags.frame.style({
			transition: undefined
			, left:     `${event.clientX}px`
			, top:      `${event.clientY}px`
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
		const frame = this.tags.frame;

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

		const dragFrom = this.dragFrom;

		const newCenter   = this.getCenter(newParent);
		const frameCenter = this.getCenter(frame);
		const offset      = this.getOffset(newCenter, frameCenter);

		const duration    = Math.max(
			120
			, Math.min(
				Math.sqrt(offset.x**2 + offset.y**2)
				, 360
			)
		);

		frame.style({
			transition:  ['top', 'left', 'transform'].map(
				p => `${p} ${duration}ms ease-out`
			).join(', ')
			, transform: `translate(-50%,-50%)`
			, top:       `${newCenter.y}px`
			, left:      `${newCenter.x}px`
		});

		const grabIndex = this.grabIndex;

		this.grabIndex = false;

		this.onTimeout(duration, () => {
			while(frame.firstChild)
			{
				dragFrom.appendChild(frame.firstChild);
			}

			this.setCursor('');

			this.stop && this.stop();

			this.callback && this.callback(grabIndex, index);

			this.stop = this.dragging = false;
		});

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

	getOffset(a, b)
	{
		return {x: a.x - b.x, y: a.y - b.y};
	}

	getCenter(tag)
	{
		const rect = tag.getBoundingClientRect();
		const x    = rect.width / 2 + rect.x;
		const y    = rect.height / 2 + rect.y;

		return {x,y};
	}
}
