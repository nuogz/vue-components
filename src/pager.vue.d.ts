declare const PR: {
	/** 主值 */
	modelValue: {
		type: NumberConstructor;
		default: number;
	};

	/** 单页数据上限 */
	limit: {
		type: NumberConstructor;
		default: number;
	};
	/** 总页数 */
	total: {
		type: NumberConstructor;
		default: number;
	};

	/** 隐藏选项 */
	hider: {
		type: StringConstructor;
		default: string;
	};
};


/** 翻页 */
declare const Pager: import("vue").DefineComponent<
	typeof PR, {},
	unknown, {}, {},
	import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin,
	{}, string,
	import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps,
	Readonly<import("vue").ExtractPropTypes<typeof PR>>,
	typeof PR, {}
>;



export default Pager;
