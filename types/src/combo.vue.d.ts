import { props as propsCommon } from './lib/label.js';



declare const PR: {
	/** 主值 */
	modelValue: {
		type: (BooleanConstructor | StringConstructor | ArrayConstructor | NumberConstructor)[];
		default: string;
	};
	/** （开关）是否禁用主值 */
	disable: {
		type: BooleanConstructor;
		default: boolean;
	};
	/** 主值-文本值 */
	text: {
		type: StringConstructor;
		default: string;
	};
	/** 启用禁用框下的默认值 */
	default: {
		type: (BooleanConstructor | StringConstructor | NumberConstructor)[];
		default: string;
	};

	/** （开关）启用禁用框 */
	disabling: {
		type: (BooleanConstructor | StringConstructor)[];
		default: boolean;
	};
	/** （开关）只读 */
	readonly: {
		type: (BooleanConstructor | StringConstructor)[];
		default: boolean;
	};

	/** 控件属性 */
	param: typeof propsCommon.param;
	/** 标签 */
	label: typeof propsCommon.label;
	/** 标签-宽度 */
	labelWidth: typeof propsCommon.labelWidth;
	/** 标签-对齐方式 */
	labelAlign: typeof propsCommon.labelAlign;
	/** 标签-分隔符 */
	labelSplit: typeof propsCommon.labelSplit;
	/** 标签-是否禁用快速配置 */
	labelTextOnly: typeof propsCommon.labelTextOnly;

	/** 下拉选项 */
	options: {
		type: ArrayConstructor;
		default: () => never[];
		required: true;
	};

	/** 留空提示 */
	place: {
		type: (StringConstructor | NumberConstructor)[];
		default: string;
	};
	/** 焦点顺序 */
	tab: {
		type: (StringConstructor | NumberConstructor)[];
		default: number;
	};

	/** 文本-对齐方式 */
	align: {
		type: StringConstructor;
		default: null;
	};
	/** 下拉选项-对齐方式 */
	alignOptions: {
		type: StringConstructor;
		default: null;
	};

	/** 筛选选项 */
	filter: {
		type: (BooleanConstructor | StringConstructor | FunctionConstructor)[];
		default: boolean;
	};
	/** （开关）多选 */
	multiSelect: {
		type: (BooleanConstructor | StringConstructor)[];
		default: boolean;
	};

	/** 显示值所在的键值 */
	keyShow: {
		type: (StringConstructor | ArrayConstructor | FunctionConstructor)[];
		default: string;
	};
	/** 数据值所在的键值 */
	keyValue: {
		type: StringConstructor;
		default: string;
	};

	/** 数据分隔符 */
	separatorValue: {
		type: StringConstructor;
		default: string;
	};
	/** 显示分隔符 */
	separatorShow: {
		type: StringConstructor;
		default: string;
	};

	/** （控制）切换下拉显示隐藏 */
	openSwitch: {
		type: BooleanConstructor;
		default: boolean;
	};
};


/** 下拉选择组件 */
declare const Combo: import("vue").DefineComponent<
	typeof PR, {},
	unknown, {}, {},
	import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin,
	{}, string,
	import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps,
	Readonly<import("vue").ExtractPropTypes<typeof PR>>,
	typeof PR, {}
>;



export default Combo;
