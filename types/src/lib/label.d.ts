export declare const props: {
	/** 控件属性 */
	param: {
		type: StringConstructor;
		default: null;
	};
	/** 标签 */
	label: {
		type: StringConstructor;
		default: null;
	};
	/** 标签-宽度 */
	labelWidth: {
		type: StringConstructor;
		default: null;
	};
	/** 标签-对齐方式 */
	labelAlign: {
		type: StringConstructor;
		default: null;
	};
	/** 标签-分隔符 */
	labelSplit: {
		type: StringConstructor;
		default: string;
	};
	/** 标签-是否禁用快速配置 */
	labelTextOnly: {
		type: BooleanConstructor;
		default: boolean;
	};
};



export declare const setup: (props: import('vue').ComponentObjectPropsOptions, $disabling: import('vue').ComputedRef<boolean>) => {
	$label: import('vue').ComputedRef<string | null>;
	$labelWidth: import('vue').ComputedRef<string | null>;
	$labelAlign: import('vue').ComputedRef<string>;
};
