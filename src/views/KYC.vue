<template>
  <div>
    <a-alert v-if="auditRemark" :message="auditRemark" type="error" />
    <a-alert
      v-if="detail && detail.status === 2"
      message="资料审核中"
      type="info"
    />
    <br />
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane
        key="1"
        tab="大陆个人"
        v-if="userStore.userInfo.kycType === 1"
      >
        <a-form
          layout="vertical"
          name="mainland-individuals-form"
          :rules="mainlandIndividualsRules"
          :model="mainlandIndividuals"
          @finish="onFinish"
        >
          <a-form-item label="姓名（法人）" name="certName">
            <a-input
              :disabled="post"
              v-model:value="mainlandIndividuals.certName"
              placeholder="请输入姓名（法人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="出生日期（法人）" name="certBirthday">
            <a-date-picker
              :disabled="post"
              style="width: 100%"
              v-model:value="mainlandIndividuals.certBirthday"
              placeholder="请选择出生日期（法人）"
            >
            </a-date-picker>
          </a-form-item>
          <a-form-item label="住址（法人）" name="certAddress">
            <a-input
              :disabled="post"
              v-model:value="mainlandIndividuals.certAddress"
              placeholder="请输入住址（法人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="证件号码（法人）" name="certNo">
            <a-input
              :disabled="post"
              v-model:value="mainlandIndividuals.certNo"
              placeholder="请输入证件号码（法人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="身份证国徽照（法人）" name="certImgFront">
            <UploadAndView
              v-model:post="post"
              v-model:value="mainlandIndividuals.certImgFront"
            ></UploadAndView>
          </a-form-item>
          <a-form-item label="身份证人像照（法人）" name="certImgBack">
            <UploadAndView
              v-model:post="post"
              v-model:value="mainlandIndividuals.certImgBack"
            ></UploadAndView>
          </a-form-item>
          <a-form-item label="手持证件照（法人）" name="certImgHand">
            <UploadAndView
              v-model:post="post"
              v-model:value="mainlandIndividuals.certImgHand"
            ></UploadAndView>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button 
                type="primary" 
                html-type="submit" 
                v-if="!post"
              >
                提交
              </a-button>
              <a-button
                type="primary"
                @click="handleUpdate()"
                v-if="post && detail.status !== 0"
                >
                变更资料
              </a-button>
              <a-button @click="cancelUpdate()" v-if="update">取消</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane
        key="2"
        tab="大陆企业"
        v-if="userStore.userInfo.kycType === 2"
      >
        <a-form
          layout="vertical"
          name="mainland-enterprises-form"
          :model="mainlandEnterprises"
          :rules="mainlandEnterprisesRules"
          @finish="onFinish"
        >
          <a-form-item label="姓名（法人）" name="certName">
            <a-input
              :disabled="post"
              v-model:value="mainlandEnterprises.certName"
              placeholder="请输入姓名（法人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="出生日期（法人）" name="certBirthday">
            <a-date-picker
              :disabled="post"
              style="width: 100%"
              v-model:value="mainlandEnterprises.certBirthday"
              placeholder="请选择出生日期（法人）"
            >
            </a-date-picker>
          </a-form-item>
          <a-form-item label="住址（法人）" name="certAddress">
            <a-input
              :disabled="post"
              v-model:value="mainlandEnterprises.certAddress"
              placeholder="请输入住址（法人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="证件号码（法人）" name="certNo">
            <a-input
              :disabled="post"
              v-model:value="mainlandEnterprises.certNo"
              placeholder="请输入证件号码（法人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="姓名（实控人）" name="holdingCertName">
            <a-input
              :disabled="post"
              v-model:value="mainlandEnterprises.holdingCertName"
              placeholder="请输入姓名（实控人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="证件号码（实控人）" name="holdingCertNo">
            <a-input
              :disabled="post"
              v-model:value="mainlandEnterprises.holdingCertNo"
              placeholder="请输入证件号码（实控人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="证件号码（营业执照）" name="enterpriseCertNo">
            <a-input
              :disabled="post"
              v-model:value="mainlandEnterprises.enterpriseCertNo"
              placeholder="请输入证件号码（营业执照）"
            >
            </a-input>
          </a-form-item>
          <a-form-item
            label="证件地址（营业执照）"
            name="enterpriseCertAddress"
          >
            <a-input
              :disabled="post"
              v-model:value="mainlandEnterprises.enterpriseCertAddress"
              placeholder="请输入证件地址（营业执照）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="身份证/护照正面照（法人）" name="certImgFront">
            <UploadAndView
              v-model:post="post"
              v-model:value="mainlandEnterprises.certImgFront"
            ></UploadAndView>
          </a-form-item>
          <a-form-item label="身份证/护照反面照（法人）" name="certImgBack">
            <UploadAndView
              v-model:post="post"
              v-model:value="mainlandEnterprises.certImgBack"
            ></UploadAndView>
          </a-form-item>
          <a-form-item label="手持身份证/护照（法人）" name="certImgHand">
            <UploadAndView
              v-model:post="post"
              v-model:value="mainlandEnterprises.certImgHand"
            ></UploadAndView>
          </a-form-item>
          <a-form-item
            label="身份证/护照正面照（实控人）"
            name="holdingCertImgBack"
          >
            <UploadAndView
              v-model:post="post"
              v-model:value="mainlandEnterprises.holdingCertImgBack"
            ></UploadAndView>
          </a-form-item>
          <a-form-item
            label="身份证/护照反面照（实控人）"
            name="holdingCertImgFront"
          >
            <UploadAndView
              v-model:post="post"
              v-model:value="mainlandEnterprises.holdingCertImgFront"
            ></UploadAndView>
          </a-form-item>
          <a-form-item label="证件照片（营业执照）" name="enterpriseCertImg">
            <UploadAndView
              v-model:post="post"
              v-model:value="mainlandEnterprises.enterpriseCertImg"
            ></UploadAndView>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" html-type="submit" v-if="!post">提交</a-button>
              <a-button
                type="primary"
                @click="handleUpdate()"
                v-if="post && detail.status !== 0"
                >变更资料
              </a-button>
              <a-button @click="cancelUpdate()" v-if="update">取消</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane
        key="3"
        tab="香港企业"
        v-if="userStore.userInfo.kycType === 3"
      >
        <a-form
          layout="vertical"
          name="hk-enterprises-form"
          :model="hkEnterprises"
          :rules="hkEnterprisesRules"
          @finish="onFinish"
        >
          <a-form-item label="姓名（实控人）" name="holdingCertName">
            <a-input
              :disabled="post"
              v-model:value="hkEnterprises.holdingCertName"
              placeholder="请输入姓名（实控人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="证件号码（实控人）" name="holdingCertNo">
            <a-input
              :disabled="post"
              v-model:value="hkEnterprises.holdingCertNo"
              placeholder="请输入证件号码（实控人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="证件号码（商业登记证）" name="enterpriseCertNo">
            <a-input
              :disabled="post"
              v-model:value="hkEnterprises.enterpriseCertNo"
              placeholder="请输入证件号码（商业登记证）"
            >
            </a-input>
          </a-form-item>
          <a-form-item
            label="证件地址（商业登记证）"
            name="enterpriseCertAddress"
          >
            <a-input
              :disabled="post"
              v-model:value="hkEnterprises.enterpriseCertAddress"
              placeholder="请输入证件地址（商业登记证）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="姓名（董事）" name="certName">
            <a-input
              :disabled="post"
              v-model:value="hkEnterprises.certName"
              placeholder="请输入姓名（董事）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="证件号码（董事）" name="certNo">
            <a-input
              :disabled="post"
              v-model:value="hkEnterprises.certNo"
              placeholder="请输入证件号码（董事）"
            >
            </a-input>
          </a-form-item>

          <a-form-item
            label="身份证/护照正面照（实控人）"
            name="holdingCertImgBack"
          >
            <UploadAndView
              v-model:post="post"
              v-model:value="hkEnterprises.holdingCertImgBack"
            ></UploadAndView>
          </a-form-item>
          <a-form-item
            label="身份证/护照反面照（实控人）"
            name="holdingCertImgFront"
          >
            <UploadAndView
              v-model:post="post"
              v-model:value="hkEnterprises.holdingCertImgFront"
            ></UploadAndView>
          </a-form-item>
          <a-form-item label="身份证/护照正面照（董事）" name="certImgFront">
            <UploadAndView
              v-model:post="post"
              v-model:value="hkEnterprises.certImgFront"
            ></UploadAndView>
          </a-form-item>
          <a-form-item label="身份证/护照反面照（董事）" name="certImgBack">
            <UploadAndView
              v-model:post="post"
              v-model:value="hkEnterprises.certImgBack"
            ></UploadAndView>
          </a-form-item>
          <a-form-item label="商业登记证照片" name="enterpriseCertImg">
            <UploadAndView
              v-model:post="post"
              v-model:value="hkEnterprises.enterpriseCertImg"
            ></UploadAndView>
          </a-form-item>
          <a-form-item label="公司注册证明书照片" name="enterpriseRegisterImg">
            <UploadAndView
              v-model:post="post"
              v-model:value="hkEnterprises.enterpriseRegisterImg"
            ></UploadAndView>
          </a-form-item>
          <a-form-item
            label="法团成立表格NNC1或周年申报表NAR1附件"
            name="nncImg"
          >
            <PdfUploadAndView
              v-model:post="post"
              v-model:value="hkEnterprises.nncImg"
            ></PdfUploadAndView>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" html-type="submit" v-if="!post">提交
              </a-button>
              <a-button
                type="primary"
                @click="handleUpdate()"
                v-if="post && detail.status !== 0"
                >
                变更资料
              </a-button>
              <a-button @click="handleUpdate()" v-if="update">取消</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script setup>
