import MemoryCell from "./memoryCell.js";
export default {
	template: `
		<template v-for="variable in vars">
			<memory-cell :value="variable"></memory-cell>
		</template>`,
	data() {
		return {
			componentName: 'Memory',
			vars: ["test", "teste2"]
		};
	},
	components: {
		MemoryCell
	}
}
