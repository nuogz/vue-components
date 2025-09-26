import { computed } from 'vue';

import { bropBoolean } from '@nuogz/utility';



/** @type {import('vue').ComponentObjectPropsOptions} */
export const propsCommon = {
	/** 只读（布尔开关） */
	readonly: { type: [Boolean, String], default: false },
	/** 控件属性 */
	param: { type: String, default: null },
	/** 标签 */
	label: { type: String, default: null },
	/** 标签-宽度 */
	labelWidth: { type: String, default: null },
	/** 标签-对齐方式 */
	labelAlign: { type: String, default: null },
	/** 标签-分隔符 */
	labelSplit: { type: String, default: '：' },
	/** 标签-是否禁用快速配置 */
	labelTextOnly: { type: Boolean, default: false },
};


/**
 * @param {import('vue').ComponentObjectPropsOptions} propsComponent
 * @param {import('vue').ComputedRef<boolean>} $disabling
 */
export const setupCommon = (propsComponent, $disabling) => {
	const $labelTextOnly = computed(() => bropBoolean(propsComponent.labelTextOnly));

	const $labelQuick = computed(() => {
		const { label } = propsComponent;
		const labelSafe = String(label);

		let result = [];

		if(label && labelSafe.trim()) {
			result = $labelTextOnly.value ? [labelSafe.trim()] : labelSafe.split('|');
		}

		return result;
	});

	const $label = computed(() => {
		const label = $labelQuick.value[0];
		const labelSplit = propsComponent.labelSplit;

		return label ? `${label}${labelSplit}` : null;
	});

	const $labelWidth = computed(() => {
		const widthQuick = $labelQuick.value[1];
		const widthLabel = propsComponent.labelWidth;

		let result = null;

		if(widthQuick && String(widthQuick).trim()) { result = String(widthQuick).trim(); }
		if(widthLabel && String(widthLabel).trim()) { result = String(widthLabel).trim(); }

		if($disabling.value) { result = `calc(${result} - 1.5rem)`; }

		return result;
	});

	const $labelAlign = computed(() => {
		const alignQuick = $labelQuick.value[2];
		const alignLabel = propsComponent.labelAlign;

		let result = 'right';

		if(alignQuick && String(alignQuick).trim()) { result = alignQuick; }
		if(alignLabel && String(alignLabel).trim()) { result = alignLabel; }

		return result;
	});

	return { $label, $labelWidth, $labelAlign };
};
