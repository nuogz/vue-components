<template>
	<comp-grid :no-border="brop(!isShowBorder)">
		<!-- 表头 -->
		<p-head v-if="isShowHead">
			<table ref="domHead" head :style="{ left: leftHead }">
				<tr v-for="row of headsNow" row>
					<th v-for="head of row" cell
						:_lastInRow="brop(head.isLast)"
						:rowspan="head.row" :colspan="head.col"

						:title="head.text"

						:style="styleCell(head, 'head')"
						:no-padding="brop(!(head.padding ?? isShowPadding))"
						:no-border="brop(!isShowBorder)"
					>
						{{ head.text }}
						<Icon v-if="head.sort" sort-icon :_enable="brop(sorts.find(s => s.index == head.index)?.direct)" :icon="icons$sort[sorts.find(s => s.index == head.index)?.direct] ?? faArrowDownUpAcrossLine" @click="atSort(head)" />
					</th>
				</tr>
			</table>
		</p-head>

		<!-- 表身 -->
		<p-body v-if="isShowBody"
			:style="{ height: heightBody }"
			@scroll="onScrollBody"
		>
			<table body>
				<template v-for="(data, did) of datas">
					<tr row
						:selected="brop(isShowSelect && selected == data)"
						:hover="brop(isShowSelect)"
						@dblclick="onDblclick(data)"
					>
						<template v-for="head of headsRaw">
							<template v-if="head.slot === true">
								<td cell
									:_lastInRow="brop(did == datas.length - 1)"

									:title="data[head.index]"

									:style="styleCell(head, 'body', head.whiteSpace)"
									:no-padding="brop(!(head.padding ?? isShowPadding))"
									:no-border="brop(!isShowBorder)"
									:even="brop(isShowOdd && !(did % 2))"
									:odd="brop(isShowOdd && did % 2)"
								>
									<slot :name="`column-${head.index}`" :data="data" />
								</td>
							</template>
							<template v-else-if="head.html === true">
								<td cell
									:_lastInRow="brop(did == datas.length - 1)"

									:title="data[head.indexTitle]"

									:style="styleCell(head, 'body', head.whiteSpace)"
									:no-padding="brop(!(head.padding ?? isShowPadding))"
									:no-border="brop(!isShowBorder)"
									:even="brop(isShowOdd && !(did % 2))"
									:odd="brop(isShowOdd && did % 2)"
									v-html="data[head.index]"
								/>
							</template>
							<template v-else>
								<td cell
									:_lastInRow="brop(did == datas.length - 1)"

									:title="data[head.index]"

									:style="styleCell(head, 'body', head.whiteSpace)"
									:no-padding="brop(!(head.padding ?? isShowPadding))"
									:no-border="brop(!isShowBorder)"
									:even="brop(isShowOdd && !(did % 2))"
									:odd="brop(isShowOdd && did % 2)"

									@click="atSelectData(data)"
								>
									{{ data[head.index] }}
								</td>
							</template>
						</template>
					</tr>
					<tr v-if="data.$expanded" row
						:selected="brop(isShowSelect && selected == data)"
						:hover="brop(isShowSelect)"
						@dblclick="onDblclick(data)"
					>
						<td expand :colspan="headsRaw.length">
							<slot name="expand" :data="data" />
						</td>
					</tr>
				</template>
			</table>
		</p-body>
	</comp-grid>
</template>

