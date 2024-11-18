import MemoryCell from "./memoryCell.js";
export default {
	template: `
		<template>
			<div v-for="variable in codeTrace">
				<memory-cell :value="variable[0]"></memory-cell>
			</div>
		</template>`,
	data() {
		return {
			componentName: 'Memory'
		};
	},
	props: ['codeTrace'],
	components: {
		MemoryCell
	}
}
