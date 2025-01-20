declare const PR: {
	/** 按钮-文本 */
	text: { type: StringConstructor, default: string },

	/** （开关）样式-反转 */
	white: { type: (BooleanConstructor | StringConstructor)[], default: boolean },
	/** （开关）样式-禁用 */
	disable: { type: (BooleanConstructor | StringConstructor)[], default: boolean },

	/** 图标 */
	icon: { type: (ObjectConstructor | StringConstructor | ArrayConstructor | import("@fortawesome/fontawesome-svg-core").IconDefinition)[], default: null },
	/** （开关）图标-旋转 */
	spin: { type: BooleanConstructor, default: boolean },
};


/** 按钮组件 */
declare const Click: import("vue").DefineComponent<
	typeof PR, {},
	unknown, {}, {},
	import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin,
	{}, string,
	import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps,
	Readonly<import("vue").ExtractPropTypes<typeof PR>>,
	typeof PR, {}
>;



export default Click;
