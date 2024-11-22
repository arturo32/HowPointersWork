import Memory from "./memory.js";
const { createApp } = Vue;

const vm = createApp({
	data() {
		return {
			message: 'Hello Vues!',
			codeTrace: []
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
				globalArrows = []
				this.codeTrace = this.extractLocals(json);
			} catch (error) {
				console.error(error.message);
			}
		},
		extractLocals(json) {
			const lastLineState = json.trace[json.trace.length - 2];
			const locals = lastLineState.stack_to_render[0].encoded_locals;

			// Transforms [{varName: properties}] into [["varname", properties]]
			const localsArray = Object.entries(locals);

			// Ordering by address
			localsArray.sort((a, b) => a[1][1].localeCompare(b[1][1]));

			return localsArray;
		}
	},

}).mount('#memoryContainer');

window.vueApp = vm;
