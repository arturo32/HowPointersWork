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
						"code": "#include<stdio.h> \n "
							+ "int main(){\n "
							+ "int firstVar = 3; \n "
							+ "int secondVar = firstVar +1;\n "
							+ "int* firstPointer = &firstVar;\n "
							+ "*firstPointer = 55;\n "
							+ "return 0; \n "
							+ "}"
					})
				});
				if (!response.ok) {
					throw new Error(`Response status: ${response.status}`);
				}

				const json = await response.json();
				this.codeTrace = this.extractLocals(json);
				console.log(this.codeTrace);
			} catch (error) {
				console.error(error.message);
			}
		},
		extractLocals(json) {
			const lastLineState = json.trace[json.trace.length - 2];
			const locals = lastLineState.stack_to_render[0].encoded_locals;
			console.log(Object.entries(locals));
			return Object.entries(locals);
		}
	},

}).mount('#memoryContainer');

window.vueApp = vm;
