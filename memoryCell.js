export default {
	template: `<div class="memory-cell">
					<div class="address">{{ variable[1][1] }}</div>	
					<div class="content">{{ variable[1][3] }}</div>	
					<div class="name">{{ variable[0] }}</div>	
				</div>`,
	data() {
		return {
			componentName: 'MemoryCell',
		};
	},
	props: ['variable'],
}