import { ref } from "vue";
import * as uploadApis from "../services/upload";
import * as kycApis from "../services/kyc";
import { useUserStore } from "../stores/user";
import { message } from "ant-design-vue";
import UploadAndView from "../components/UploadAndView.vue";
import PdfUploadAndView from "../components/PdfUploadAndView.vue";
import dayjs from "dayjs";

const userStore = useUserStore();
const activeKey = ref("1");
const post = ref(false);
const update = ref(false);

const handleUpdate = async () => {
  update.value = true;
  post.value = false;
};

const cancelUpdate = async () => {
  update.value = false;
  await get();
};

class MainlandIndividuals {
  constructor() {
    this.id = '';
    this.kycType = 1; //1
    this.certNo = ""; //证件号
    this.certName = ""; //证件名
    this.certAddress = ""; //证件地址
    this.certBirthday = null; //证件生日
    this.certImgFront = ""; //身份证国徽照   需要调用上传接口上传文件名
    this.certImgBack = ""; //身份证人像照   需要调用上传接口上传文件名
    this.certImgHand = ""; //手持证件照   需要调用上传接口上传文件名
  }
}

class MainlandEnterprises {
  constructor() {
    this.id = '';
    this.kycType = 2; //2
    this.certNo = ""; //法人证件号
    this.certName = ""; //法人证件名
    this.certAddress = ""; //法人证件地址
    this.certBirthday = null; //法人证件生日
    this.holdingCertNo = ""; //实控人证件号
    this.holdingCertName = ""; //实控人证件名
    this.enterpriseCertNo = ""; //营业执照证件号
    this.enterpriseCertAddress = ""; //营业执照地址
    this.certImgFront = ""; //身份证国徽照   需要调用上传接口上传文件名
    this.certImgBack = ""; //身份证人像照   需要调用上传接口上传文件名
    this.certImgHand = ""; //手持证件照   需要调用上传接口上传文件名
    this.enterpriseCertImg = ""; //营业执照证件照   需要调用上传接口上传文件名
    this.holdingCertImgFront = ""; //实控人证件正面照   需要调用上传接口上传文件名
    this.holdingCertImgBack = ""; //实控人证件反面照   需要调用上传接口上传文件名
  }
}

