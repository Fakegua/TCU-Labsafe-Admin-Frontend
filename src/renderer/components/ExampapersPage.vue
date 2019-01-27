<template>
	<div class="manage-exampapers-page">
		<el-table :data="tableData" stripe border max-height="500" style="width: 100%">
			<el-table-column align="center" prop="addtime" label="添加日期"></el-table-column>
			<el-table-column align="center" prop="exampaperTitle" label="试卷名字"></el-table-column>
			<el-table-column align="center" prop="exampaperCategory" label="试卷分类"></el-table-column>
			<el-table-column align="center" label="操作">
				<template slot-scope="scope">
					<el-button @click="editExampaper(scope.row)" type="primary" plain round size="small">编辑</el-button>
					<el-button @click="deleteExampaper(scope.row)" type="warning" plain round size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<br>
		<div style="text-align:center">
			<el-button style="width:80%" type="primary" @click="addExampaper" plain>添加试卷</el-button>
		</div>
		<!-- 弹出框 -->
		<el-dialog :title="dialogTitle" width="80%" :visible.sync="dialogVisible">
			<el-form :model="form" :rules="rules" ref="form">
				<el-row :gutter="20">
					<el-col :span="16">
						<el-form-item prop="exampaperTitle" label="试卷名称">
							<el-input v-model="form.exampaperTitle" autocomplete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="试卷分类">
							<el-select v-model="form.exampaperCategory" placeholder="请选择试卷分类">
								<el-option label="考试" value="考试"></el-option>
								<el-option label="自测" value="自测"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogCheck">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				dialogVisible: false,
				form: {
					id: "",
					exampaperTitle: "",
					exampaperCategory: "考试"
				},
				dialogTitle: "",
				rules: {
					exampaperTitle: [
						{ required: true, message: "请输入试卷名称", trigger: "change" },
						{
							min: 3,
							max: 100,
							message: "长度在 3 到 100 个字符",
							trigger: "change"
						}
					]
				}
			};
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.tableData = [];
				this.$http
					.get(this.$domain + "/exam/exampapers")
					.then(data => {
						this.exampapers = data.data;
						this.exampapers.forEach(e => {
							e.addtime = this.$utils.formatTime(e.addtime);
							this.tableData.push(e);
						});
					})
					.catch(err => {
						this.$message.error("操作失败，请检查网络或联系管理员");
						console.error(err);
					});
			},
			addExampaper() {
				if (!this.dialogVisible) {
					this.dialogVisible = true;
					this.dialogTitle = "添加试卷";
					this.form.exampaperTitle = "";
					this.form.id = "";
				} else {
					this.$refs["form"].validate(valid => {
						if (valid) {
							this.$http
								.post(this.$domain + "/exam/exampapers", {
									exampaperTitle: this.form.exampaperTitle,
									exampaperCategory: this.form.exampaperCategory
								})
								.then(result => {
									this.dialogVisible = false;
									this.$message.success("添加成功");
									this.init();
								})
								.catch(err => {
									this.$message.error("操作失败，请检查网络或联系管理员");
									console.error(err);
								});
						}
					});
				}
			},
			editExampaper(data) {
				if (!this.dialogVisible) {
					this.dialogVisible = true;
					this.dialogTitle = "编辑试卷";
					this.form.exampaperTitle = data.exampaperTitle;
					this.form.exampaperCategory = data.exampaperCategory;
					this.form.id = data.id;
				} else {
					this.$refs["form"].validate(valid => {
						if (valid) {
							this.$http
								.put(this.$domain + "/exam/exampapers", {
									id: this.form.id,
									exampaperTitle: this.form.exampaperTitle,
									exampaperCategory: this.form.exampaperCategory
								})
								.then(result => {
									this.dialogVisible = false;
									this.$message.success("编辑成功");
									this.init();
								})
								.catch(err => {
									this.$message.error("操作失败，请检查网络或联系管理员");
									console.error(err);
								});
						}
					});
				}
			},
			deleteExampaper(data) {
				this.$http
					.delete(
						this.$domain +
							`/exam/exampapers?id=${data.id}&exampaperTitle=${
								data.exampaperTitle
							}`
					)
					.then(result => {
						this.$message.success("删除成功");
						this.init();
					})
					.catch(err => {
						this.$message.error("操作失败，请检查网络或联系管理员");
						console.error(err);
					});
			},
			dialogCheck() {
				this.dialogTitle == "添加试卷"
					? this.addExampaper()
					: this.editExampaper();
			}
		}
	};
</script>

<style lang="scss">
	.manage-exampapers-page {
		.el-table {
			box-shadow: 0 0 10px gainsboro;
		}
	}
</style>