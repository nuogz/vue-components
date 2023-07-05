import { computed } from 'vue';

import { bropBoolean } from '@nuogz/utility';



/** @type {import('vue').ComponentObjectPropsOptions} */
export const props = {
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
 * @param {import('vue').ComponentObjectPropsOptions} props
 * @param {import('vue').ComputedRef<boolean>} $disabling
 */
export const setup = (props, $disabling) => {
	const labelTextOnly_ = computed(() => bropBoolean(props.labelTextOnly));

	const labelQuick = computed(() => {
		const { label } = props;
		const labelSafe = String(label);

		let result = [];

		if(label && labelSafe.trim()) {
			result = labelTextOnly_.value ? [labelSafe.trim()] : labelSafe.split('|');
		}

		return result;
	});

	const $label = computed(() => {
		const label = labelQuick.value[0];
		const labelSplit = props.labelSplit;

		return label ? `${label}${labelSplit}` : null;
	});

	const $labelWidth = computed(() => {
		const widthQuick = labelQuick.value[1];
		const widthLabel = props.labelWidth;

		let result = null;

		if(widthQuick && String(widthQuick).trim()) { result = String(widthQuick).trim(); }
		if(widthLabel && String(widthLabel).trim()) { result = String(widthLabel).trim(); }

		if($disabling.value) { result = `calc(${result} - 1.5rem)`; }

		return result;
	});

	const $labelAlign = computed(() => {
		const alignQuick = labelQuick.value[2];
		const alignLabel = props.labelAlign;

		let result = 'right';

		if(alignQuick && String(alignQuick).trim()) { result = alignQuick; }
		if(alignLabel && String(alignLabel).trim()) { result = alignLabel; }

		return result;
	});

	return { $label, $labelWidth, $labelAlign };
};
