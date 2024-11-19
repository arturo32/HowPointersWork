import MemoryCell from "./memoryCell.js";
export default {
	template: `
		<memory-cell v-for="variable in vars" :variable="variable"></memory-cell>
			`,
	data() {
		return {
			componentName: 'Memory'
		};
	},
	props: ['vars'],
	components: {
		MemoryCell
	}
}
