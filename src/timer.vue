<template>
	<comp-combo>
		<!-- 禁用 -->
		<p-disabling v-if="$disabling" class="inblock" :checked="brop(!$disable)" @click="$disable = !$disable" />

		<!-- 标签 -->
		<p-label v-if="$label" :disabled="brop($disable)" class="inblock elli" :style="styleLabel" @click="$disabling && ($disable = !$disable)">{{ $label }}</p-label>

		<!-- 输入框 -->
		<p-value ref="domValue" class="inblock" @click="!$disable && !$readonly && atClickDrop()">
			<input
				ref="domValue"
				:value="textShow"
				:style="{ textAlign: align }"
				:placeholder="place"
				:tabindex="tab"
				:readonly="true"
				:disabled="brop($disable)"
			/>
		</p-value>

		<!-- 下拉列表 -->
		<p-drop ref="domDrop" tabindex="0">
			<p-drop-values>
				<p-drop-value v-if="isShowOptionsYear"><span>{{ timeValueSafe.format('YYYY') }}</span>年</p-drop-value>
				<p-drop-value v-if="isShowOptionsMonth"><span>{{ timeValueSafe.format('MM') }}</span>月</p-drop-value>
				<p-drop-value v-if="isShowOptionsDate"><span>{{ timeValueSafe.format('DD') }}</span>日</p-drop-value>
				<p-drop-value v-if="isShowOptionsHour"><span>{{ timeValueSafe.format('HH') }}</span>时</p-drop-value>
				<p-drop-value v-if="isShowOptionsMinute"><span>{{ timeValueSafe.format('mm') }}</span>分</p-drop-value>
				<p-drop-value v-if="isShowOptionsSecond"><span>{{ timeValueSafe.format('ss') }}</span>秒</p-drop-value>
				<Click v-if="isShowOptionsDate" drop-button white text="向前一天" @click="atSelect('day-add', -1)" />
				<Click drop-button white text="当前时间" @click="atSelect('now')" />
				<Click v-if="isShowOptionsDate" drop-button white text="向后一天" @click="atSelect('day-add', 1)" />
			</p-drop-values>
			<p-drop-options-box>
				<p-drop-options v-if="isShowOptionsYear">
					<p-drop-option v-for="option of optionsYear" :key="`Timer-year-${option.data}`"
						:selected="option.select || undefined"
						@click="atSelect('year', option.data)"
					>
						{{ option.data }}
					</p-drop-option>
				</p-drop-options>
				<p-drop-options v-if="isShowOptionsMonth">
					<p-drop-option v-for="option of optionsMonth" :key="`Timer-month-${option.data}`"
						:selected="option.select || undefined"
						@click="atSelect('month', option.data - 1)"
					>
						{{ option.data }}
					</p-drop-option>
				</p-drop-options>
				<p-drop-options v-if="isShowOptionsDate" date>
					<p-drop-option-date
						v-for="(option, oid) of optionsDay" :key="`Timer-day-${oid}`" day
						:style="{ left: `${-(oid % 7) + 3}px` }"
					>
						{{ option }}
					</p-drop-option-date>
					<p-drop-option-date
						v-for="(option, oid) of optionsDate" :key="`Timer-date-${oid}`"
						:out-month="option.outMonth || undefined"
						:out-range="option.outRange || undefined"
						:selected="option.selected || undefined"
						:month-t="option.headDay || option.headWeek || undefined"
						:month-b="option.tailDay || option.tailWeek || undefined"
						:month-l="option.headDay || (!option.outMonth && option.weekDay == 6) || undefined"
						:month-r="option.tailDay || (!option.outMonth && option.weekDay == 5) || undefined"
						:style="{ top: `-${parseInt(oid / 7)}px`, left: `${-(oid % 7) + 3}px` }"
						@click="atSelect('fulldate', option)"
					>
						{{ option.date }}
					</p-drop-option-date>
				</p-drop-options>
				<p-drop-options v-if="isShowOptionsHour">
					<p-drop-option v-for="option of optionsHour" :key="`Timer-hour-${option.data}`"
						:selected="option.select || undefined"
						@click="atSelect('hour', modeEndTime == 2 ? option.data - 1 : option.data)"
					>
						{{ option.data }}
					</p-drop-option>
				</p-drop-options>
				<p-drop-options v-if="isShowOptionsMinute">
					<p-drop-option v-for="option of optionsMinute" :key="`Timer-minute-${option.data}`"
						:selected="option.select || undefined"
						@click="atSelect('minute', modeEndTime == 2 ? option.data - 1 : option.data)"
					>
						{{ option.data }}
					</p-drop-option>
				</p-drop-options>
				<p-drop-options v-if="isShowOptionsSecond">
					<p-drop-option v-for="option of optionsSecond" :key="`Timer-second-${option.data}`"
						:selected="option.select || undefined"
						@click="atSelect('second', modeEndTime == 2 ? option.data - 1 : option.data)"
					>
						{{ option.data }}
					</p-drop-option>
				</p-drop-options>
			</p-drop-options-box>
		</p-drop>
	</comp-combo>
