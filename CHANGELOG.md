# CHANGELOG

## v1.11.1 - 2023.08.30 00
* fix `package.json`


## v1.11.0 - 2023.08.30 00
* (new) `Click` support `disable` prop
* (break) renew color-related CSS variables
* improve styles of disabled components
* bump up dependencies
* tweak style
* add tailwind configuration for intellisense


## v1.10.0 - 2023.07.05 11
* (new) renew all declaration files to be properly compatible with the intellisense for latest `Volar`
* (break) rename the `ImageDragger` component to `FileDragger`
* (new) new `FileDragger` prop `accept`, `dragLabel` and `draggingLabel`
* (new) `FileDragger` support `paste` event
* (break) some `Combo` props renamed
	* rename the `list` prop to `options`
	* rename the `dropAlign` prop to `alignOption`
* improve `Pager`
* improve components code style


## v1.9.0 - 2023.05.31 10
* (new) add `ImageDragger`
* update components
	* `Click`: show text as title tips; improve style
	* `Combo`: support new props `separatorValue` and `separatorShow`; improve style
	* `Grid`: support columns sorting; improve style
	* `Grid`: support `expand` slot; 
	* `Grid`: support `column` slot; 
	* `Pager`: renew style
	* `Timer`: use `Day.js` instead `Moment.js`;
	* `Timer`: add easy button: `prev(next) day` and `current time` 
	* `Timer`: split prop `formatter` to 2 new props: `showFormatter` and `valueFormatter`
* use eslint flat config, and related config udpate
	* use `eslint.config.js` instead `eslintrc.cjs`
* update recommanded extensions
	* use `Volar` instead `Vetur`
* use `bropBoolean` instead `parseBoolProp`
* renew base config
* add declaration files


## v1.8.1 - 2022.12.30 20
* fix `package.json` peerDependencies


## v1.8.0 - 2022.12.30 19
* `Combo` support `dropAlign`
* bump up dependencies

## v1.7.0 - 2022.09.17 07
* `Textbox` scrollbar is back
* improve lots of `Combo` code
* fix and improve `Combo` tabindex and focus
* add and improve more keyborad shortcut to `Combo`


## v1.6.1 - 2022.09.16 10
* fix `Click` icon type check


## v1.6.0 - 2022.09.16 09
* `Combo` will hide options after single select
* `Combo` support `openSwitch` to control option hide and show
* `Combo` support navigator by keypress


## v1.5.0 - 2022.09.13 10
* add textarea component `Textbox`
* bump up dependencies


## v1.4.0 - 2022.08.30 09
* `Click` support props `icon` and `spin`
* improve import
* bump up dependencies


## v1.3.4 - 2022.08.30 02
* fix `package.files`
* bump up dependencies


## v1.3.3 - 2022.08.30 01
* add `sideEffects` to `package.json`
* bump up dependencies


## v1.3.2 - 2022.08.24 15
* update `package.json`.`peerDependencies`
* bump up versions


## v1.3.1 - 2022.08.24 15
* improve package info


## v1.3.0 - 2022.08.24 03
* recheck all dependencies
* remove more config files. This configs depends on host now
* fix some configs


## v1.2.0 - 2022.08.23
* no longer pre-build codes
* `vite.build.rollupOptions.external` is not good, cancel all configs about build external


## v1.1.0 - 2022.08.23 11
* use `vite` lib mode to build code, instead export directly
* update `jsconfig.json`
* update `package.json`.`dependencies` and use `peerDependencies`
* sort `package.json` keys
* bump up versions
* simplify `tailwind.config.cjs ` and `vite.config.js`


## v1.0.0 - 2022.08.22 17
* independent from many projects
* tweak all files for publishing to npm
* start use `CHANGLOG.md` since version `v1.0.0`
