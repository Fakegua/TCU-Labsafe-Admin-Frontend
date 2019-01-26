<template>
	<div class="landing-page">
		<!-- <el-menu
			:default-active="activeIndex"
			mode="horizontal"
			@select="handleSelect"
		>
			<el-menu-item index="1">处理中心</el-menu-item>
			<el-submenu index="2">
				<template slot="title">我的工作台</template>
				<el-menu-item index="2-1">选项1</el-menu-item>
				<el-menu-item index="2-2">选项2</el-menu-item>
				<el-menu-item index="2-3">选项3</el-menu-item>
				<el-submenu index="2-4">
					<template slot="title">选项4</template>
					<el-menu-item index="2-4-1">选项1</el-menu-item>
					<el-menu-item index="2-4-2">选项2</el-menu-item>
					<el-menu-item index="2-4-3">选项3</el-menu-item>
				</el-submenu>
			</el-submenu>
			<el-menu-item index="3" disabled>消息中心</el-menu-item>
		</el-menu>-->
		<el-row>
			<el-col class="left" :span="6">
				<el-menu
					class="menu"
					default-active="index"
					background-color="#545c64"
					text-color="#fff"
					active-text-color="#ffd04b"
					:router="true"
				>
					<el-menu-item index="index">
						<i class="el-icon-info"></i>
						<span slot="title">仪表盘</span>
					</el-menu-item>
					<el-menu-item index="exampapers">
						<i class="el-icon-tickets"></i>
						<span slot="title">试卷管理</span>
					</el-menu-item>
					<el-menu-item index="questions">
						<i class="el-icon-edit"></i>
						<span slot="title">题目管理</span>
					</el-menu-item>
					<el-menu-item index="files">
						<i class="el-icon-document"></i>
						<span slot="title">文件管理</span>
					</el-menu-item>
					<el-menu-item index="students">
						<i class="el-icon-menu"></i>
						<span slot="title">学生管理</span>
					</el-menu-item>
				</el-menu>
			</el-col>
			<el-col class="right" :span="18">
				<router-view></router-view>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		data() {
			return {};
		}
	};
</script>

<style lang="scss">
	.landing-page {
		&,
		& > .el-row,
		.left,
		.right,
		.menu {
			height: 100%;
		}

		.right {
			background-color: whitesmoke;

			& > div {
				padding: 20px;
			}
		}
	}
</style>
