<template>
	<div class="manage-articles-page">
		<el-input placeholder="请输入搜索内容" v-model="searchContent">
			<el-select style="width:130px" v-model="searchCategory" slot="prepend" placeholder="请选择">
				<el-option label="题目" value="article_title"></el-option>
				<el-option label="作者" value="article_author"></el-option>
				<el-option label="文章分类" value="article_category"></el-option>
				<el-option label="添加日期" value="addtime"></el-option>
			</el-select>
			<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
		</el-input>
		<br>
		<br>
		<el-table :data="tableData" stripe border max-height="500" style="width: 100%">
			<!-- <el-table-column type="index" align="center" label="序号"></el-table-column> -->
			<el-table-column width="130" align="center" prop="addtime" label="添加日期"></el-table-column>
			<el-table-column
				width="150"
				:show-overflow-tooltip="true"
				align="center"
				prop="articleTitle"
				label="题目"
			></el-table-column>
			<el-table-column align="center" prop="articleCategory" label="分类"></el-table-column>
			<el-table-column align="center" prop="articleAuthor" label="作者"></el-table-column>
			<!-- <el-table-column align="center" prop="articleBody" :show-overflow-tooltip="true" label="正文"></el-table-column> -->
			<el-table-column align="center" width="150" label="操作">
				<template slot-scope="scope">
					<el-button @click="editArticle(scope.row)" type="primary" plain round size="small">编辑</el-button>
					<el-button @click="deleteArticle(scope.row)" type="warning" plain round size="small">删除</el-button>
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
					<el-button type="primary" @click="addArticle" plain>添加文章</el-button>
				</div>
			</el-col>
		</el-row>
		<br>

		<!-- 弹出框 -->
		<el-dialog :title="dialogTitle" width="80%" :visible.sync="dialogVisible" @opened="initEditor">
			<el-form :model="form" :rules="rules" ref="form">
				<el-row>
					<el-col>
						<el-form-item prop="articleTitle" label="题目">
							<el-input v-model="form.articleTitle" autocomplete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item prop="articleAuthor" label="作者">
							<el-input v-model="form.articleAuthor"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="分类">
							<el-select style="width:100%" v-model="form.articleCategory">
								<el-option label="通识类" value="通识类"></el-option>
								<el-option label="消防安全" value="消防安全"></el-option>
								<el-option label="化学安全" value="化学安全"></el-option>
								<el-option label="电气安全" value="电气安全"></el-option>
								<el-option label="辐射安全" value="辐射安全"></el-option>
								<el-option label="特种设备" value="特种设备"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<!-- <el-form-item prop="articleBody" label="答案解析">
							<el-input v-model="form.articleBody"></el-input>
						</el-form-item>-->
						<div ref="editor">
						</div>
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
	import E from "wangeditor";
	export default {
		data() {
			return {
				tableData: [],
				dialogVisible: false,
				searchContent: "",
				searchCategory: "article_title",
				form: {
					id: "",
					articleTitle: "",
					articleCategory: "",
					articleAuthor: "",
					articleBody: ""
				},
				dialogTitle: "",
				rules: {
					articleTitle: [
						{ required: true, message: "请输入题目", trigger: "change" },
						{
							min: 3,
							max: 100,
							message: "长度在 3 到 100 个字符",
							trigger: "change"
						}
					],
					articleAuthor: [
						{ required: true, message: "请输入作者", trigger: "change" }
					],
				},
				currentPage: 1,
				pageCount: 1,
				editor: "" //WangEditor编辑器
			};
		},
		mounted() {
			this.init();
		},
		methods: {
			init(searchContent, searchCategory) {
				this.tableData = [];
				let cache; //暂存 axios promise
				if (searchContent) {
					cache = this.$http.get(
						this.$domain +
							`/articles/?pageNum=${
								this.currentPage
							}&searchContent=${searchContent}&searchCategory=${searchCategory}`
					);
				} else {
					cache = this.$http.get(
						this.$domain + `/articles/?pageNum=${this.currentPage}`
					);
				}
				cache
					.then(data => {
						this.articles = data.data.articleList;
						this.pageCount = data.data.pageCount;
						this.articles.forEach(e => {
							e.addtime = this.$utils.formatTime(e.addtime);
							this.tableData.push(e);
						});
					})
					.catch(err => {
						this.$message.error("操作失败，请检查网络或联系管理员");
						console.error(err);
					});
			},
			addArticle() {
				if (!this.dialogVisible) {
					this.dialogVisible = true;
					this.dialogTitle = "添加文章";
					this.form.articleTitle = "";
					this.form.articleAuthor = "";
					this.form.articleCategory = "通识类";
					this.form.articleBody = "";
					this.form.id = "";
				} else {
					this.$refs["form"].validate(valid => {
						if (valid) {
							this.$http
								.post(this.$domain + "/articles/", {
									articleTitle: this.form.articleTitle,
									articleCategory: this.form.articleCategory,
									articleAuthor: this.form.articleAuthor,
									articleBody: this.form.articleBody
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
			editArticle(data) {
				if (!this.dialogVisible) {
					this.dialogVisible = true;
					this.dialogTitle = "编辑文章";
					this.form.articleTitle = data.articleTitle;
					this.form.articleCategory = data.articleCategory;
					this.form.articleBody = data.articleBody;
					this.form.articleAuthor = data.articleAuthor;
					this.form.id = data.id;
				} else {
					this.$refs["form"].validate(valid => {
						if (valid) {
							this.$http
								.put(this.$domain + "/articles/", {
									id: this.form.id,
									articleTitle: this.form.articleTitle,
									articleCategory: this.form.articleCategory,
									articleAuthor: this.form.articleAuthor,
									articleBody: this.form.articleBody
								})
								.then(result => {
									this.dialogVisible = false;
									this.$message.success("编辑成功");
									this.init(this.searchContent, this.searchCategory);
								})
								.catch(err => {
									this.$message.error("操作失败，请检查网络或联系管理员");
									console.error(err);
								});
						}
					});
				}
			},
			deleteArticle(data) {
				this.$http
					.delete(this.$domain + `/articles/?id=${data.id}`)
					.then(result => {
						this.$message.success("删除成功");
						this.init(this.searchContent, this.searchCategory);
					})
					.catch(err => {
						this.$message.error("操作失败，请检查网络或联系管理员");
						console.error(err);
					});
			},
			dialogCheck() {
				this.dialogTitle == "添加文章" ? this.addArticle() : this.editArticle();
			},
			currentChange(c) {
				this.currentPage = c;
				this.init(this.searchContent, this.searchCategory);
			},
			search() {
				this.init(this.searchContent, this.searchCategory);
			},
			initEditor() {
				/* 初始化WangEditor编辑器 */
				if (!this.editor) {
					this.editor = new E(this.$refs.editor);
					this.editor.customConfig.onchange = html => {
						this.form.articleBody = html;
					};
					this.editor.customConfig.pasteIgnoreImg = true; // 粘贴忽略图片
					this.editor.customConfig.menus = [
						"head", // 标题
						"bold", // 粗体
						"fontSize", // 字号
						"fontName", // 字体
						"italic", // 斜体
						"underline", // 下划线
						"strikeThrough", // 删除线
						"link", // 插入链接
						"list", // 列表
						"justify", // 对齐方式
						"quote", // 引用
						"table", // 表格
						"undo", // 撤销
						"redo" // 重复
					];
					this.editor.create();
				}
				this.editor.txt.html(this.form.articleBody);
			}
		}
	};
</script>

<style lang="scss">
	.manage-articles-page {
		.el-table {
			box-shadow: 0 0 10px gainsboro;
		}
	}
</style>