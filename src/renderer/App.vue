<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: "labsafeTcuEduCnAdmin"
	};
</script>

<style>
	/* CSS */
	/* @import url('~element-ui/lib/theme-chalk/index.css'); */
	* {
		box-sizing: border-box;
	}
	html,
	body,
	#app {
		height: 100%;
		min-width: 1000px;
		margin: 0;
		padding: 0;
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
			"Microsoft YaHei", "微软雅黑", Arial, sans-serif;
	}
</style>
