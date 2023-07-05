<template>
	<comp-texter>
		<!-- 禁用 -->
		<p-disabling v-if="$disabling" class="inblock" :checked="brop(!$disable)" @click="$disable = !$disable" />

		<!-- 标签 -->
		<p-label v-if="$label" class="inblock elli" :style="styleLabel" @click="$disabling && ($disable = !$disable)">{{ $label }}</p-label>

		<!-- 输入框 -->
		<p-value class="inblock">
			<textarea
				ref="domInput"
				v-model="$value"
				:style="{ textAlign: align, height: $height }"
				:placeholder="place"
				:tabindex="tab"
				:readonly="$readonly"
				:disabled="$disable"
			/>
		</p-value>
	</comp-texter>
</template>

<script setup>
	import { computed, ref, watch } from 'vue';

	import { brop, bropBoolean, toCSSLength } from '@nuogz/utility';

	import { props as propsCommon, setup as setupCommon } from './lib/label.js';



	const props = defineProps({
		/** 主值 */
		modelValue: { type: [Boolean, String, Number], default: '' },
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

		/** 输入框高度 */
		height: { type: [Number, String], default: undefined },


		/** （控制）切换文本框焦点 */
		focusSwitch: { type: Boolean, default: false },
	});
	const emit = defineEmits(['update:modelValue', 'update:disable', 'update:value']);


	const $disabling = computed(() => bropBoolean(props.disabling));
	const $readonly = computed(() => bropBoolean(props.readonly));

	const { $label, $labelWidth, $labelAlign } = setupCommon(props, $disabling);

	const $height = computed(() => props.height == undefined ? undefined : toCSSLength(props.height));

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
					value
			);
		}
		else {
			emit('update:modelValue', value);
		}
	});


	const domInput = ref(null);
	watch(() => props.focusSwitch, () => domInput.value.focus());
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
	@apply block relative w-auto h-full overflow-hidden border-b-2 border-solid
	border-color: var(--colorMain)
	padding: 0 0.25rem
	z-index: 1

	> textarea
		@apply relative w-full h-full
		outline: none
		background: transparent
		font-size: inherit

		&:disabled
			color: var(--colorDisable)

		&::-webkit-inner-spin-button, &::-webkit-outer-spin-button
			@apply appearance-none
</style>
