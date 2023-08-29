<template>
	<comp-combo>
		<!-- 禁用 -->
		<p-disabling v-if="$disabling" :checked="brop(!$disable)" @click="$disable = !$disable" />

		<!-- 标签 -->
		<p-label v-if="$label" :disabled="brop($disable)" :style="styleLabel" @click="$disabling && ($disable = !$disable)">{{ $label }}</p-label>

		<!-- 输入框 -->
		<p-value ref="domValue" :hide-outline="brop(isShowDrop)" :only="brop(!$disabling && !$label)" @click="atClickDrop($event)">
			<input
				ref="domInput"
				:value="textShow"
				:style="{ textAlign: align }"
				:placeholder="place"
				:tabindex="tab"
				:readonly="true"
				:disabled="brop($disable)"
				@keypress.space.stop.prevent="atClickDrop"
			/>
			<Icon drop-icon :disabled="brop($disable)" :icon="isShowDrop ? faAngleUp : faAngleDown" swap-opacity class="w-4" />
		</p-value>

		<!-- 下拉列表 -->
		<p-drop ref="domDrop" :tabindex="tab" :style="{ width: widthDrop, minWidth: widthDropMin }"
			@keypress.enter.stop.prevent="selectFocus"
			@keyup.up.stop.prevent="focusPrev"
			@keydown.down.stop.prevent="focusNext"
			@keydown.esc.stop.prevent="exit"
		>
			<p-filter v-show="filterNow">
				<p-tip>搜索</p-tip>
				<Texter v-model="textSearchFilter" filter :focus-switch="switchFocus" />
			</p-filter>
			<p-options v-if="optionsSelected.length" selected>
				<p-tip>{{ filterNow ? optionsSelected.length : '' }} 已选</p-tip>
				<p-option v-for="(option, oid) of optionsSelected" :key="`combo-option-${oid}`"
					:selected="brop(option.selected)"
					:title="option.data?.[keyValue] ?? renderShow(option.data)"
					:style="{ textAlign: alignOptions || align }"
					@click="atClickSelect(option)"
				>
					{{ renderShow(option.data) }}
				</p-option>
			</p-options>
			<p-options>
				<p-tip :first="brop(indexFocus == 0)">未选</p-tip>
				<p-option v-if="!optionsNow.length" :style="{ textAlign: alignOptions || align }" disabled>无可用选项</p-option>
				<p-option v-for="(option, oid) of optionsUnselected" :key="`combo-option-${oid}`"
					:selected="brop(option.selected)"
					:title="option.data?.[keyValue] ?? renderShow(option.data)"
					:style="{ textAlign: alignOptions || align }"
					:focus-now="brop(indexFocus == oid)"
					@click="atClickSelect(option)"
				>
					{{ renderShow(option.data) }}
				</p-option>
			</p-options>
		</p-drop>
	</comp-combo>
</template>

