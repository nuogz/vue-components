declare const PR: {
	/** 主值 */
	modelValue: {
		type: ObjectConstructor;
		default: () => {};
	};
	/** 表头 */
	heads: {
		type: ArrayConstructor;
		default: () => never[];
	};
	/** 数据集 */
	datas: {
		type: ArrayConstructor;
		default: () => never[];
	};

	/** （开关）显示表头 */
	showHead: {
		type: (BooleanConstructor | StringConstructor)[];
		default: boolean;
	};
	/** （开关）显示数据 */
	showBody: {
		type: (BooleanConstructor | StringConstructor)[];
		default: boolean;
	};
	/** （开关）显示表格两侧的留空 */
	showPadding: {
		type: (BooleanConstructor | StringConstructor)[];
		default: boolean;
	};
	/** （开关）显示表格线 */
	showBorder: {
		type: (BooleanConstructor | StringConstructor)[];
		default: boolean;
	};
	/** （开关）显示斑马底色 */
	showOdd: {
		type: (BooleanConstructor | StringConstructor)[];
		default: boolean;
	};
	/** （开关）显示当前选择 */
	showSelect: {
		type: (BooleanConstructor | StringConstructor)[];
		default: boolean;
	};
	/** （开关）启用多选 */
	multiSelect: {
		type: (BooleanConstructor | StringConstructor)[];
		default: boolean;
	};
	/** （开关）启用自动高度 */
	autoHeight: {
		type: (BooleanConstructor | StringConstructor)[];
		default: boolean;
	};

	/** 行高 */
	rowHeight: {
		type: (StringConstructor | NumberConstructor)[];
		default: string;
	};

	/** 双击函数 */
	onDblclick: {
		type: FunctionConstructor;
		default: () => () => void;
	};
};


/** 表格 */
declare const Grid: import("vue").DefineComponent<
	typeof PR, {},
	unknown, {}, {},
	import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin,
	{}, string,
	import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps,
	Readonly<import("vue").ExtractPropTypes<typeof PR>>,
	typeof PR, {}
>;



export default Grid;