<script setup>
	import { computed, ref, watch } from 'vue';

	import { brop, bropBoolean, toCSSLength } from '@nuogz/utility';

	import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
	import { faArrowDownUpAcrossLine, faArrowDown91, faArrowDown19 } from '@fortawesome/free-solid-svg-icons';



	const props = defineProps({
		/** 主值 */
		modelValue: { type: Object, default: () => ({}) },

		/** 表头 */
		heads: { type: Array, default: () => [], required: true },
		/** 数据集 */
		datas: { type: Array, default: () => [], required: true },

		/** （开关）显示表头 */
		showHead: { type: [Boolean, String], default: true },
		/** （开关）显示数据 */
		showBody: { type: [Boolean, String], default: true },
		/** （开关）显示表格两侧的留空 */
		showPadding: { type: [Boolean, String], default: true },
		/** （开关）显示表格线 */
		showBorder: { type: [Boolean, String], default: true },
		/** （开关）显示斑马底色 */
		showOdd: { type: [Boolean, String], default: true },
		/** （开关）显示当前选择 */
		showSelect: { type: [Boolean, String], default: false },

		/** （开关）启用多选 */
		multiSelect: { type: [Boolean, String], default: false },
		/** （开关）启用自动高度 */
		autoHeight: { type: [Boolean, String], default: false },

		/** 行高 */
		rowHeight: { type: [Number, String], default: '3rem|2rem' },

		/** 双击函数 */
		onDblclick: { type: Function, default: () => (function() { }) },
	});
	const emit = defineEmits(['update:modelValue', 'sort']);


	// 开关
	const isShowHead = computed(() => bropBoolean(props.showHead));
	const isShowBody = computed(() => bropBoolean(props.showBody));
	const isShowPadding = computed(() => bropBoolean(props.showPadding));
	const isShowOdd = computed(() => bropBoolean(props.showOdd));
	const isShowBorder = computed(() => bropBoolean(props.showBorder));
	const isShowSelect = computed(() => bropBoolean(props.showSelect));


	// 表头
	const headsRaw = computed(() => props.heads.filter(head => !head.hide));
	const headsNow = computed(() => {
		let stackMax = 1;
		const headsStack = [[]];
		const rowLast = [];


		headsRaw.value.forEach(col => {
			const heads = col.text.split('|').reverse();


			if(heads.length > stackMax) {
				const diff = heads.length - stackMax;

				stackMax = heads.length;

				headsStack.push(...JSON.parse(`[${'[],'.repeat(diff - 1)}[]]`));

				for(const rl of rowLast) { rl.row++; }
			}


			heads.forEach((text, tid) => {
				const line = headsStack[tid];
				const lastCell = line[line.length - 1];

				if(lastCell?.text != text) {
					const isLast = heads.length - 1 == tid;

					const cell = {
						...col,

						text,

						col: 1,
						row: 1 + (isLast ? stackMax - heads.length : 0),

						align: (isLast ? col.align : 'center'),
					};
					cell.isLast = isLast;

					line.push(cell);

					if(tid == heads.length - 1) {
						rowLast.push(cell);
					}
				}
				else {
					lastCell.col++;
				}
			});
		});

		return headsStack;
	});



	const icons$sort = {
		'ASC': faArrowDown19,
		'DESC': faArrowDown91,
	};
	const sorts = ref([]);

	const atSort = head => {
		const $sorts = sorts.value;
		const index = head.index;


		let sort = $sorts.find(sort => sort.index == index);
		if(!sort) { $sorts.push(sort = { index, direct: '' }); }


		if(sort.direct == '') {
			sort.direct = 'ASC';
		}
		else if(sort.direct == 'ASC') {
			sort.direct = 'DESC';
		}
		else if(sort.direct == 'DESC') {
			const index = $sorts.findIndex(s => s === sort);

			if(!~index) { return; }

			$sorts.splice(index, 1);
		}


		emit('sort', $sorts.filter(sort => sort.direct).map(sort => `${sort.index} ${sort.direct}`).join(','));
	};



	// 行高 格式：行高|(表头行高)
	const heightRowRaw = computed(() => props.rowHeight);
	const heightRow = computed(() => {
		const raw = heightRowRaw.value;

		if(typeof raw == 'number') {
			const height = toCSSLength(raw);

			return { head: height, body: height };
		}

		const [heightBodyRaw, heightHeadRaw] = String(raw).trim().split('|');

		return {
			head: toCSSLength(heightHeadRaw ?? heightBodyRaw),
			body: toCSSLength(heightBodyRaw),
		};
	});


	// 单元格样式
	const styleCell = (head, type, whiteSpace) => ({
		width: toCSSLength(head.width ?? 60),
		minWidth: toCSSLength(head.width ?? 60),
		maxWidth: toCSSLength(head.width ?? 60),
		textAlign: head.align,
		height: heightRow.value[type],
		whiteSpace,
	});


	// 表头高度
	const heightHead = ref();
	const domHead = ref(null);
	watch(isShowBorder, () => setTimeout(() => heightHead.value = domHead.value && getComputedStyle(domHead.value).height), { immediate: true });
	const heightBody = computed(() =>
		`calc(100% - ${heightHead.value ?? `(${heightRow.value.head} + 2px) * ${headsNow.value.length})`}`
	);


	// 滚动同步
	const leftHead = ref(0);
	const onScrollBody = event => {
		// 先计算比较，结果不相同再赋值。可有效减少渲染次数和卡顿
		const leftNew = toCSSLength(-event?.target?.scrollLeft) ?? '0';

		if(leftNew != leftHead.value) { leftHead.value = leftNew; }
	};


	// 数据
	const datas = computed(() => props.datas);
	const selected = ref(null);
	const atSelectData = data => emit('update:modelValue', selected.value = data);
</script>

<style lang="sass" scoped>
comp-grid
	@apply block overflow-hidden border rounded-sm shadow-mdd border-[var(--cBorderBack)]

	&[no-border]
			@apply border-0

	table
		@apply relative table-fixed bg-transparent text-sm min-w-full
		border-spacing: 0

		&[head]
			color: color-mix(in srgb, var(--cTextMain) 70%, var(--cMain))

			[cell][_lastInRow]
				@apply text-[var(--cTextMain)]


				[sort-icon]
					@apply absolute h-4 top-2 right-2 cursor-pointer

					&[_enable]
						@apply text-[var(--cOkay)]

		&[body]
			>[row]
				>[cell]
					&[even]
						@apply bg-[var(--cBack)]
					&[odd]
						background-color: color-mix(in srgb, var(--cMain) 20%, var(--cBack))

				&[hover]:hover
					>[cell]
						@apply cursor-pointer
						background-color: color-mix(in srgb, var(--cMain) 70%, var(--cBack))

				&[selected]
					>[cell]
						cursor: default !important
						background-color: color-mix(in srgb, var(--cMain) 90%, var(--cBack)) !important


		[row]
			@apply relative

			&:first-child [cell]
				@apply border-t-0

			[expand]
				@apply relative p-0

			[cell]
				@apply relative overflow-hidden whitespace-nowrap overflow-ellipsis p-2 border border-[var(--cBorderBack)]

				&:first-child
					@apply border-l-0

				&:last-child
					@apply border-r border-r-[var(--cBorderBack)]
					border-right-style: dashed

				&[_lastInRow]
					@apply border-b border-b-[var(--cBorderBack)]
					border-bottom-style: dashed

				&[no-padding]
					padding: 1px

				&[no-border]
					@apply border-0


	p-head
		@apply relative block w-full z-10 overflow-x-hidden overflow-y-scroll bg-[var(--cMain)]

	p-body
		@apply relative block w-full z-20 overflow-scroll
</style>
