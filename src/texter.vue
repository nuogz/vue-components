<template>
	<comp-texter>
		<!-- 禁用 -->
		<p-disabling v-if="$disabling" class="inblock" :checked="brop(!$disable)" @click="$disable = ! $disable" />
		<!-- 标签 -->
		<p-label v-if="$label" :disabled="brop($disable)" class="inblock elli" :style="styleLabel" @click="$disabling && ($disable = ! $disable)">{{ $label }}</p-label>

		<!-- 输入框 -->
		<p-value class="inblock">
			<input
				ref="domInput"
				v-model="$value"
				:style="{ textAlign: align }"
				:placeholder="place"
				:tabindex="tab"
				:type="$type"
				:readonly="$readonly"
				:disabled="$disable"
				:min="min"
				:max="max"
				:step="step"
				@mousewheel="$type == 'number' && atMouseWheel"
			/>
		</p-value>
	</comp-texter>
</template>

<script setup>
	import { computed, ref, watch } from 'vue';

	import { brop, bropBoolean } from '@nuogz/utility';

	import { props as propsCommon, setup as setupCommon } from './lib/label.js';



	const props = defineProps({
		/** 主值 */
		modelValue: { type: [String, Number, Boolean], default: '' },
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


		/** 留空提示 */
		place: { type: [Number, String], default: '' },
		/** 焦点顺序 */
		tab: { type: [Number, String], default: 0 },

		/** 文本-对齐方式 */
		align: { type: String, default: null },

		/** 输入框类型 */
		type: { type: String, default: null },

		/** 最小数字 */
		min: { type: [Number, String], default: null },
		/** 最大数字 */
		max: { type: [Number, String], default: null },
		/** 步进 */
		step: { type: [Number, String], default: null },

		/** （控制）切换文本框焦点 */
		focusSwitch: { type: Boolean, default: false },
	});
	const emit = defineEmits(['update:modelValue', 'update:disable', 'update:value']);


	const $disabling = computed(() => bropBoolean(props.disabling));
	const $readonly = computed(() => bropBoolean(props.readonly));

	const { $label, $labelWidth, $labelAlign } = setupCommon(props, $disabling);

	const typeDict = { text: 'text', pass: 'password', number: 'number' };
	const $type = computed(() => typeDict[props.type] || typeDict.text);

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

			emit('update:modelValue',
				disable === true ?
					false :
					(
						$type.value == 'number' ?
							Number(value) :
							value
					)
			);
		}
		else {
			emit('update:modelValue', $type.value == 'number' ? Number(value) : value);
		}
	});


	const atMouseWheel = event => emit('update:value', $value.value += event.deltaY > 0 ? -1 : 1);


	const domInput = ref(null);
	watch(() => props.focusSwitch, () => domInput.value.focus());
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
	@apply block relative w-auto h-full overflow-hidden border-b-2 border-solid border-[var(--cMain)]
	padding: 0 0.25rem
	z-index: 1

	> input
		@apply relative w-full h-full overflow-hidden
		outline: none
		background: transparent
		font-size: inherit

		&:disabled
			@apply text-[var(--cTextMainDisabled)] filter brightness-75 select-none cursor-default

		&::-webkit-inner-spin-button, &::-webkit-outer-spin-button
			@apply appearance-none
</style>
