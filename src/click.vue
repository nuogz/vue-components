<template>
	<comp-click :white="brop(white)" :disabled="brop(disable)" :title="text">
		<Icon v-if="icon" class="inline icon" :icon="icon" :spin="spin" />{{ icon ? ' ' : '' }}{{ text }}
	</comp-click>
</template>

<script setup>
import { brop } from '@nuogz/utility';

import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';



defineProps({
	/** 按钮-文本 */
	text: { type: String, default: '' },

	/** 图标 */
	icon: { type: [String, Array, Object], default: null },
	/** 图标-旋转 */
	spin: { type: Boolean, default: false },

	/** 样式-反转（布尔开关） */
	white: { type: [Boolean, String], default: false },
	/** 样式-禁用（布尔开关） */
	disable: { type: [Boolean, String], default: false },
});
</script>

<style lang="sass" scoped>
comp-click
	@apply px-2 border-2 rounded-sm cursor-pointer text-center select-none elli
	@apply text-[var(--cTextMain)] bg-[var(--cMain)] border-[var(--cMain)]

	&:focus:not([disabled]), &:hover:not([disabled])
		@apply shadow-md filter brightness-110

	&[white]
		@apply text-[var(--cTextBack)] bg-[var(--cBack)] border-[var(--cMain)]

	&[disabled]
		@apply text-[var(--cTextMainDisabled)] filter brightness-75 select-none cursor-default
</style>
