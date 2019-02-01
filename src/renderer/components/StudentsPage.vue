<template>
	<div class="manage-students-page">
		<el-input placeholder="请输入搜索内容" v-model="searchContent">
			<el-select style="width:130px" v-model="searchCategory" slot="prepend" placeholder="请选择">
				<el-option label="学号" value="username"></el-option>
				<el-option label="姓名" value="user_name"></el-option>
				<el-option label="班级" value="user_class"></el-option>
				<el-option label="添加时间" value="addtime"></el-option>
			</el-select>
			<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
		</el-input>
		<br>
		<br>
		<el-table :data="tableData" stripe border max-height="500" style="width: 100%">
			<!-- <el-table-column type="index" align="center" label="序号"></el-table-column> -->
			<el-table-column width="110" align="center" prop="username" label="学号"></el-table-column>
			<el-table-column width="110" align="center" prop="userName" label="姓名"></el-table-column>
			<el-table-column width="110" align="center" prop="userPhone" label="联系方式"></el-table-column>
			<el-table-column width="130" align="center" prop="userClass" label="班级"></el-table-column>
			<el-table-column width="130" align="center" prop="addtime" label="添加日期"></el-table-column>
			<el-table-column align="center" width="150" label="操作" fixed="right">
				<template slot-scope="scope">
					<el-button @click="editStudent(scope.row)" type="primary" plain round size="small">编辑</el-button>
					<el-button @click="deleteStudent(scope.row)" type="warning" plain round size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<br>
		<el-row>
			<el-col>
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
		</el-row>
		<br>

		<!-- 弹出框 -->
		<el-dialog :title="dialogTitle" width="80%" :visible.sync="dialogVisible">
			<el-form :model="form" :rules="rules" ref="form">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item prop="username" label="学号">
							<el-input v-model="form.username" autocomplete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item prop="userName" label="姓名">
							<el-input v-model="form.userName"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item prop="userClass" label="班级">
							<el-input v-model="form.userClass"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item prop="userPhone" label="联系方式">
							<el-input v-model="form.userPhone"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editStudent">确 定</el-button>
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
				searchContent: "",
				searchCategory: "username",
				form: {
					id: "",
					username:"",
					userName:"",
					userPhone:"",
					userClass:""
				},
				dialogTitle: "",
				rules: {
					username: [
						{ required: true, message: "请输入学号", trigger: "change" }
					],
					userName: [
						{ required: true, message: "请输入姓名", trigger: "change" }
					],
					userClass: [
						{ required: true, message: "请输入班级", trigger: "change" }
					],
					userPhone: [
						{ required: true, message: "请输入联系方式", trigger: "change" }
					]
				},
				currentPage: 1,
				pageCount: 1
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
							`/users/?pageNum=${
								this.currentPage
							}&searchContent=${searchContent}&searchCategory=${searchCategory}`
					);
				} else {
					cache = this.$http.get(
						this.$domain + `/users/?pageNum=${this.currentPage}`
					);
				}
				cache
					.then(data => {
						this.students = data.data.userList;
						this.pageCount = data.data.pageCount;
						this.students.forEach(e => {
							e.addtime = this.$utils.formatTime(e.addtime);
							this.tableData.push(e);
						});
					})
					.catch(err => {
						this.$message.error("操作失败，请检查网络或联系管理员");
						console.error(err);
					});
			},
			editStudent(data) {
				if (!this.dialogVisible) {
					this.dialogVisible = true;
					this.dialogTitle = "编辑学生信息";
					this.form.username = data.username;
					this.form.userName = data.userName;
					this.form.userClass = data.userClass;
					this.form.userPhone = data.userPhone;
					this.form.id = data.id;
				} else {
					this.$refs["form"].validate(valid => {
						if (valid) {
							this.$http
								.put(this.$domain + "/users/", {
									id: this.form.id,
									username: this.form.username,
									userName: this.form.userName,
									userClass: this.form.userClass,
									userPhone: this.form.userPhone
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
			deleteStudent(data) {
				this.$http
					.delete(this.$domain + `/users/?id=${data.id}`)
					.then(result => {
						this.$message.success("删除成功");
						this.init(this.searchContent, this.searchCategory);
					})
					.catch(err => {
						this.$message.error("操作失败，请检查网络或联系管理员");
						console.error(err);
					});
			},
			currentChange(c) {
				this.currentPage = c;
				this.init(this.searchContent, this.searchCategory);
			},
			search() {
				this.init(this.searchContent, this.searchCategory);
			}
		}
	};
</script>

<style lang="scss">
	.manage-students-page {
		.el-table {
			box-shadow: 0 0 10px gainsboro;
		}
	}
</style>