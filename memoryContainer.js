import Memory from "./memory.js";
const { createApp } = Vue;

createApp({
	data() {
		return {
			message: 'Hello Vues!'
		}
	},
	components: {
		Memory
	}
}).mount('#memoryContainer');
