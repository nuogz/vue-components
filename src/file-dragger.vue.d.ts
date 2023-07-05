import { props as propsCommon } from './lib/label.js';



declare const PR: {
	/** 主值 */
	modelValue: {
		type: ArrayConstructor[];
		default: () => never[];
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

	/** 文件类型 */
	accept: {
		type: StringConstructor;
		default: string;
	};
	/** （开关）多选 */
	multiSelect: {
		type: (BooleanConstructor | StringConstructor)[];
		default: boolean;
	};
	/** 未拖入时显示的文本 */
	dragLabel: {
		type: StringConstructor;
		default: string;
	};
	/** 拖入时显示的文本 */
	draggingLabel: {
		type: StringConstructor;
		default: string;
	};
};


/** 文件选择组件 */
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