<script setup>
	import { computed, nextTick, onMounted, ref, watch } from 'vue';

	import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
	import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
	import Tippy from 'tippy.js';

	import { brop, bropBoolean } from '@nuogz/utility';

	import { props as propsCommon, setup as setupCommon } from './lib/label.js';

	import Texter from './texter.vue';



	const props = defineProps({
		/** 主值 */
		modelValue: { type: [String, Number, Boolean, Array], default: '' },
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


		/** 下拉选项 */
		options: { type: Array, default: () => ([]), required: true },


		/** 留空提示 */
		place: { type: [Number, String], default: '' },
		/** 焦点顺序 */
		tab: { type: [Number, String], default: 0 },

		/** 文本-对齐方式 */
		align: { type: String, default: null },
		/** 下拉选项-对齐方式 */
		alignOptions: { type: String, default: null },

		/** 筛选选项 */
		filter: { type: [String, Boolean, Function], default: false },
		/** （开关）多选 */
		multiSelect: { type: [Boolean, String], default: false },

		/** 显示值所在的键值 */
		keyShow: { type: [String, Function, Array], default: 'text' },
		/** 数据值所在的键值 */
		keyValue: { type: String, default: 'value' },

		/** 数据分隔符 */
		separatorValue: { type: String, default: ',' },
		/** 显示分隔符 */
		separatorShow: { type: String, default: '、' },

		/** （控制）切换下拉显示隐藏 */
		openSwitch: { type: Boolean, default: false },
	});
	const emit = defineEmits(['update:modelValue', 'update:disable', 'update:value']);


	const $multiSelect = computed(() => props.multiSelect === 'array' ? props.multiSelect : bropBoolean(props.multiSelect));
	const $disabling = computed(() => bropBoolean(props.disabling));
	const $readonly = computed(() => bropBoolean(props.readonly));

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


	const $values = computed(() => {
		const valueNow = $value.value;

		if($multiSelect.value) {
			if(valueNow instanceof Array) {
				return valueNow.filter(v => v);
			}
			else if(valueNow) {
				return String(valueNow).split(',').map(v => v.trim()).filter(v => v);
			}
			else {
				return [];
			}
		}
		else {
			return [valueNow];
		}
	});


	const getDataValue = data => props.keyValue == '$$' ? data : data?.[props.keyValue];

	const isEqual = (valueNow, valueOption) => {
		const typeValueOption = typeof valueOption;

		if(valueOption === null || typeValueOption == 'undefined' || typeValueOption == 'boolean') {
			return valueNow === valueOption;
		}

		return valueNow == valueOption;
	};

	// 计算是否被选中
	const parseSelected = data => {
		const valuesNow = $values.value;
		const value = getDataValue(data);

		return {
			selected: $multiSelect.value
				? !!~valuesNow.findIndex(valueNow => isEqual(valueNow, value))
				: isEqual(valuesNow[0], value),
			value
		};
	};


	// 过滤函数
	const textSearchFilter = ref('');
	const filterNow = computed(() => typeof props.filter == 'function' ? props.filter : bropBoolean(props.filter));
	const filterOption = (option, index, options) => {
		const serach = textSearchFilter.value?.trim() ?? '';

		const filter = filterNow.value;

		if(!filter) { return true; }
		if(typeof filter == 'function') { return filter(serach, option.data, option, index, options); }

		return renderShow(option.data)?.includes(serach);
	};


	// 原生选项, 决定本地列表或远程列表
	const optionsRaw = computed(() => props.options);

	// 选项封装和分类
	const optionsNow = computed(() => optionsRaw.value.map(data => ({ data, ...parseSelected(data) })));
	const optionsSelected = computed(() => optionsNow.value.filter(option => option.selected));
	const optionsUnselected = computed(() =>
		optionsNow.value.filter(option => !option.selected)
			.filter((option, index, options) => filterOption(option, index, options))
			.filter(option => !option.data?.hidden)
	);


	// 渲染选项和主值的显示
	const renderShow = (data, type = 0) => {
		const keyShow = props.keyShow instanceof Array
			? props.keyShow[type]
			: props.keyShow;

		if(typeof keyShow == 'function') {
			return keyShow(data) ?? '';
		}

		return data?.[keyShow] ?? '';
	};
	const textShow = computed(() =>
		$values.value
			.map(v => renderShow(optionsRaw.value.find(data => isEqual(getDataValue(data), v)), 1))
			.join(props.separatorShow)
	);


	const domValue = ref(null);
	const domInput = ref(null);
	const domDrop = ref(null);

	const tippyDrop = ref(null);
	const widthDrop = ref('');
	const widthDropMin = ref('');

	const isShowDrop = ref(false);
	const atShowDrop = () => {
		isShowDrop.value = true;

		nextTick(() => filterNow.value ? switchFocus.value = !switchFocus.value : domDrop.value.focus());
	};
	const atHideDrop = () => {
		isShowDrop.value = false;

		nextTick(() => domInput.value.focus());
	};


	const switchFocus = ref(false);

	const atClickDrop = () => {
		if($disable.value || $readonly.value) { return; }

		const tippy = tippyDrop.value;

		if(document.querySelector(`#tippy-${tippy.id}`)) {
			tippy.hide();
		}
		else {
			widthDrop.value = 'auto';
			widthDropMin.value = window.getComputedStyle(domValue.value).width;

			tippy.show();
		}
	};


	const select = option => {
		option.selected = true;
		$value.value = option.value;

		tippyDrop.value.hide();
	};
	const atClickSelect = option => {
		if($multiSelect.value) {
			option.selected = !!option.selected;

			const valueNow = option.value;

			const setValues = new Set($values.value);
			if(setValues.has(valueNow)) {
				setValues.delete(valueNow);
			}
			else {
				setValues.add(valueNow);
			}

			const values = [...setValues];
			if($multiSelect.value == 'array') {
				$value.value = values;
			}
			else {
				$value.value = values.join(props.separatorValue);
			}
		}
		else {
			select(option);
		}
	};

	onMounted(() => {
		tippyDrop.value = Tippy(domValue.value, {
			placement: 'bottom-start',
			content: domDrop.value,
			allowHTML: true,
			interactive: true,
			animation: '',
			duration: [0, 0],
			offset: [0, -2],
			trigger: 'manual',
			maxWidth: 'unset',
			onShow: atShowDrop,
			onHide: atHideDrop,
		});
	});


	const indexFocus = ref(0);
	const focusPrev = () => {
		const length = optionsUnselected.value.length;
		indexFocus.value = (length + (indexFocus.value - 1) % length) % length;

		nextTick(() => document.querySelector('p-option[focus-now]')?.scrollIntoView({ behavior: 'auto', block: 'center' }));
	};
	const focusNext = () => {
		const length = optionsUnselected.value.length;
		indexFocus.value = (length + (indexFocus.value + 1) % length) % length;

		nextTick(() => document.querySelector('p-option[focus-now]')?.scrollIntoView({ behavior: 'auto', block: 'center' }));
	};

	const exit = () => {
		if(filterNow.value && textSearchFilter.value) {
			return textSearchFilter.value = '';
		}

		return tippyDrop.value.hide();
	};

	watch(optionsUnselected, optionsUnselected => {
		if(indexFocus.value >= optionsUnselected.length) {
			indexFocus.value = optionsUnselected.length - 1;
		}
	});

	const selectFocus = () => {
		const option = optionsUnselected.value[indexFocus.value];

		if(option) { atClickSelect(option); }
	};


	watch(() => props.openSwitch, atClickDrop);
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
	@apply inblock elli relative float-left w-auto h-full overflow-hidden cursor-pointer select-none

	&[disabled]
		@apply text-[var(--cTextMainDisabled)] filter brightness-75 select-none cursor-default

