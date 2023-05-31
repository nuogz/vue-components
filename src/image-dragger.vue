<template>
	<comp-texter>
		<!-- 禁用 -->
		<p-disabling v-if="disabling_" class="inblock" :checked="brop(!disable_)" @click="disable_ = !disable_" />

		<!-- 标签 -->
		<p-label v-if="label_" class="inblock elli" :style="styleLabel" @click="disabling_ && (disable_ = !disable_)">{{ label_ }}</p-label>

		<!-- 输入框 -->
		<p-value class="inblock">
			<p-drag ref="domDrag" @click="selectFile">{{ dragging ? '松开即可选入 <图片>' : '可拖入 <图片> 到此' }}</p-drag>
		</p-value>
	</comp-texter>
</template>

<script setup>
	import { computed, ref, watch } from 'vue';

	import brop from '../brop.js';
	import parseBoolProp from '../parse-bool-attr.js';

	import { props as propsCommon, setup as setupCommon } from './lib/label.js';



	const props = defineProps({
		// update主值
		modelValue: { type: [Array], default: () => [] },
		// update是否禁用
		disable: { type: Boolean, default: false },
		// update综合主值
		text: { type: String, default: '' },
		// disabling启用下的默认值
		default: { type: [String, Number, Boolean], default: '' },

		// eslint-disable-next-line vue/valid-define-props
		...propsCommon,


		// boolean是否显示禁用框
		disabling: { type: [String, Boolean], default: false },
		// boolean是否制度
		readonly: { type: [String, Boolean], default: false },


		// 多选
		multiSelect: { type: [String, Boolean], default: true },
	});
	const emit = defineEmits(['update:modelValue', 'update:disable', 'update:value']);


	const disabling_ = computed(() => parseBoolProp(props.disabling));
	const readonly_ = computed(() => parseBoolProp(props.readonly));
	const multiSelect_ = computed(() => parseBoolProp(props.multiSelect));

	const { label_, labelWidth_, labelAlign_ } = setupCommon(props, disabling_);


	const styleLabel = computed(() => ({ width: labelWidth_.value, textAlign: labelAlign_.value }));

	const value_ = ref(disabling_.value ? (props.modelValue === false ? props.default : props.modelValue) : props.modelValue);
	const disable_ = ref(disabling_.value ? (props.modelValue === false ? true : false) : props.disable);


	watch(() => props.disable, disable => {
		if(!disabling_.value) {
			disable_.value = disable;
		}
	});
	watch(() => props.modelValue, modelValue => {
		if(disabling_.value) {
			if(modelValue === false) {
				disable_.value = true;
			}
			else {
				disable_.value = false;
				value_.value = modelValue;
			}
		}
		else {
			value_.value = modelValue;
		}
	});
	watch([value_, disable_], ([value, disable], [valuePrev, disablePrev]) => {
		if(disabling_.value) {
			if(value != valuePrev) {
				emit('update:value', value);
			}
			if(disable != disablePrev) {
				emit('update:disable', disable);
			}

			emit('update:modelValue', disable === true ? false : value);
		}
		else {
			emit('update:modelValue', value);
		}
	});





	/** @type {import('vue').Ref<boolean>} */
	const dragging = ref(false);


	/** @type {import('vue').Ref<HTMLElement>} */
	const domDrag = ref(null);


	watch(domDrag, () => {
		const dragger = domDrag.value;
		if(!dragger) { return; }


		dragger.addEventListener('dragenter', () => {
			if(readonly_.value) { return; }


			dragger.setAttribute('dragging', '');
			dragging.value = true;
		});
		dragger.addEventListener('dragleave', () => {
			if(readonly_.value) { return; }


			dragger.removeAttribute('dragging');
			dragging.value = false;
		});
		dragger.addEventListener('dragover', event => {
			if(readonly_.value) { return; }


			event.preventDefault();
		});

		dragger.addEventListener('drop', async event => {
			if(readonly_.value) { return; }


			event.preventDefault();
			event.stopPropagation();

			dragger.removeAttribute('dragging');
			dragging.value = false;

			value_.value = [...(event.dataTransfer?.files ?? [])];
		});
	});


	const selectFile = () => {
		if(readonly_.value) { return; }


		const input = document.createElement('input');
		input.type = 'file';
		input.multiple = multiSelect_.value;

		input.addEventListener('input', () => value_.value = [...(input.files ?? [])]);

		input.click();
	};
</script>

<style lang="sass" scoped>
p-disabling
	@apply relative float-left top-2 w-4 h-4 mx-1 border-2 border-solid select-none cursor-pointer appearance-none filter hover:brightness-110
	border-color: var(--colorMain)

	&[checked]
		background-color: var(--colorMain)

		&::after
			content: ""
			@apply absolute border-2 border-solid border-t-0 border-r-0
			top: 2px
			left: 0px
			width: 0.75rem
			height: 0.4rem
			border-color: var(--colorTextMain)
			transform: rotate(-45deg) scale(0.77, 0.77)


p-label
	@apply block relative float-left w-auto h-full overflow-hidden cursor-pointer select-none


p-value
	@apply block relative w-auto h-full overflow-hidden border-solid
	border-color: var(--colorMain)
	z-index: 1

	> input
		@apply relative w-full h-full overflow-hidden
		outline: none
		background: transparent
		font-size: inherit

		&:disabled
			color: var(--colorDisable)

		&::-webkit-inner-spin-button, &::-webkit-outer-spin-button
			@apply appearance-none

p-drag
		@apply block h-24 m-2 leading-[calc(theme("spacing.1")*24)] text-xl text-center cursor-pointer
		@apply border-2 border-dashed border-gray-400 text-gray-400

		&:hover
			color: var(--colorMain)
			border-color: var(--colorMain)

		&[dragging]
			@apply border-solid border-sky-400 text-sky-400
</style>