class HKEnterprises {
  constructor() {
    this.id = '';
    this.kycType = 3; //3
    this.certNo = ""; //董事证件号
    this.certName = ""; //董事证件名
    this.holdingCertNo = ""; //实控人证件号
    this.holdingCertName = ""; //实控人证件名
    this.enterpriseCertNo = ""; //商业登记证证件号
    this.enterpriseCertAddress = ""; //商业登记证地址
    this.certImgFront = ""; //董事证件正面照   需要调用上传接口上传文件名
    this.certImgBack = ""; //董事证件反面照   需要调用上传接口上传文件名
    this.enterpriseCertImg = ""; //商业登记证件照   需要调用上传接口上传文件名
    this.holdingCertImgFront = ""; //实控人证件正面照   需要调用上传接口上传文件名
    this.holdingCertImgBack = ""; //实控人证件反面照   需要调用上传接口上传文件名
    this.enterpriseRegisterImg = ""; //公司注册证明书   需要调用上传接口上传文件名
    this.nncImg = ""; //nnc或者nar照片   需要调用上传接口上传文件名
  }
}

const auditRemark = ref("");
const mainlandIndividuals = ref(new MainlandIndividuals());
const mainlandEnterprises = ref(new MainlandEnterprises());
const hkEnterprises = ref(new HKEnterprises());
const detail = ref({});

