<template>
	<comp-pager>
		<!-- 左翻 -->
		<p-button :class="{ invalid: pageNow == 1 }" left @click.exact="offsetPage(-1)">
			<Icon :icon="faAngleLeft" />
		</p-button>

		<!-- 当前页数 -->
		<input v-model="pageNow" page-now type="text" @keyup.enter="offsetPage(0)" />
		<div spliter>/</div>
		<!-- 最大页数 -->
		<div page-max>{{ pageMax }}</div>

		<!-- 右翻 -->
		<p-button :class="{ invalid: pageNow >= pageMax }" right @click="offsetPage(1)">
			<Icon :icon="faAngleRight" />
		</p-button>

		<!-- 总页数 -->
		<div v-if="!$hider.total" total>共 {{ total }} 条</div>
	</comp-pager>
</template>

<script setup>
	import { computed, ref, watch } from 'vue';

	import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
	import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';



	const props = defineProps({
		/** 主值 */
		modelValue: { type: Number, default: 0 },

		/** 单页数据上限 */
		limit: { type: Number, default: 20 },
		/** 总页数 */
		total: { type: Number, default: 0 },

		/** 隐藏选项 */
		hider: { type: String, default: '' }
	});
	const emit = defineEmits(['update:modelValue', 'update:value']);


	const pageMax = computed(() => Math.ceil(props.total / props.limit) || 0);
	const pageNow = ref(props.modelValue);


	const $hider = computed(() => {
		const result = { total: false };

		if(props.hider) {
			for(const hider of props.hider.split('|')) {
				result[hider] = true;
			}
		}

		return result;
	});


	watch(() => props.modelValue, modelValue => {
		pageNow.value = modelValue;
	});

	watch([pageNow], ([value], [valuePrev]) => {
		if(value != valuePrev) {
			emit('update:value', value);
		}
	});

	const offsetPage = offset => {
		const pageNew = ~~pageNow.value + ~~offset;

		if(pageNew >= 1 && pageNew <= pageMax.value) {
			pageNow.value = pageNew;

			emit('update:modelValue', pageNew);
		}
	};
</script>

<style lang="sass" scoped>
comp-pager
	@apply relative

	>*
		@apply inblock h-full border-none text-center bg-transparent

	p-button
		@apply relative cursor-pointer
		@apply border border-solid
		width: 2rem
		border-color: var(--colorMain)
		color: var(--colorMain)
		background-color: var(--colorTextMain)

		&:not(.split):hover
			@apply shadow-md filter brightness-110

		&.invalid
			@apply cursor-not-allowed
			color: lightgray

			&:hover
				@apply bg-transparent
				border-color: steelblue

		&[left]
			@apply rounded-l-sm mr-2

		&[right]
			@apply rounded-r-sm ml-2

	[page-now]
		@apply relative p-0 outline-none align-baseline border-b-2 border-solid

		width: 2.4rem
		color: var(--colorText)
		border-image: linear-gradient(90deg, var(--colorMain) 64%, rgba(1,133,224,0.7) 92%) 1
		font-size: inherit
		line-height: inherit

		&:hover
			border-image: linear-gradient(270deg, var(--colorMain) 64%, rgba(1,133,224,0.7) 92%) 1

	[spliter]
		@apply mx-1

	[page-max]
		width: 2.4rem

	[total]
		@apply ml-2 select-none
</style>
