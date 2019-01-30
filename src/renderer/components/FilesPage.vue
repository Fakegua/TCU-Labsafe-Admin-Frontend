<template>
	<div class="manage-files-page">
		<el-table :data="tableData" stripe border max-height="300" style="width: 100%">
			<el-table-column align="center" prop="addtime" label="添加日期"></el-table-column>
			<el-table-column align="center" prop="fileName" label="文件名"></el-table-column>
			<el-table-column align="center" prop="fileCategory" label="文件类型"></el-table-column>
			<el-table-column align="center" label="操作">
				<template slot-scope="scope">
					<el-button @click="deleteFile(scope.row)" type="warning" plain round size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<br>
		<div style="text-align:center">
			<!-- <el-button style="width:80%" type="primary" @click="addFile" plain icon="el-icon-upload">上传文件</el-button> -->
			<el-upload
				drag
				:action="uploadURL"
				:show-file-list="false"
				:on-success="uploadSuccess"
				:on-error="uploadError"
				:on-progress="uploadProgress"
			>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">
					将文件拖到此处，或
					<em>点击上传</em>
				</div>
				<div class="el-upload__tip" slot="tip">文件大小不能超过50MB</div>
			</el-upload>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				uploadURL:this.$domain + "/files/"
			};
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.tableData = [];
				this.$http
					.get(this.$domain + "/files/")
					.then(data => {
						this.files = data.data;
						this.files.forEach(e => {
							e.addtime = this.$utils.formatTime(e.addtime);
							this.tableData.push(e);
						});
					})
					.catch(err => {
						this.$message.error("操作失败，请检查网络或联系管理员");
						console.error(err);
					});
			},
			deleteFile(data) {
				this.$http
					.delete(this.$domain + `/files/?id=${data.id}`)
					.then(result => {
						this.$message.success("删除成功");
						this.init();
					})
					.catch(err => {
						this.$message.error("操作失败，请检查网络或联系管理员");
						console.error(err);
					});
			},
			uploadSuccess(){
				this.$message.success("上传成功");
				this.init();
			},
			uploadError(err){
				this.$message.error("操作失败，请检查网络或联系管理员");
			},
			uploadProgress(err){
				this.$message.info("正在上传...");
			},

		}
	};
</script>

<style lang="scss">
	.manage-files-page {
		.el-table {
			box-shadow: 0 0 10px gainsboro;
		}
	}
</style>