const mainlandIndividualsRules = {
  certNo: [
    {
      required: true,
      message: "请输入证件号码",
    },
  ],
  certName: [
    {
      required: true,
      message: "请输入证件名",
    },
  ],
  certAddress: [
    {
      required: true,
      message: "请输入证件地址",
    },
  ],
  certBirthday: [
    {
      required: true,
      message: "请选择证件生日",
    },
  ],
  certImgFront: [
    {
      required: true,
      message: "请上传身份证国徽照",
    },
  ],
  certImgBack: [
    {
      required: true,
      message: "请上传身份证人像照",
    },
  ],
  certImgHand: [
    {
      required: true,
      message: "请上传手持证件照",
    },
  ],
};
const mainlandEnterprisesRules = {
  certNo: [
    {
      required: true,
      message: "请输入法人证件号码",
    },
  ],
  certName: [
    {
      required: true,
      message: "请输入法人证件名",
    },
  ],
  certAddress: [
    {
      required: true,
      message: "请输入法人证件地址",
    },
  ],
  certBirthday: [
    {
      required: true,
      message: "请选择法人证件生日",
    },
  ],
  holdingCertNo: [
    {
      required: true,
      message: "请输入实控人证件号码",
    },
  ],
  holdingCertName: [
    {
      required: true,
      message: "请输入实控人证件名",
    },
  ],
  enterpriseCertNo: [
    {
      required: true,
      message: "请输入营业执照证件号码",
    },
  ],
  enterpriseCertAddress: [
    {
      required: true,
      message: "请输入营业执照地址",
    },
  ],
  certImgFront: [
    {
      required: true,
      message: "请上传法人身份证国徽照",
    },
  ],
  certImgBack: [
    {
      required: true,
      message: "请上传法人身份证人像照",
    },
  ],
  certImgHand: [
    {
      required: true,
      message: "请上传法人手持证件照",
    },
  ],
  enterpriseCertImg: [
    {
      required: true,
      message: "请上传营业执照证件照",
    },
  ],
  holdingCertImgFront: [
    {
      required: true,
      message: "请上传实控人身份证国徽照",
    },
  ],
  holdingCertImgBack: [
    {
      required: true,
      message: "请上传实控人身份证人像照",
    },
  ],
};
const hkEnterprisesRules = {
  certNo: [
    {
      required: true,
      message: "请输入董事证件号码",
    },
  ],
  certName: [
    {
      required: true,
      message: "请输入董事证件名",
    },
  ],
  holdingCertNo: [
    {
      required: true,
      message: "请输入实控人证件号码",
    },
  ],
  holdingCertName: [
    {
      required: true,
      message: "请输入实控人证件名",
    },
  ],
  enterpriseCertNo: [
    {
      required: true,
      message: "请输入商业登记证证件号码",
    },
  ],
  enterpriseCertAddress: [
    {
      required: true,
      message: "请输入商业登记证地址",
    },
  ],
  certImgFront: [
    {
      required: true,
      message: "请上传董事证件正面照",
    },
  ],
  certImgBack: [
    {
      required: true,
      message: "请上传董事证件反面照",
    },
  ],
  enterpriseCertImg: [
    {
      required: true,
      message: "请上传商业登记证件照",
    },
  ],
  holdingCertImgFront: [
    {
      required: true,
      message: "请上传实控人证件正面照",
    },
  ],
  holdingCertImgBack: [
    {
      required: true,
      message: "请上传实控人证件反面照",
    },
  ],
  enterpriseRegisterImg: [
    {
      required: true,
      message: "请上传公司注册证明书",
    },
  ],
  nncImg: [
    {
      required: true,
      message: "请上传nnc或者nar照片",
    },
  ],
};
const onFinish = async (values) => {
  let body = {};
  if (activeKey.value === "1") {
    body = {
      ...mainlandIndividuals.value,
      certBirthday: mainlandIndividuals.value.certBirthday.format("YYYY-MM-DD"),
    };
  } else if (activeKey.value === "2") {
    body = {
      ...mainlandEnterprises.value,
      certBirthday: mainlandEnterprises.value.certBirthday.format("YYYY-MM-DD"),
    };
  } else if (activeKey.value === "3") {
    body = {
      ...hkEnterprises.value,
    };
  }
  await kycApis.createOrder(body);
  update.value = false;
  message.success("已提交认证，待处理");
  get();
};

