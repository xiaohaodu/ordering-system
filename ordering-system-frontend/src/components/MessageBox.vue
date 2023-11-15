<template>
  <img
    class="add-dish"
    @click="dialogFormVisible = true"
    src="@/assets/Add.svg"
    alt="addDish"
  />
  <el-dialog center v-model="dialogFormVisible" title="添加菜单">
    <el-form :model="dish">
      <el-form-item label="分类" :label-width="formLabelWidth">
        <el-input v-model="dish.type" autocomplete="off" />
      </el-form-item>
      <el-form-item label="菜名" :label-width="formLabelWidth">
        <el-input v-model="dish.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="价格" :label-width="formLabelWidth">
        <el-input type="number" v-model="dish.price" autocomplete="off" />
      </el-form-item>
      <el-form-item label="展示图片" :label-width="formLabelWidth">
        <el-upload
          action="#"
          v-model:file-list="picture"
          :limit="1"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          list-type="picture-card"
          :auto-upload="false"
        >
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addDish(dish)"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, defineEmits, inject } from "vue";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps, UploadUserFile } from "element-plus";
import { addMenu } from "@/network/menu/menu";

let dialogFormVisible = ref(false);
const formLabelWidth = "12vw";
const dish = reactive({
  type: "",
  name: "",
  price: "",
  picture: "",
});
const picture = ref<UploadUserFile[]>([]);

const emit = defineEmits(["getMenu"]);
const loading = inject("loading") as any;
const elMessage = inject("elMessage") as any;
//添加菜单项
async function addDish(dish) {
  loading();
  dialogFormVisible.value = false;
  try {
    if (picture.value.length > 0) {
      // 第一步：先读取文件
      const base = new FileReader();
      // console.dir(base)
      // 第二步：将需要转化的图片放进去
      base.readAsDataURL(picture.value[0].raw!);
      // 第三步：获取结果， 因为文件加载需要时间，因此是个异步的过程，需要使用onload去获取读取的结果，读取转化后的结果放在了result属性里了
      base.onload = async () => {
        const base64 = base.result;
        dish.picture = base64;
        const { data: res } = await addMenu(dish, localStorage.user_id);
        emit("getMenu");
        elMessage(res.message, res.status == 0 ? "success" : "error");
      };
    } else {
      elMessage("请传入完整信息！");
    }
  } catch (error) {
    elMessage(error);
  }
  loading().close();
}

//上传图片
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
</script>
<style scoped>
.el-input {
  width: 26vw;
}

.add-dish {
  margin: 3vh;
  height: 23vh;
  width: 23vh;
  cursor: pointer;
}
</style>
