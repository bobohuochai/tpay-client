<template>
  <div class="page page-batch-operate">
    <a-card :style="{ marginBottom: '1em' }">
      <a-row justify="space-between">
        <a-col :span="12">
          <h2>批量操作</h2>
          <a-form
            name="batch-operate-form"
            layout="horizontal"
            :labelCol="{
              span: 4,
            }"
            :model="formState"
            @finish="onFinish"
          >
            <a-form-item
              label="操作类型"
              name="useFlag"
              :rules="[{ required: true, message: '请选择类型' }]"
            >
              <a-select
                :options="useFlagOptions"
                v-model:value="formState.useFlag"
                placeholder="请选择类型"
              >
              </a-select>
            </a-form-item>
            <a-form-item
              label="上传文件"
              name="fileList"
              :rules="[{ required: true, message: '请选择文件' }]"
            >
              <a-upload
                v-model:file-list="formState.fileList"
                :maxCount="1"
                :customRequest="uploadFile"
              >
                <a-button>
                  <upload-outlined></upload-outlined>
                  选择文件
                </a-button>
              </a-upload>
            </a-form-item>
            <a-form-item label="备注" name="remark">
              <a-textarea
                v-model:value="formState.remark"
                placeholder="请输入备注"
              >
              </a-textarea>
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 4 }">
              <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :span="10">
          <p>下载模板:</p>
          <a-space
            direction="vertical"
            size="middle"
            :style="{ marginLeft: '1em' }"
          >
            <a
              href="https://vcc-static.oss-cn-hangzhou.aliyuncs.com/批量充值.xlsx"
              >批量充值模板</a
            >
            <a
              href="https://vcc-static.oss-cn-hangzhou.aliyuncs.com/批量转出.xlsx"
              >批量转出模板</a
            >
            <a
              href="https://vcc-static.oss-cn-hangzhou.aliyuncs.com/批量冻结.xlsx"
              >批量冻结模板</a
            >
            <a
              href="https://vcc-static.oss-cn-hangzhou.aliyuncs.com/批量解冻.xlsx"
              >批量解冻模板</a
            >
            <!-- <a
              href="https://vcc-static.oss-cn-hangzhou.aliyuncs.com/批量销卡.xlsx"
              >批量销卡模板</a
            > -->
          </a-space>
        </a-col>
      </a-row>
    </a-card>
    <h4>未完结批处理</h4>
    <a-table
      bordered
      :columns="columns"
      :data-source="listAllRes.records"
      :loading="loading"
      :pagination="false"
    >
    </a-table>
  </div>
</template>
<script setup>
import { UploadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { onMounted, reactive, ref } from "vue";
import * as taskLogApis from "../services/task-log";

const useFlagOptions = reactive([
  // 0 充值 1 转出 2 冻结 3 解冻 4 销卡
  {
    label: "充值",
    value: 0,
  },
  {
    label: "转出",
    value: 1,
  },
  {
    label: "冻结",
    value: 2,
  },
  {
    label: "解冻",
    value: 3,
  },
  // {
  //   label: "销卡",
  //   value: 4,
  // },
]);
const formState = reactive({
  useFlag: null,
  remark: null,
  fileList: [],
});
const loading = ref(false)
const uploadFile = async ({ file, onSuccess, onError }) => {
  console.log(22, file);
  await Promise.resolve();
  onSuccess();
  return;
  // const formData = new FormData();

  // formData.append('file', file);
  // try {
  //   const res = await uploadApis.upload(formData)
  //   onSuccess(res, file)
  // } catch (error) {
  //   onError(error)
  // }
};

const onFinish = async (values) => {
  const params = {
    ...formState,
  };
  const formData = new FormData();

  console.log(3333, formState.fileList[0]);
  formData.append("file", formState.fileList[0].originFileObj);
  // params.file = params.fileList[0]?.response
  delete params.fileList;
  await taskLogApis.batch(formData, { params });
  message.success("已提交申请，待处理");
  fetchLogs();
};

let listAllRes = ref({});

const columns = reactive([
  {
    title: "提交时间",
    dataIndex: "requestDate",
  },
  {
    title: "操作类型",
    dataIndex: "useFlag",
    customRender({ text }) {
      if (text === 0) {
        return "充值";
      }
      if (text === 1) {
        return "转出";
      }
      if (text === 2) {
        return "冻结";
      }
      if (text === 3) {
        return "解冻";
      }
      if (text === 4) {
        return "销卡";
      }
    },
  },
  {
    title: "备注",
    dataIndex: "remark",
  },
  {
    title: "记录数",
    dataIndex: "count",
  },
  {
    title: "状态",
    dataIndex: "status",
    customRender({ text, record }) {
      let str = "未知";
      if (text === 0) {
        str = "成功";
      }
      if (text === 1) {
        str = "失败";
      }
      if (text === 2) {
        str = "等待中";
      }
      return str;
    },
  },
  {
    title: "完成时间",
    dataIndex: "completionDate",
  },
]);

const fetchLogs = async () => {
  loading.value = true
  const res = await taskLogApis.listAll({});
  loading.value = false
  listAllRes.value = res;
};

onMounted(fetchLogs);
</script>
<style lang="less" scoped></style>
