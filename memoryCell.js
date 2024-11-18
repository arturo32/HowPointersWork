export default {
	template: `<div class="memory-cell">{{value}}</div>`,
	data() {
		return {
			componentName: 'MemoryCell',
		};
	},
	props: ['value'],
}
