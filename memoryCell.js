export default {
	template: `<div :class="'memory-cell ' + 'memory-cell-' + variable[1][1] + ' ' + (variable[1][2][0] === '*' ? 'pointer' : variable[1][2])">
					<div class="address">{{ variable[1][1] }}</div>	
					<div class="content">{{ content }}</div>	
					<div class="type">{{ type }}</div>
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
		if(this.variable[1][2][0] === '*' || this.variable[1][2] === 'pointer') {
			const pointerCell = document.querySelector('.memory-cell-' + this.variable[1][1]);
			const pointedCell =  document.querySelector('.memory-cell-' + this.variable[1][3]);
			const isPointedCellHeap = pointedCell.parentElement.id === 'heap';
			if(pointedCell !== null) {
				globalArrows.push(new LeaderLine(
					pointerCell,
					pointedCell,
					{
						path: 'fluid',
						startSocket: 'right',
						endSocket: isPointedCellHeap? 'left' : 'right',
						startSocketGravity: [15, 0],
						endSocketGravity: isPointedCellHeap? [-20, 0] : [20, 0],
						endPlug: 'arrow3',
						size: 2,
						endPlugSize: 2,
						color: getComputedStyle(document.body).getPropertyValue('--cell-border')
					}
				));
			}
		}
	},
	computed: {
		type() {
			if (this.variable[1][2].constructor === Array) {
				return this.variable[1][2][2];
			} else {
				return this.variable[1][2];
			}
		},
		content() {
			if (this.variable[1][2].constructor === Array) {
				return this.variable[1][2][3];
			} else {
				return this.variable[1][3];
			}
		},
	}
}