p-value
	@apply block relative w-auto h-full overflow-hidden
	@apply border-b-2 border-solid border-[var(--cMain)]
	padding: 0 0.25rem
	z-index: 1

	&[hide-outline]
		@apply border-transparent

	&[only]
		@apply w-full

	input
		@apply relative h-full overflow-hidden
		width: calc(100% - theme("spacing.4"))

		outline: none
		background: transparent
		font-size: inherit

		&:disabled
			@apply text-[var(--cTextMainDisabled)] filter brightness-75 select-none cursor-default

	[drop-icon]
		@apply relative h-full w-4 text-base text-[var(--cMain)] align-middle trans

		&:hover
			@apply text-[var(--cTextBack)]

		&[disabled]
			@apply text-[var(--cTextMainDisabled)] filter brightness-75 select-none cursor-default

p-drop
	@apply block bg-[var(--cBack)] py-0 border-2 border-[var(--cMain)] rounded-sm shadow-mdd outline-none

	p-filter
		@apply block h-8 leading-8 overflow-x-hidden overflow-y-scroll relative

		[filter]
			@apply block shadow-md h-full relative w-full


	p-options
		@apply block relative overflow-x-hidden overflow-y-scroll mb-2 select-none
		max-height: 24rem

		&[selected]
			@apply shadow-md
			max-height: 8rem


	p-tip
		@apply sticky float-right right-1 top-1 text-[var(--cTextBackDisabled)] text-xs select-none z-50

		&[first]
			@apply text-[var(--cTextMain)]

	p-option
		@apply trans block px-2 cursor-pointer py-1

		&:hover:not([disabled]), &[focus-now]
			@apply text-[var(--cTextMain)] bg-[var(--cMain)]

		&[selected]
			@apply font-bold font-bold text-[var(--cMain)]

			&:hover
				@apply text-[var(--cTextBack)] bg-[unset]

		&[disabled]
			@apply text-[var(--cTextMainDisabled)] filter brightness-75 select-none cursor-default
</style>
