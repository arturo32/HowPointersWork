export default {
	template: `<div :class="'memory-cell ' + 'memory-cell-' + variable[1][1]">
					<div class="address">{{ variable[1][1] }}</div>	
					<div class="content">{{ variable[1][3] }}</div>	
					<div class="name">{{ variable[0] }}</div>	
				</div>`,
	data() {
		return {
			componentName: 'MemoryCell',
		};
	},
	props: {
		variable: {
			type: [String, [String]],
			required: true,
		}
	},
	mounted() {
		if(this.variable[1][2] === 'pointer') {
			const pointerCell = document.querySelector('.memory-cell-' + this.variable[1][1]);
			const pointedCell =  document.querySelector('.memory-cell-' + this.variable[1][3]);
			globalArrows.push(new LeaderLine(
				pointerCell,
				pointedCell,
				{
					path: 'fluid',
					startSocket: 'right',
					endSocket: 'right',
					startSocketGravity: [20, 0],
					endSocketGravity: [20, 0],
					endPlug: 'arrow3',
					size: 2,
					endPlugSize: 2,
					color: getComputedStyle(document.body).getPropertyValue('--cell-border')
				}
			));
		}
	}
}
