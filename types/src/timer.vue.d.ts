import { props as propsCommon } from './lib/label.js';



declare const PR: {
	/** 主值 */
	modelValue: {
		type: (BooleanConstructor | StringConstructor)[];
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

	/** 起始时间 */
	begin: {
		type: (StringConstructor | NumberConstructor)[];
		default: string;
	};
	/** 结束时间 */
	end: {
		type: (StringConstructor | NumberConstructor)[];
		default: string;
	};

	/** 显示格式器 */
	showFormatter: {
		type: (StringConstructor | FunctionConstructor)[];
		default: null;
	};
	/** 输出格式器 */
	valueFormatter: {
		type: StringConstructor[];
		default: null;
	};
	/**
	 * 结束时间模式
	 * - `true`，显示：`24:60:60`，传值：`24:60:60`
	 * - `false`，显示：`23:59:59`，传值：`23:59:59`
	 * - `'show'`，显示：`24:60:60`，传值：`23:59:59`
	 */
	endTimeMode: {
		type: (BooleanConstructor | StringConstructor)[];
		default: boolean;
	};
};


/** 时间日期 */
declare const Timer: import("vue").DefineComponent<
	typeof PR, {},
	unknown, {}, {},
	import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin,
	{}, string,
	import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps,
	Readonly<import("vue").ExtractPropTypes<typeof PR>>,
	typeof PR, {}
>;



export default Timer;
