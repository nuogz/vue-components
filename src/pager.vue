<template>
	<comp-pager>
		<!-- 左翻 -->
		<p-button :class="{ invalid: pageNow == 1 }" left @click.exact="atOffset(-1)">
			<Icon :icon="faAngleLeft" />
		</p-button>
		<!-- 当前页数 -->
		<input v-model="pageNow" page-now type="text" @keyup.enter="atOffset(0)" />
		<div spliter>/</div>
		<!-- 最大页数 -->
		<div page-max>{{ pageMax }}</div>
		<!-- 右翻 -->
		<p-button :class="{ invalid: pageNow >= pageMax }" right @click="atOffset(1)">
			<Icon :icon="faAngleRight" />
		</p-button>
		<div v-if="!hider_().total" total>共 {{ total }} 条</div>
	</comp-pager>
</template>

<script setup>
	import { computed, ref, watch } from 'vue';

	import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
	import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';




	const props = defineProps({
		// update主值-当前页
		modelValue: { type: Number, default: 0 },
		// 单页限制
		limit: { type: Number, default: 20 },
		// 总数
		total: { type: Number, default: 0 },
		// 隐藏选项
		hider: { type: String, default: '' }
	});

	const pageMax = computed(() => Math.ceil(props.total / props.limit) || 0);
	const pageNow = ref(props.modelValue);


	// 隐藏器
	const hider_ = () => {
		let result = {
			total: false
		};

		if(props.hider) {
			for(let hider of props.hider.split('|')) {
				result[hider] = true;
			}
		}

		return result;
	};

	const emit = defineEmits(['update:modelValue', 'update:value']);

	watch(() => props.modelValue, modelValue => {
		pageNow.value = modelValue;
	});

	watch([pageNow], ([value], [valuePrev]) => {
		if(value != valuePrev) {
			emit('update:value', value);
		}
	});

	const atOffset = (offset => {
		const newPage = ~~pageNow.value + ~~offset;

		if(newPage >= 1 && newPage <= pageMax.value) {
			pageNow.value = newPage;
			emit('update:modelValue', newPage);
		}
	});
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