</template>

<script setup>
	import { computed, nextTick, onMounted, ref, watch } from 'vue';
	import Day from 'dayjs';
	import Tippy from 'tippy.js';

	import { brop, bropBoolean } from '@nuogz/utility';

	import { props as propsCommon, setup as setupCommon } from './lib/label.js';


	import Click from './click.vue';



	const formatsType = {
		'00': 'YYYY', '11': 'MM', '22': 'DD', '33': 'HH', '44': 'mm', '55': 'ss',
		'01': 'YYYY-MM', '02': 'YYYY-MM-DD', '03': 'YYYY-MM-DD HH', '04': 'YYYY-MM-DD HH:mm', '05': 'YYYY-MM-DD HH:mm:ss',
		'12': 'MM-DD', '13': 'MM-DD HH', '14': 'MM-DD HH:mm', '15': 'MM-DD HH:mm:ss',
		'23': 'DD HH', '24': 'DD HH:mm', '25': 'DD HH:mm:ss',
		'34': 'HH:mm', '35': 'HH:mm:ss',
		'45': 'mm:ss',
	};

	const formatsShow = {
		'00': 'YYYY年', '11': 'MM月', '22': 'DD日', '33': 'HH时', '44': 'mm分', '55': 'ss秒',
		'01': 'YYYY年MM月', '02': 'YYYY-MM-DD', '03': 'YYYY-MM-DD HH时', '04': 'YYYY-MM-DD HH时mm分', '05': 'YYYY-MM-DD HH:mm:ss',
		'12': 'MM月DD日', '13': 'MM月DD日 HH时', '14': 'MM月DD日 HH:mm', '15': 'MM月DD日 HH:mm:ss',
		'23': 'DD日HH时', '24': 'DD日HH时mm分', '25': 'DD日HH:mm:ss',
		'34': 'HH时mm分', '35': 'HH:mm:ss',
		'45': 'mm分ss秒',
	};

	const typeList = ['Y', 'M', 'D', 'H', 'm', 's'];


	const props = defineProps({
		/** 主值 */
		modelValue: { type: [String, Boolean], default: '' },
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


		/** 留空提示 */
		place: { type: [Number, String], default: '' },
		/** 焦点顺序 */
		tab: { type: [Number, String], default: 0 },

		/** 文本-对齐方式 */
		align: { type: String, default: null },

		/** 起始时间 */
		begin: { type: [Number, String], default: '' },
		/** 结束时间 */
		end: { type: [Number, String], default: '' },

		/** 显示格式器 */
		showFormatter: { type: [Function, String], default: null },
		/** 输出格式器 */
		valueFormatter: { type: [String], default: null },
		/**
		 * 结束时间模式
		 * - `true`，显示：`24:60:60`，传值：`24:60:60`
		 * - `false`，显示：`23:59:59`，传值：`23:59:59`
		 * - `'show'`，显示：`24:60:60`，传值：`23:59:59`
		 */
		endTimeMode: { type: [Boolean, String], default: false }
	});
	const emit = defineEmits(['update:modelValue', 'update:disable', 'update:value']);


	const $disabling = computed(() => bropBoolean(props.disabling));
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

	// 处理标签
	const { $label, $labelWidth, $labelAlign } = setupCommon(props, $disabling);
	const styleLabel = computed(() => ({ width: $labelWidth.value, textAlign: $labelAlign.value }));

	// 响应参数
	const $readonly = computed(() => bropBoolean(props.readonly));
	const $showFormatter = ref(props.showFormatter);
	const $valueFormatter = ref(props.valueFormatter);
	const $param = ref(props.param);
	const $begin = ref(props.begin);
	const $end = ref(props.end);
	const $endTimeMode = ref(props.endTimeMode);
	// const $showFormatter = computed(() => props.showFormatter);
	// const $param = computed(() => props.param);
	// const $begin = computed(() => props.begin);
	// const $end = computed(() => props.end);
	// const $endTimeMode = computed(() => props.endTimeMode);

	// 时间格式范围
	// `YMDHms`对应`年月日时分秒`
	// `时间区间`由最大的时间单位和最小的时间单位组成, 无关顺序, `MHm`等价于`HmM`
	// 可以为`分`和`秒`设置时间间隔, `m15Y`表示区间年到分, `分`间隔为15, 即显示0/15/30/45
	const $timeRange = computed(() => {
		let result = {
			start: 5,
			end: 0
		};

		(($param.value || '').split('|')[0].match(/[YMDHms]\d*/g) || ['Y', 's']).forEach(raw => {
			let [type, interval] = raw.match(/^[YMDHms]|\d+$/g);

			type = typeList.indexOf(type);

			if(type == -1) { return; }

			if(type < result.start) { result.start = type; }
			if(type > result.end) { result.end = type; }

			result[type] = interval || 1;
		});

		return result;
	});
	// 是否显示下拉选择
	const ranger = (num, ranger) => num >= ranger.start && num <= ranger.end;
	const isShowOptionsYear = computed(() => ranger(0, $timeRange.value));
	const isShowOptionsMonth = computed(() => ranger(1, $timeRange.value));
	const isShowOptionsDate = computed(() => ranger(2, $timeRange.value));
	const isShowOptionsHour = computed(() => ranger(3, $timeRange.value));
	const isShowOptionsMinute = computed(() => ranger(4, $timeRange.value));
	const isShowOptionsSecond = computed(() => ranger(5, $timeRange.value));
	/** 对应模式下的日期格式 */
	const format = computed(() => $valueFormatter.value || formatsType[`${$timeRange.value.start}${$timeRange.value.end}`]);
	/** 对应模式下的展示格式 */
	const sormat = computed(() => formatsShow[`${$timeRange.value.start}${$timeRange.value.end}`]);

	// 最早的可选时间
	const $timeBegin = computed(() => {
		const time = Day($begin.value, format.value);
		return time.isValid() ? time : null;
	});
	// 最晚的可选时间
	const $timeEnd = computed(() => {
		const time = Day($end.value, format.value);
		return time.isValid() ? time : null;
	});

	/** 当前时间的Dayjs封装 */
	const timeValue = computed(() => Day($value.value, format.value));
	const timeValueSafe = computed(() => timeValue.value.isValid() ? timeValue.value : Day().startOf('day'));
	/** 当前时间的显示值 */
	const textShow = computed(() => {
		if(timeValue.value.isValid()) {
			if(typeof $showFormatter.value == 'string') {
				return timeValue.value.format($showFormatter.value);
			}
			else if(typeof $showFormatter.value == 'function') {
				return $showFormatter(timeValue.value);
			}
			else {
				return timeValue.value.format(sormat.value);
			}
		}
		else {
			return $value.value;
		}
	});


	// 下拉选项
	const optionsYear = computed(() => {
		const options = [];

		const yearNow = Day().year();
		let year = yearNow + 4;
		while(year >= yearNow - 7) {
			options.push({
				select: timeValueSafe.value.year() == year,
				data: year--
			});
		}

		return options;
	});
	const optionsMonth = computed(() => {
		const options = [];

		let month = 1;
		while(month <= 12) {
			options.push({
				select: timeValueSafe.value.month() + 1 == month,
				data: month++
			});
		}

		return options;
	});
	const optionsDay = ref(['日', '一', '二', '三', '四', '五', '六']);
	const optionsDate = computed(() => {
		const value = timeValueSafe.value;
		const begin = $timeBegin.value;
		const end = $timeEnd.value;

		const headDay = value.clone().startOf('month');
		const tailDay = value.clone().endOf('month');

		let cursor = value.clone().startOf('month').add(1, 'hours');

		const options = [];
		while(cursor.isBetween(headDay, tailDay)) {
			options.push({
				year: cursor.year(),
				month: cursor.month() + 1,
				date: cursor.date(),
				full: cursor.format('YYYY-MM-DD'),
				outRange: !!(begin && cursor.isBefore(begin)) || !!(end && cursor.isAfter(end)),
				outMonth: false,
				selected: value.isSame(cursor, 'date'),
				weekDay: cursor.weekday(),
				headDay: cursor.date() == headDay.date(),
				tailDay: cursor.date() == tailDay.date(),
				headWeek: cursor.diff(headDay, 'days') < 7,
				tailWeek: cursor.diff(tailDay, 'days') > -7,
			});

			cursor = cursor.add(1, 'days');
		}

		let preFill = headDay.weekday() == 6 ? 14 : headDay.weekday() + 15;
		cursor = headDay.clone();

		while(preFill-- > 0) {
			cursor = cursor.subtract(1, 'day');

			options.unshift({
				year: cursor.year(),
				month: cursor.month() + 1,
				date: cursor.date(),
				full: cursor.format('YYYY-MM-DD'),
				weekDay: cursor.weekday(),
				outRange: !!(begin && cursor.isBefore(begin)) || !!(end && cursor.isAfter(end)),
				outMonth: true,
				selected: value.isSame(cursor, 'date'),
			});
		}

		cursor = tailDay.clone();

		while(options.length < 63) {
			cursor = cursor.add(1, 'day');

			options.push({
				year: cursor.year(),
				month: cursor.month() + 1,
				date: cursor.date(),
				full: cursor.format('YYYY-MM-DD'),
				weekDay: cursor.weekday(),
				outRange: !!(begin && cursor.isBefore(begin)) || !!(end && cursor.isAfter(end)),
				outMonth: true,
				selected: value.isSame(cursor, 'date'),
			});
		}
		// 响应参数

		return options;
	});

	const modeEndTime = computed(() => $endTimeMode.value == 'show' ? 2 : ~~bropBoolean($endTimeMode.value));
	const optionsHour = computed(() => {
		const options = [];

		let hour = 0;
		while(hour <= 23) {
			options.push({
				select: timeValueSafe.value.hour() == hour,
				data: modeEndTime.value ? hour + 1 : hour
			});

			hour += 1;
		}

		return options;
	});
	const optionsMinute = computed(() => {
		const options = [];

		const interval = $timeRange.value ? $timeRange.value[4] || 1 : 1;
		let minute = 0;
		while(minute <= 59) {
			options.push({
				select: timeValueSafe.value.minute() == minute,
				data: modeEndTime.value ? minute + 1 : minute
			});

			minute += ~~interval;
		}

		return options;
	});
	const optionsSecond = computed(() => {
		const options = [];

		const interval = $timeRange.value ? $timeRange.value[5] || 1 : 1;
		let second = 0;
		while(second <= 59) {
			options.push({
				select: timeValueSafe.value.second() == second,
				data: modeEndTime.value ? second + 1 : second
			});

			second += ~~interval;
		}

		return options;
	});


	const domValue = ref(null);
	const domDrop = ref(null);

	const tippyDrop = ref(null);
	const widthDrop = ref('');

	const atShowDrop = () => nextTick(async () => {
		document.querySelectorAll('p-drop-option[selected]').forEach(dom => dom.scrollIntoView({ block: 'center' }));
	});
	const atHideDrop = () => { };

	const atClickDrop = () => {
		if(tippyDrop.value.state.isShown) {
			tippyDrop.value.hide();
		}
		else {
			widthDrop.value = window.getComputedStyle(domValue.value).width;

			tippyDrop.value.show();
		}
	};
	const atSelect = (type, data) => {
		let timeNew;


		if(type == 'now') {
			timeNew = Day();
		}
		else if(type == 'day-add') {
			timeNew = timeValueSafe.value.add(data, 'day');
		}
		else if(type == 'fulldate' && !data.outRange) {
			timeNew = timeValueSafe.value.year(data.year).month(data.month - 1).date(data.date);
		}
		else {
			timeNew = timeValueSafe.value[type](data);
		}


		$value.value = timeNew.format(format.value);


		atShowDrop();
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
			onHide: atHideDrop,
			onShow: atShowDrop,
		});
	});

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
	@apply block relative float-left w-auto h-full overflow-hidden cursor-pointer select-none

	&[disabled]
		@apply text-[var(--cTextMainDisabled)] filter brightness-75 select-none cursor-default


