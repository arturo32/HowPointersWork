import Memory from "./memory.js";

const { createApp } = Vue;

const vm = createApp({
	data() {
		return {
			json: null,
			stack: [],
			heap: [],
			currentLine: null,
		}
	},
	components: {
		Memory
	},
	methods: {
		async sendCode() {
			const url = "https://hpw.arturoweb.com/execute";
			try {
				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						"language": lang,
						"code": editor.getValue()
					})
				});
				if (!response.ok) {
					throw new Error(`Response status: ${response.status}`);
				}

				this.json = await response.json();
				this.currentLine = 0;
				this.heap = this.extractHeap();
				this.stack = this.extractLocals();
				document.querySelector('#lineController').classList.add('show');
				document.querySelector('#editor').classList.add('running');
				editor.gotoLine(this.json.trace[this.currentLine].line);
			} catch (error) {
				console.error(error.message);
			}
		},
		extractLocals() {
			const lastLineState = this.json.trace[this.currentLine];
			const locals = lastLineState.stack_to_render[0].encoded_locals;

			// Transforms [{varName: properties}] into [["varname", properties]]
			const localsArray = new Array(...Object.entries(locals));


			let arrayCells = [];
			for(let cell of localsArray) {
				// Transforming <UNINITIALIZED> into ?
				if(cell[1][3] === '<UNINITIALIZED>') {
					cell[1][3] = '?';
				}
				if(cell[1][2].constructor === Array && cell[1][2][3] === '<UNINITIALIZED>') {
					cell[1][2][3] = '?';
				}

				if(cell[1][0] === 'C_ARRAY') {
					this.flatArray(cell, arrayCells)
				}
			}
			localsArray.push(...arrayCells);

			for(let cell of localsArray) {
				// Changing type of pointers from "pointer" to "*<type>"
				if(cell[1][2] === 'pointer') {
					cell[1][2] = this.findPointedCell(cell, localsArray.concat(this.heap));
				}
				cell[2] = false;
			}

			// Ordering by address
			localsArray.sort((a, b) => a[1][1].localeCompare(b[1][1]));

			if(localsArray.length < 20) {
				return this.addUnitilizedCells(localsArray);
			}

			return localsArray;
		},
		findPointedCell(cell, cells) {
			let pointedAddress;
			if (cell[1][0] === 'C_DATA') {
				pointedAddress = cell[1][3];
			} else {
				pointedAddress = cell[1][2][3];
			}

			const pointedCell = cells.find(pointedCell => pointedCell[1][1] === pointedAddress);
			if(pointedCell !== undefined) {
				if(pointedCell[1][0] === 'C_DATA') {
					return '*' + pointedCell[1][2];
				} else {
					if(pointedCell[1][2][2] === 'pointer') {
						return '*' + this.findPointedCell(pointedCell, cells);
					} else {
						return '*' + pointedCell[1][2][2];
					}
				}
			} else {
				return 'pointer';
			}
		},
		flatArray(cell, arrayCells) {
			let i = 3;
			while(cell[1][i] !== undefined) {
				if(cell[1][i][3] === '<UNINITIALIZED>') {
					cell[1][i][3] = '?';
				}
				arrayCells.push(['', cell[1][i]]);
				if(cell[1][i][0] === 'C_ARRAY') {
					this.flatArray(cell, arrayCells)
				}
				++i;
			}
		},
		addUnitilizedCells(cells) {
			if(cells.length > 0) {
				const lastAddress = parseInt(cells[cells.length - 1][1][1], 16);

				const posteriorCells = [];
				for(let i = 1; i <= 10; ++i) {
					const newAddress = lastAddress + i;
					posteriorCells.push(['', ['C_DATA', '0x' + newAddress.toString(16).toUpperCase(), 'lixo',  '?']]);
				}
				return cells.concat(posteriorCells);
			}
		},
		extractHeap() {
			const lastLineState = this.json.trace[this.currentLine];
			const heap = lastLineState.heap;

			// Transforms [{varName: properties}] into [["varname", properties]]
			let heapArray = new Array(...Object.entries(heap));


			// Removes unallocated cells
			heapArray = heapArray.filter(cell => cell[1][2] !== undefined);

			let arrayCells = [];
			for(let cell of heapArray) {
				cell[0] = '';
				if(cell[1][2][3] === '<UNINITIALIZED>') {
					cell[1][2][3] = '?';
				}
				this.flatArray(cell, arrayCells);
			}
			heapArray.push(...arrayCells);

			// Removes unallocated cells
			heapArray = heapArray.filter(cell => cell[1][2] !== undefined);

			for(let cell of heapArray) {
				if(cell[1][2][2] === 'pointer') {
					cell[1][2][2] = this.findPointedCell(cell, heapArray.concat(this.stack));
				} else if(cell[1][2] === 'pointer') {
					cell[1][2] = this.findPointedCell(cell, heapArray.concat(this.stack));
				}
				cell[2] = true;
			}



			// Ordering by address
			heapArray.sort((a, b) => a[1][1].localeCompare(b[1][1]));

			return heapArray;
		},
		nextLine() {
			if(this.currentLine < this.json.trace.length - 2) {
				this.currentLine++;
				this.heap = this.extractHeap();
				this.stack = this.extractLocals();
				editor.gotoLine(this.json.trace[this.currentLine].line);
				document.querySelector('#outputC').textContent = this.json.trace[this.currentLine].stdout;
			}
		},
		previousLine() {
			if(this.currentLine > 0) {
				this.currentLine--;
				this.heap = this.extractHeap();
				this.stack = this.extractLocals();
				editor.gotoLine(this.json.trace[this.currentLine].line);
				document.querySelector('#outputC').textContent = this.json.trace[this.currentLine].stdout;
			}
		}
	},

}).mount('#memoryContainer');

window.vueApp = vm;
