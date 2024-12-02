export default {
	template: `<div :class="'memory-cell ' + 'memory-cell-' + variable[1][1] + ' ' + (variable[1][2][0] === '*' ? 'pointer' : variable[1][2])">
					<div class="address">{{ address }}</div>	
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
			this.createPointerArrow();
		}
	},
	updated() {
		if(this.variable[1][2][0] === '*' || this.variable[1][2] === 'pointer') {
			if(globalArrows.has(this.address + this.content)) {
				globalArrows.get(this.address + this.content).remove();
			}
			this.createPointerArrow();
		}
	},
	unmounted() {
		if(this.variable[1][2][0] === '*' || this.variable[1][2] === 'pointer') {
			if(globalArrows.has(this.address + this.content)) {
				globalArrows.get(this.address + this.content).remove();
			}
		}
	},
	methods: {
		createPointerArrow() {
			if(this.content !== '?') {
				const pointerCell = document.querySelector('.memory-cell-' + this.address);
				const pointedCell =  document.querySelector('.memory-cell-' + this.content);
				const isPointedCellHeap = pointedCell.parentElement.id === 'heap';
				if(pointedCell !== null) {
					globalArrows.set(
						this.address + this.content,
						new LeaderLine(
							pointerCell,
							pointedCell,
							{
								path: 'fluid',
								startSocket: 'right',
								endSocket: isPointedCellHeap? (this.isInHeap? 'right' : 'left') : 'right',
								startSocketGravity: isPointedCellHeap? [15, 0] : [15, 0],
								endSocketGravity: isPointedCellHeap? [-20, 0] : [20, 0],
								endPlug: 'arrow3',
								size: 2,
								endPlugSize: 2,
								color: getComputedStyle(document.body).getPropertyValue('--cell-border')
							}
						)
					);
				}
			}
		}
	},
	computed: {
		type() {
			if (this.isInHeap) {
				return this.variable[1][2][2];
			} else {
				if(this.variable[1][0] === "C_ARRAY") {
					return this.variable[1][2][2] + '[]';
				} else {
					return this.variable[1][2];	
				}
				
			}
		},
		content() {
			if (this.isArray) {
				return this.variable[1][2][3];
			} else {
				return this.variable[1][3];
			}
		},
		address() {
			return this.variable[1][1];
		},
		isInHeap() {
			return this.variable[2];
		},
		isArray() {
			this.variable[1][2].constructor === Array || this.variable[0] === 'C_ARRAY';
		}
	},
	watch: {
		variable:{
			handler(newVal, oldVal) {
				const newAddress = newVal[1][1];
				const newContent = newVal[1][2].constructor === Array? newVal[1][2][3] : newVal[1][3];
				const oldAddress = oldVal[1][1];
				const oldContent = oldVal[1][2].constructor === Array? oldVal[1][2][3] : oldVal[1][3];
				if(newAddress !== oldAddress || newContent !== oldContent) {
					const oldKey = oldAddress + oldContent;
					if(globalArrows.has(oldKey)) {
						globalArrows.get(oldKey).remove();
						globalArrows.delete(oldKey);
					}

				}
			},
			deep: true
		}
	}
}