const get = async () => {
  const data = await kycApis.get();
  activeKey.value = userStore.userInfo.kycType.toString();
  if (data) {
    if (data.kycType === 1) {
      mainlandIndividuals.value = {
        id: data.id,
        kycType: 1,
        certNo: data.certNo,
        certName: data.certName,
        certAddress: data.certAddress,
        certBirthday: dayjs(data.certBirthday),
        certImgFront: data.certImgFront,
        certImgBack: data.certImgBack,
        certImgHand: data.certImgHand,
      };
    } else if (data.kycType === 2) {
      mainlandEnterprises.value = {
        id: data.id,
        kycType: data.kycType,
        certNo: data.certNo,
        certName: data.certName,
        certAddress: data.certAddress,
        certBirthday: dayjs(data.certBirthday),
        holdingCertNo: data.holdingCertNo,
        holdingCertName: data.holdingCertName,
        enterpriseCertNo: data.enterpriseCertNo,
        enterpriseCertAddress: data.enterpriseCertAddress,
        certImgFront: data.certImgFront,
        certImgBack: data.certImgBack,
        certImgHand: data.certImgHand,
        enterpriseCertImg: data.enterpriseCertImg,
        holdingCertImgFront: data.holdingCertImgFront,
        holdingCertImgBack: data.holdingCertImgBack,
      };
    } else if (data.kycType === 3) {
      hkEnterprises.value = {
        id: data.id,
        kycType: data.kycType,
        certNo: data.certNo,
        certName: data.certName,
        holdingCertNo: data.holdingCertNo,
        holdingCertName: data.holdingCertName,
        enterpriseCertNo: data.enterpriseCertNo,
        enterpriseCertAddress: data.enterpriseCertAddress,
        certImgFront: data.certImgFront,
        certImgBack: data.certImgBack,
        enterpriseCertImg: data.enterpriseCertImg,
        holdingCertImgFront: data.holdingCertImgFront,
        holdingCertImgBack: data.holdingCertImgBack,
        enterpriseRegisterImg: data.enterpriseRegisterImg,
        nncImg: data.nncImg,
      };
    }
    detail.value = data ? data : {};
    auditRemark.value === "";
    if (data.status === 1) {
      auditRemark.value = data.auditRemark;
    }
    post.value = true;
  }
};

get();
</script>
<style lang="less" scoped></style>
