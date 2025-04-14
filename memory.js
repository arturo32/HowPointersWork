import MemoryCell from "./memoryCell.js";
export default {
	template: `
		<div>
			<div v-if="stackFrames !== undefined" v-for="stackFrame in stackFrames" class="stack-frame">
				
				<template v-if="stackFrame.frameName !== null">
					<hr/>
					<div class="frame-name">
						<h4 :title="stackFrame.frameName">{{ stackFrame.frameName }}</h4>
					</div>
				</template>
				<template v-else>
					<div class="frame-name"></div>
				</template>
				
				<div class="cells-container">
					<memory-cell v-for="variable in stackFrame.localVars" :variable="variable"></memory-cell>
				</div>
			</div>
			<memory-cell v-if="heapVars !== undefined" v-for="variable in heapVars" :variable="variable"></memory-cell>
		</div>
			`,
	data() {
		return {
			componentName: 'Memory'
		};
	},
	props: ['stackFrames', 'heapVars'],
	components: {
		MemoryCell
	}
}
