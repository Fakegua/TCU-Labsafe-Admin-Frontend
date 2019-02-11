<template>
	<div class="admin-page">
		<el-input type="password" v-model="password" placeholder="请输入修改后密码"></el-input>
		<br>
		<br>
		<el-input type="password" v-model="password2" placeholder="请再次输入修改后密码"></el-input>
		<br>
		<br>
		<el-button style="width:100%" @click="changePassword">修改密码</el-button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				password: "",
				password2: ""
			};
		},
		methods: {
			changePassword() {
				if (this.password == this.password2 && this.password) {
					this.$http
						.put(this.$domain + "/admin/", {
							id: 1,
							password: this.password
						})
						.then(data => {
							this.$message.success(`修改密码成功`);
							this.password = "";
							this.password2 = "";
						})
						.catch(err => {
							this.$message.error("操作失败，请检查网络或联系管理员");
							console.error(err);
						});
				} else {
					this.$message.error("两次输入密码不一致且不能为空");
				}
			}
		}
	};
</script>

<style lang="scss">
	.admin-page {
		.el-table {
			box-shadow: 0 0 10px gainsboro;
		}

		input {
			text-align: center;
		}
	}
</style>