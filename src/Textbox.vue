<template>
	<comp-texter>
		<!-- 禁用 -->
		<p-disabling v-if="disabling_" class="inblock" :checked="brop(!disable_)" @click="disable_ = ! disable_" />

		<!-- 标签 -->
		<p-label v-if="label_" class="inblock elli" :style="styleLabel" @click="disabling_ && (disable_ = ! disable_)">{{ label_ }}</p-label>

		<!-- 输入框 -->
		<p-value class="inblock">
			<textarea
				ref="domInput"
				v-model="value_"
				:style="{ textAlign: align,height: height_ }"
				:placeholder="place"
				:tabindex="tab"
				:readonly="readonly_"
				:disabled="disable_"
			/>
		</p-value>
	</comp-texter>
</template>

<script setup>
	import { computed, ref, watch } from 'vue';

	import { brop, parseBoolProp, toCSSLength } from '@nuogz/utility';

	import { props as propsCommon, setup as setupCommon } from './lib/label.js';



	const props = defineProps({
		// update主值
		modelValue: { type: [String, Number, Boolean], default: '' },
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


		// 留空提示
		place: { type: [Number, String], default: '' },
		// 焦点顺序
		tab: { type: [Number, String], default: 0 },
		// 文本对齐方式
		align: { type: String, default: null },
		// 输入框高度
		height: { type: [Number, String], default: undefined },

		focusSwitch: { type: Boolean, default: false },
	});
	const emit = defineEmits(['update:modelValue', 'update:disable', 'update:value']);


	const disabling_ = computed(() => parseBoolProp(props.disabling));
	const readonly_ = computed(() => parseBoolProp(props.readonly));

	const { label_, labelWidth_, labelAlign_ } = setupCommon(props, disabling_);

	const height_ = computed(() => props.height == undefined ? undefined : toCSSLength(props.height));

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
		@apply relative w-full h-full overflow-hidden
		outline: none
		background: transparent
		font-size: inherit

		&:disabled
			color: var(--colorDisable)

		&::-webkit-inner-spin-button, &::-webkit-outer-spin-button
			@apply appearance-none
</style>
