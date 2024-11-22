import Memory from "./memory.js";

const { createApp } = Vue;

const vm = createApp({
	data() {
		return {
			message: 'Hello Vues!',
			stack: []
		}
	},
	components: {
		Memory
	},
	methods: {
		async sendCode() {
			const url = "http://localhost:8000/execute";
			try {
				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						"language": "gdb",
						"code": document.getElementById("textbox").value
					})
				});
				if (!response.ok) {
					throw new Error(`Response status: ${response.status}`);
				}

				const json = await response.json();
				for(let line of globalArrows) {
					line.remove();
				}
				globalArrows = [];
				this.stack = this.extractLocals(json);
			} catch (error) {
				console.error(error.message);
			}
		},
		extractLocals(json) {
			const lastLineState = json.trace[json.trace.length - 2];
			const locals = lastLineState.stack_to_render[0].encoded_locals;

			// Transforms [{varName: properties}] into [["varname", properties]]
			const localsArray = new Array(...Object.entries(locals));

			// Ordering by address
			localsArray.sort((a, b) => a[1][1].localeCompare(b[1][1]));

			// Changing type of pointers from "pointer" to "*<type>"
			for(const cell of localsArray) {
				if(cell[1][2] === 'pointer') {
					const address = cell[1][3];
					const pointedVariable = localsArray.find(pointedCell => pointedCell[1][1] === address);
					if(pointedVariable !== undefined) {
						cell[1][2] = '*' + pointedVariable[1][2];
					} else {
						cell[1][2] = 'pointer';
					}
				}
			}

			if(localsArray.length < 20) {
				return this.addAdjacentCells(localsArray);
			}

			return localsArray;
		},
		addAdjacentCells(cells) {
			//const firstAddress = parseInt(cells[0][1][1], 16);
			const lastAddress = parseInt(cells[cells.length - 1][1][1], 16);

			const previousCells = [];
			// for(let i = 5; i > 0; --i) {
			// 	const newAddress = firstAddress - i;
			// 	previousCells.push(['', ['C_DATA', '0x' + newAddress.toString(16).toUpperCase(), 'lixo', Math.floor(Math.random()*254).toString(2)]]);
			// }
			const posteriorCells = [];
			for(let i = 1; i <= 10; ++i) {
				const newAddress = lastAddress + i;
				posteriorCells.push(['', ['C_DATA', '0x' + newAddress.toString(16).toUpperCase(), 'lixo',  Math.floor(Math.random()*254).toString(2)]]);
			}
			return previousCells.concat(cells).concat(posteriorCells);
		}
	},

}).mount('#memoryContainer');

window.vueApp = vm;
