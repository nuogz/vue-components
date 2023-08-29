<template>
	<comp-file-dragger>
		<!-- 禁用 -->
		<p-disabling v-if="$disabling" class="inblock" :checked="brop(!$disable)" @click="$disable = !$disable" />

		<!-- 标签 -->
		<p-label v-if="$label" :disabled="brop($disable)" class="inblock elli" :style="styleLabel" @click="$disabling && ($disable = !$disable)">{{ $label }}</p-label>

		<!-- 输入框 -->
		<p-value class="inblock">
			<p-drag ref="domDrag" :disabled="brop($disable)" @click="selectFile">{{ dragging ? draggingLabel : dragLabel }}</p-drag>
		</p-value>
	</comp-file-dragger>
</template>

<script setup>
	import { computed, ref, watch } from 'vue';

	import { brop, bropBoolean } from '@nuogz/utility';

	import { props as propsCommon, setup as setupCommon } from './lib/label.js';



	const props = defineProps({
		/** 主值 */
		modelValue: { type: [Array, Boolean], default: () => [] },
		/** （开关）是否禁用主值 */
		disable: { type: Boolean, default: false },
		/** 主值-文本值 */
		text: { type: String, default: '' },
		/** 启用禁用框下的默认值 */
		default: { type: [String, Number, Boolean], default: '' },

		/** （开关）启用禁用框 */
		disabling: { type: [Boolean, String], default: false },
		/** （开关）只读 */
		readonly: { type: [Boolean, String], default: false },


		...propsCommon,


		/** 文件类型 */
		accept: { type: String, default: '' },

		/** （开关）多选 */
		multiSelect: { type: [Boolean, String], default: true },

		/** 未拖入时显示的文本 */
		dragLabel: { type: String, default: '拖入 <文件> 到此' },
		/** 拖入时显示的文本 */
		draggingLabel: { type: String, default: '松开即可选入 <文件>' },
	});
	const emit = defineEmits(['update:modelValue', 'update:disable', 'update:value']);


	const $disabling = computed(() => bropBoolean(props.disabling));
	const $readonly = computed(() => bropBoolean(props.readonly));
	const $multiSelect = computed(() => bropBoolean(props.multiSelect));

	const { $label, $labelWidth, $labelAlign } = setupCommon(props, $disabling);


	const styleLabel = computed(() => ({ width: $labelWidth.value, textAlign: $labelAlign.value }));

	const $value = ref($disabling.value ? (props.modelValue === false ? props.default : props.modelValue) : props.modelValue);
	const $disable = ref($disabling.value ? (props.modelValue === false ? true : false) : props.disable);


	watch(() => props.disable, disable => {
		if(!$disabling.value) {
			$disable.value = disable;
		}
	});
	watch(() => props.modelValue, modelValue => {
		if($disabling.value) {
			if(modelValue === false) {
				$disable.value = true;
			}
			else {
				$disable.value = false;
				$value.value = modelValue;
			}
		}
		else {
			$value.value = modelValue;
		}
	});
	watch([$value, $disable], ([value, disable], [valuePrev, disablePrev]) => {
		if($disabling.value) {
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
			if($disable.value || $readonly.value) { return; }


			dragger.setAttribute('dragging', '');
			dragging.value = true;
		});
		dragger.addEventListener('dragleave', () => {
			if($disable.value || $readonly.value) { return; }


			dragger.removeAttribute('dragging');
			dragging.value = false;
		});
		dragger.addEventListener('dragover', event => {
			if($disable.value || $readonly.value) { return; }


			event.preventDefault();
		});

		dragger.addEventListener('drop', async event => {
			if($disable.value || $readonly.value) { return; }


			event.preventDefault();
			event.stopPropagation();

			dragger.removeAttribute('dragging');
			dragging.value = false;

			$value.value = [...(event.dataTransfer?.files ?? [])];
		});


		dragger.addEventListener('paste', async event => {
			if($disable.value || $readonly.value) { return; }


			event.preventDefault();
			event.stopPropagation();

			$value.value = [...(event.clipboardData?.files ?? [])];
		});
	});


	const selectFile = () => {
		if($disable.value || $readonly.value) { return; }


		const input = document.createElement('input');
		input.type = 'file';
		input.multiple = $multiSelect.value;
		input.accept = props.accept;

		input.addEventListener('input', () => $value.value = [...(input.files ?? [])]);

		input.click();
	};
</script>

<style lang="sass" scoped>
p-disabling
	@apply inblock relative float-left top-2 w-4 h-4 mx-1 border-solid select-none cursor-pointer appearance-none
	@apply filter hover:brightness-110
	@apply border-2 border-[var(--cMain)]

	&[checked]
		@apply bg-[var(--cMain)]

		&::after
			content: ""
			@apply absolute border-2 border-solid border-t-0 border-r-0 border-[var(--cTextMain)]
			@apply top-[2px] left-[0px]
			@apply w-[0.75rem] h-[0.4rem]
			transform: rotate(-45deg) scale(0.77, 0.77)

p-label
	@apply block relative float-left w-auto h-full overflow-hidden cursor-pointer select-none

	&[disabled]
		@apply text-[var(--cTextMainDisabled)] filter brightness-75 select-none cursor-default

p-value
	@apply block relative w-auto h-full overflow-hidden border-solid
	z-index: 1

p-drag
	@apply block h-full leading-[calc(theme("spacing.1")*24)] text-xl text-[var(--cMain)] text-center cursor-pointer
	@apply border-2 border-dashed border-[var(--cMain)]

	&:hover:not([disabled])
		@apply text-[var(--cTextMain)] bg-[var(--cMain)]

	&[dragging]
		@apply border-solid border-[var(--cOkay)] text-[var(--cOkay)]

	&[disabled]
		@apply text-[var(--cTextMainDisabled)] border-[var(--cTextMainDisabled)] filter brightness-75 select-none cursor-default
</style>
