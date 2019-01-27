<template>
	<div class="manage-exampapers-page">
		<el-table :data="tableData" stripe border max-height="500" style="width: 100%">
			<!-- <el-table-column type="index" align="center" label="序号"></el-table-column> -->
			<el-table-column width="130" align="center" prop="addtime" label="添加日期"></el-table-column>
			<el-table-column
				width="150"
				:show-overflow-tooltip="true"
				align="center"
				prop="questionTitle"
				label="题目"
			></el-table-column>
			<el-table-column align="center" prop="questionCategory" label="题目分类"></el-table-column>
			<el-table-column align="center" :show-overflow-tooltip="true" prop="optionA" label="选项A"></el-table-column>
			<el-table-column align="center" :show-overflow-tooltip="true" prop="optionB" label="选项B"></el-table-column>
			<el-table-column align="center" :show-overflow-tooltip="true" prop="optionC" label="选项C"></el-table-column>
			<el-table-column align="center" :show-overflow-tooltip="true" prop="optionD" label="选项D"></el-table-column>
			<el-table-column align="center" prop="questionAnswer" label="答案"></el-table-column>
			<el-table-column align="center" prop="questionMark" label="分值"></el-table-column>
			<el-table-column width="100" align="center" prop="questionExampaper" label="所属试卷"></el-table-column>
			<el-table-column align="center" prop="questionExplain" label="题目解析"></el-table-column>
			<el-table-column align="center" width="150" label="操作" fixed="right">
				<template slot-scope="scope">
					<el-button @click="editQuestion(scope.row)" type="primary" plain round size="small">编辑</el-button>
					<el-button @click="deleteExampaper(scope.row)" type="warning" plain round size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<br>
		<el-row>
			<el-col :span="18">
				<div style="text-align:center">
					<el-pagination
						@current-change="currentChange"
						:current-page="currentPage"
						layout="prev, pager, next"
						:page-count="pageCount"
						background
					></el-pagination>
				</div>
			</el-col>
			<el-col :span="6">
				<div style="text-align:center">
					<el-button type="primary" @click="addQuetion" plain>添加题目</el-button>
				</div>
			</el-col>
		</el-row>
		<br>

		<!-- 弹出框 -->
		<el-dialog :title="dialogTitle" width="80%" :visible.sync="dialogVisible">
			<el-form :model="form" :rules="rules" ref="form">
				<el-row :gutter="20">
					<el-col :span="18">
						<el-form-item prop="questionTitle" label="题目">
							<el-input v-model="form.questionTitle" autocomplete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="题目分类">
							<el-select v-model="form.questionCategory">
								<el-option label="选择题" value="选择题"></el-option>
								<el-option label="判断题" value="判断题"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20" v-if="form.questionCategory == '选择题'">
					<el-col :span="6">
						<el-form-item prop="optionA" label="选项A">
							<el-input v-model="form.optionA"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item prop="optionB" label="选项B">
							<el-input v-model="form.optionB"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item prop="optionC" label="选项C">
							<el-input v-model="form.optionC"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item prop="optionD" label="选项D">
							<el-input v-model="form.optionD"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="题目答案">
							<el-select v-model="form.questionAnswer" v-if="form.questionCategory == '选择题'">
								<el-option label="A" value="a"></el-option>
								<el-option label="B" value="b"></el-option>
								<el-option label="C" value="c"></el-option>
								<el-option label="D" value="d"></el-option>
							</el-select>
							<el-select v-model="form.questionAnswer" v-else>
								<el-option label="T" value="t"></el-option>
								<el-option label="F" value="f"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item prop="questionMark" label="分值">
							<el-input v-model="form.questionMark"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item prop="questionExampaper" label="所属试卷">
							<el-select v-model="form.questionExampaper">
								<el-option
									v-for="(item, index) in questionExampaperOptions"
									:key="index"
									:value="item.exampaperTitle"
									:label="item.exampaperTitle"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item prop="questionExplain" label="答案解析">
							<el-input v-model="form.questionExplain"></el-input>
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
				questionExampaperOptions: [],
				form: {
					id: "",
					questionTitle: "",
					questionCategory: "选择题",
					optionA: "",
					optionB: "",
					optionC: "",
					optionD: "",
					questionAnswer: "",
					questionMark: "",
					questionExampaper: "",
					questionExplain: ""
				},
				dialogTitle: "",
				rules: {
					questionTitle: [
						{ required: true, message: "请输入试卷名称", trigger: "change" },
						{
							min: 3,
							max: 100,
							message: "长度在 3 到 100 个字符",
							trigger: "change"
						}
					],
					questionMark: [
						{ required: true, message: "请输入分值", trigger: "change" },
					],
					questionAnswer: [
						{ required: true, message: "请输入答案", trigger: "change" }
					]
				},
				currentPage: 1,
				pageCount: 1
			};
		},
		mounted() {
			this.init();
			//获取题目所属试卷选项
			this.$http
				.get(this.$domain + "/exam/exampapers")
				.then(data => {
					console.log("data :", data);
					this.questionExampaperOptions = data.data;
				})
				.catch(err => {
					this.$message.error("操作失败，请检查网络或联系管理员");
					console.error(err);
				});
		},
		methods: {
			init() {
				this.tableData = [];
				this.$http
					.get(this.$domain + `/exam/questions?pageNum=${this.currentPage}`)
					.then(data => {
						this.questions = data.data.questionList;
						this.pageCount = data.data.pageCount;
						this.questions.forEach(e => {
							e.addtime = this.$utils.formatTime(e.addtime);
							this.tableData.push(e);
						});
					})
					.catch(err => {
						this.$message.error("操作失败，请检查网络或联系管理员");
						console.error(err);
					});
			},
			addQuetion() {
				if (!this.dialogVisible) {
					this.dialogVisible = true;
					this.dialogTitle = "添加题目";
					this.form.questionTitle = "";
					this.form.questionCategory = "";
					this.form.optionA = "";
					this.form.optionB = "";
					this.form.optionC = "";
					this.form.optionD = "";
					this.form.questionAnswer = "";
					this.form.questionMark = "";
					this.form.questionExampaper = "";
					this.form.questionExplain = "";
					this.form.id = "";
				} else {
					this.$refs["form"].validate(valid => {
						if (valid) {
							this.$http
								.post(this.$domain + "/exam/questions", {
									questionTitle: this.form.questionTitle,
									questionCategory: this.form.questionCategory,
									optionA: this.form.optionA,
									optionB: this.form.optionB,
									optionC: this.form.optionC,
									optionD: this.form.optionD,
									questionAnswer: this.form.questionAnswer,
									questionMark: this.form.questionMark,
									questionExampaper: this.form.questionExampaper,
									questionExplain: this.form.questionExplain
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
			editQuestion(data) {
				if (!this.dialogVisible) {
					this.dialogVisible = true;
					this.dialogTitle = "编辑题目";
					this.form.questionTitle = data.questionTitle;
					this.form.questionCategory = data.questionCategory;
					this.form.optionA = data.optionA;
					this.form.optionB = data.optionB;
					this.form.optionC = data.optionC;
					this.form.optionD = data.optionD;
					this.form.questionAnswer = data.questionAnswer;
					this.form.questionMark = data.questionMark;
					this.form.questionExampaper = data.questionExampaper;
					this.form.questionExplain = data.questionExplain;
					this.form.id = data.id;
				} else {
					this.$refs["form"].validate(valid => {
						if (valid) {
							this.$http
								.put(this.$domain + "/exam/questions", {
									id: this.form.id,
									questionTitle: this.form.questionTitle,
									questionCategory: this.form.questionCategory,
									optionA: this.form.optionA,
									optionB: this.form.optionB,
									optionC: this.form.optionC,
									optionD: this.form.optionD,
									questionAnswer: this.form.questionAnswer,
									questionMark: this.form.questionMark,
									questionExampaper: this.form.questionExampaper,
									questionExplain: this.form.questionExplain
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
					.delete(this.$domain + `/exam/questions?id=${data.id}`)
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
				this.dialogTitle == "添加题目" ? this.addQuetion() : this.editQuestion();
			},
			currentChange(c) {
				this.currentPage = c;
				this.init();
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