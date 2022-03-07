import { View } from 'curvature/base/View';
import { Elicit } from 'curvature/net/Elicit';

export class ProgressExample extends View
{
	template = require('./progress-example.html');

	constructor(args, parent)
	{
		super(args, parent)

		this.args.download = 'start';
	}

	loadImage()
	{
		this.args.loading  = true;
		this.args.percent  = 0;
		this.args.chunks   = [];
		this.args.imgsrc   = '';
		this.args.error    = '';

		const origin = 'https://random.imagecdn.app';
		const elicit = new Elicit(
			`${origin}/${1920*3}/${1080*3}?random=${1/Math.random()}`
			, {timeout: 4000}
		);

		// Define a success case
		elicit.objectUrl().then(url => this.args.imgsrc = url);

		// Handle failure
		elicit.catch(error => this.args.error = error.stack ?? error);

		// Enable retries
		elicit.addEventListener('error', event => event.preventDefault());

		// Clean up afterward
		elicit.finally(() => this.args.loading = false);

		// Watch for progress
		elicit.addEventListener('progress', event => {
			const percent = this.args.percent = (event.detail.done * 100).toFixed(3);
			const chunkSize = event.detail.value ? event.detail.value.length : 0;
			const {received, length} = event.detail;

			this.args.download = 'refresh';

			this.args.chunks.unshift(
				`${percent}% ${chunkSize} bytes (total ${received} / ${length} bytes)`
			);

		});

		let i = 0;
	}
}
