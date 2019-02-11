<template>
	<div class="index-page">
		<div class="first-row">
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
								<div class="card-title">考试卷数</div>
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

		<!-- 表格部分 -->
		<div class="second-row">
			<el-row>
				<el-col :span="6">
					<el-select v-model="checkedExampaper" placeholder="请选择试卷" size="mini">
						<el-option
							v-for="(item,index) in exampapers"
							:key="index"
							:label="item.exampaperTitle"
							:value="item.exampaperTitle"
						></el-option>
					</el-select>
				</el-col>
				<el-col v-if="checkedExampaper" :span="6">
					<el-select v-model="checkedClass" placeholder="选择班级进行筛选" size="mini">
						<el-option v-for="(item,index) in userClass" :key="index" :label="item" :value="item"></el-option>
					</el-select>
				</el-col>
				<el-col v-if="checkedExampaper" :span="6">
					<el-button
						@click="exportExcel"
						type="success"
						size="mini"
						style="margin-left:20px;margin-top:14px"
					>导出为excel</el-button>
				</el-col>
			</el-row>
			<el-table id="table" empty-text="请选择试卷" :data="tableData" :border="true">
				<el-table-column prop="username" label="学号"></el-table-column>
				<el-table-column prop="userClass" label="班级"></el-table-column>
				<el-table-column prop="userName" label="姓名"></el-table-column>
				<el-table-column prop="score" label="成绩"></el-table-column>
				<el-table-column prop="addtime" label="考试时间"></el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	import FileSaver from "file-saver";
	import XLSX from "xlsx";
	export default {
		data() {
			return {
				studentsCount: "0",
				exampapersCount: "0",
				questionsCount: "0",
				articlesCount: "0",
				checkedExampaper: "",
				checkedClass: "",
				finishedExampapers: [],
				students: [],
				exampapers: [],
				userClass: [],
				tableData: []
			};
		},
		created() {},
		mounted() {
			this.getCount();
			this.getExampapers();
			this.getStudents();
			this.getFinishedExampapers();
		},
		methods: {
			getCount() {
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
			},
			getExampapers() {
				this.$http
					.get(this.$domain + "/exam/exampapers")
					.then(data => {
						data.data.forEach(e => {
							if (e.exampaperCategory == "考试") this.exampapers.push(e);
						});
					})
					.catch(err => {
						this.$message.error("操作失败，请检查网络或联系管理员");
					});
			},
			getStudents() {
				this.$http
					.get(this.$domain + "/users/")
					.then(data => {
						this.students = data.data.userList;
					})
					.catch(err => {
						this.$message.error("操作失败，请检查网络或联系管理员");
					});
			},
			getFinishedExampapers() {
				this.$http
					.get(this.$domain + "/exam/finishedexampapers")
					.then(data => {
						this.finishedExampapers = data.data;
					})
					.catch(err => {
						this.$message.error("操作失败，请检查网络或联系管理员");
					});
			},
			exportExcel() {
				/* generate workbook object from table */
				var wb = XLSX.utils.table_to_book(document.querySelector("#table"));
				/* get binary string as output */
				var wbout = XLSX.write(wb, {
					bookType: "xlsx",
					bookSST: true,
					type: "array"
				});
				try {
					FileSaver.saveAs(
						new Blob([wbout], { type: "application/octet-stream" }),
						`${this.checkedExampaper}(${
							this.checkedClass ? this.checkedClass : "全体"
						}).xlsx`
					);
				} catch (e) {
					if (typeof console !== "undefined") console.log(e, wbout);
				}
				return wbout;
			}
		},
		watch: {
			checkedExampaper(value) {
				this.tableData = [];
				this.checkedClass = "";
				let userClass = new Set();
				//遍历学生
				this.students.forEach(item => {
					let cache = {};
					cache.username = item.username;
					cache.userName = item.userName;
					cache.score = "未考试";
					cache.addtime = " - ";
					cache.userClass = item.userClass;
					//将班级信息存入set
					userClass.add(item.userClass);
					//存入表格
					this.tableData.push(cache);
				});
				userClass = Array.from(userClass); //set转为array
				this.userClass = userClass;
				//筛选试卷
				this.finishedExampapers.forEach(item => {
					if (item.finishedExampaper == value) {
						this.tableData.forEach(item2 => {
							if (item.username == item2.username) {
								item2.score = item.finishedScore;
								item2.addtime = this.$utils.formatTime(item.addtime);
							}
						});
					}
				});
			},
			checkedClass(value) {
				if (value) {
					this.tableData = [];
					this.students.forEach(item => {
						let cache = {};
						if (item.userClass == value) {
							cache.username = item.username;
							cache.userName = item.userName;
							cache.score = "未考试";
							cache.addtime = " - ";
							cache.userClass = item.userClass;
							//存入表格
							this.tableData.push(cache);
						}
					});
					//筛选试卷
					this.finishedExampapers.forEach(item => {
						if (item.finishedExampaper == this.checkedExampaper) {
							this.tableData.forEach(item2 => {
								if (item.username == item2.username) {
									item2.score = item.finishedScore;
									item2.addtime = this.$utils.formatTime(item.addtime);
								}
							});
						}
					});
				}
			}
		}
	};
</script>

<style lang="scss">
	.index-page {
		.first-row {
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
			position: relative;
			&::after {
				position: absolute;
				bottom: -40px;
				left: 240px;
				display: block;
				width: 0;
				border-left: 25px solid transparent;
				border-right: 25px solid transparent;
				border-bottom: 30px solid white;
				content: "";
				z-index: 999;
			}
		}

		.second-row {
			overflow: auto;
			position: relative;
			width: 100%;
			margin-top: 24px;
			height: 420px;
			background: white;
			border-radius: 5px;
			box-shadow: 0 0 10px gainsboro;

			.el-table {
				width: 95%;
				margin: 10px auto 0 auto;
			}

			.el-select {
				margin: 15px 0 0 20px;
			}

			.el-row {
				z-index: 999;
			}
		}
	}
</style>
