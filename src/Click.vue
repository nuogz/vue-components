<template>
	<comp-click :white="brop(white)">
		<Icon v-if="icon" class="inline icon" :icon="icon" :spin="spin" />{{icon ? ' ': ''}}{{text}}
	</comp-click>
</template>

<script setup>
	import { brop } from '@nuogz/utility';

	import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';


	defineProps({
		text: { type: String, default: '' },
		white: { type: [Boolean, String], default: false },
		icon: { type: [String, Array, Object], default: null },
		spin: { type: [Boolean], default: false },
	});
</script>

<style lang="sass" scoped>
comp-click
	@apply px-2 rounded-sm cursor-pointer text-center select-none
	background-color: var(--colorMain)
	color: var(--colorTextMain)

	&:focus, &:hover
		@apply shadow-md filter brightness-110

	&[white]
		@apply border
		border-color: var(--colorMain)
		color: var(--colorMain)
		background-color: var(--colorTextMain)
</style>
