<template>
	<div class="index-page">
		<div class="one-row">
			<el-row :gutter="10">
				<el-col :span="6">
					<el-card>
						<el-row>
							<el-col :span="12">
								<font-awesome-icon icon="users"/>
							</el-col>
							<el-col :span="12">
								<div class="card-data" v-text="studentsCount"></div>
								<div class="card-title">学生总数</div>
							</el-col>
						</el-row>
					</el-card>
				</el-col>
				<el-col :span="6">
					<el-card>
						<el-row>
							<el-col :span="12">
								<font-awesome-icon icon="scroll"/>
							</el-col>
							<el-col :span="12">
								<div class="card-data" v-text="exampapersCount"></div>
								<div class="card-title">试卷总数</div>
							</el-col>
						</el-row>
					</el-card>
				</el-col>
				<el-col :span="6">
					<el-card>
						<el-row>
							<el-col :span="12">
								<font-awesome-icon icon="question"/>
							</el-col>
							<el-col :span="12">
								<div class="card-data" v-text="questionsCount"></div>
								<div class="card-title">题目总数</div>
							</el-col>
						</el-row>
					</el-card>
				</el-col>
				<el-col :span="6">
					<el-card>
						<el-row>
							<el-col :span="12">
								<font-awesome-icon icon="file"/>
							</el-col>
							<el-col :span="12">
								<div class="card-data" v-text="articlesCount"></div>
								<div class="card-title">文章总数</div>
							</el-col>
						</el-row>
					</el-card>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				studentsCount: "加载中",
				exampapersCount: "加载中",
				questionsCount: "加载中",
				articlesCount: "加载中"
			};
		},
		created() {},
		mounted() {
			this.init();
		},
		methods: {
			/* 初始化数据 */
			init() {
				//学生数
				this.$http
					.get(this.$domain + "/dashboard/count?type=user")
					.then(data => {
						this.studentsCount = data.data;
					})
					.catch(err => {
						this.$message.error("操作失败，请检查网络或联系管理员");
					});
				//试卷数
				this.$http
					.get(this.$domain + "/dashboard/count?type=exampaper")
					.then(data => {
						this.exampapersCount = data.data;
					})
					.catch(err => {
						this.$message.error("操作失败，请检查网络或联系管理员");
					});
				//题目数
				this.$http
					.get(this.$domain + "/dashboard/count?type=question")
					.then(data => {
						this.questionsCount = data.data;
					})
					.catch(err => {
						this.$message.error("操作失败，请检查网络或联系管理员");
					});
				//文章数
				this.$http
					.get(this.$domain + "/dashboard/count?type=article")
					.then(data => {
						this.articlesCount = data.data;
					})
					.catch(err => {
						this.$message.error("操作失败，请检查网络或联系管理员");
					});
			}
		}
	};
</script>

<style lang="scss">
	.index-page {
		.one-row {
			svg {
				margin-top: 10px;
				height: 40px;
				width: 80%;
				color: darkgrey;
			}

			.card-data {
				font-size: 30px;
			}

			.card-title {
				color: darkgrey;
			}
		}
	}
</style>