p-value
	@apply block relative w-auto h-full overflow-hidden border-b-2 border-solid border-[var(--cMain)]
	padding: 0 0.25rem
	z-index: 1

p-value
	input
		@apply relative w-full h-full overflow-hidden

		outline: none
		background: transparent
		font-size: inherit

		&:disabled
			@apply text-[var(--cTextMainDisabled)] filter brightness-75 select-none cursor-default


p-drop
	@apply block bg-[var(--cBack)] py-2 rounded-b-sm shadow-2xl overflow-hidden
	@apply border-2 border-[var(--cMain)]
	p-drop-values
		@apply block px-1 mb-2

		p-drop-value
			@apply text-xs leading-8 text-[var(--cTextBack)]

			span
				@apply px-1 text-base leading-8 text-[var(--cMain)]

		[drop-button]
			@apply ml-2 px-2 py-1 h-6 leading-6 text-xs

	p-drop-options-box
		@apply px-1

		p-drop-options
			@apply inline-block align-top h-[calc(theme("spacing.1")*78)] overflow-x-hidden overflow-y-auto border-r border-transparent select-none


			&:not(:last-child)
				@apply border-[var(--cTextBack)]
			&[date]
				@apply overflow-y-hidden px-1
				width: calc(theme("spacing.1") * 42 + theme("spacing.1") * 2 + 1px)
				line-height: 0

			p-drop-option
				@apply block px-2 mx-1 text-sm leading-6 text-center cursor-pointer border border-transparent
				&:hover
					@apply border-[var(--cMain)]
				min-width: 4rem

			p-drop-option-date
				@apply relative inblock w-6 h-8 leading-8 text-sm text-center cursor-pointer border border-transparent z-10

				&:not([day]):not([out-month]):not([out-range]):hover
					@apply z-20 border-[var(--cMain)]
				&[day]
					@apply text-sm leading-8 select-none cursor-default
				&[out-month]
					@apply text-[var(--cTextMainDisabled)]
					&:hover
						@apply text-[var(--cTextBack)]
				&[out-range]
					@apply text-[var(--cBack)] cursor-default
				&[month-t]
					@apply border-t-[var(--cMain)]
				&[month-b]
					@apply border-b-[var(--cMain)]
				&[month-l]
					@apply border-l-[var(--cMain)]
				&[month-r]
					@apply border-r-[var(--cMain)]
				&[month-t][month-l]
					@apply rounded-tl-sm
				&[month-t][month-r]
					@apply rounded-tr-sm
				&[month-b][month-l]
					@apply rounded-bl-sm
				&[month-b][month-r]
					@apply rounded-br-sm
			[selected]
				@apply font-bold text-[var(--cTextMain)] bg-[var(--cMain)] cursor-default
</style>
