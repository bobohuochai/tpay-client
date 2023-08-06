<template>
  <a-modal v-model:visible="visible" title="认证信息" @ok="onFinish">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="大陆个人">
        <a-form
          ref="mainlandIndividualsRef"
          layout="vertical"
          name="mainland-individuals-form"
          :model="mainlandIndividuals"
          :rules="mainlandIndividualsRules"
        >
          <a-form-item label="姓名（法人）" name="certName">
            <a-input
              v-model:value="mainlandIndividuals.certName"
              placeholder="请输入姓名（法人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="出生日期（法人）" name="certBirthday">
            <a-input
              v-model:value="mainlandIndividuals.certBirthday"
              placeholder="请选择出生日期（法人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="住址（法人）" name="certAddress">
            <a-input
              v-model:value="mainlandIndividuals.certAddress"
              placeholder="请输入住址（法人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="证件号码（法人）" name="certNo">
            <a-input
              v-model:value="mainlandIndividuals.certNo"
              placeholder="请输入证件号码（法人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="身份证正面照（法人）" name="certImgFront">
            <a-upload
              v-model:file-list="mainlandIndividuals.certImgFront"
              name="certImgFront"
              accept="image/png, image/jpeg, image/jpg"
              :maxCount="1"
              :customRequest="uploadFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item label="身份证反面照（法人）" name="certImgBack">
            <a-upload
              v-model:file-list="mainlandIndividuals.certImgBack"
              name="certImgBack"
              accept="image/png, image/jpeg, image/jpg"
              :maxCount="1"
              :customRequest="uploadFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item label="手持证件照（法人）" name="certImgHand">
            <a-upload
              v-model:file-list="mainlandIndividuals.certImgHand"
              name="certImgHand"
              accept="image/png, image/jpeg, image/jpg"
              :maxCount="1"
              :customRequest="uploadFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2" tab="大陆企业">
        <a-form
          ref="mainlandEnterprisesRef"
          layout="vertical"
          name="mainland-enterprises-form"
          :model="mainlandEnterprises"
          :rules="mainlandEnterprisesRules"
        >
          <a-form-item label="姓名（法人）" name="certName">
            <a-input
              v-model:value="mainlandEnterprises.certName"
              placeholder="请输入姓名（法人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="出生日期（法人）" name="certBirthday">
            <a-input
              v-model:value="mainlandEnterprises.certBirthday"
              placeholder="请选择出生日期（法人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="住址（法人）" name="certAddress">
            <a-input
              v-model:value="mainlandEnterprises.certAddress"
              placeholder="请输入住址（法人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="证件号码（法人）" name="certNo">
            <a-input
              v-model:value="mainlandEnterprises.certNo"
              placeholder="请输入证件号码（法人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="姓名（实控人）" name="holdingCertName">
            <a-input
              v-model:value="mainlandEnterprises.holdingCertName"
              placeholder="请输入姓名（实控人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="证件号码（实控人）" name="holdingCertNo">
            <a-input
              v-model:value="mainlandEnterprises.holdingCertNo"
              placeholder="请输入证件号码（实控人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="证件号码（营业执照）" name="enterpriseCertNo">
            <a-input
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
              v-model:value="mainlandEnterprises.enterpriseCertAddress"
              placeholder="请输入证件地址（营业执照）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="身份证/护照正面照（法人）" name="certImgFront">
            <a-upload
              v-model:file-list="mainlandEnterprises.certImgFront"
              name="certImgFront"
              accept="image/png, image/jpeg, image/jpg"
              :maxCount="1"
              :customRequest="uploadFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item label="身份证/护照反面照（法人）" name="certImgBack">
            <a-upload
              v-model:file-list="mainlandEnterprises.certImgBack"
              name="certImgBack"
              accept="image/png, image/jpeg, image/jpg"
              :maxCount="1"
              :customRequest="uploadFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item label="手持身份证/护照（法人）" name="certImgHand">
            <a-upload
              v-model:file-list="mainlandEnterprises.certImgHand"
              name="certImgHand"
              accept="image/png, image/jpeg, image/jpg"
              :maxCount="1"
              :customRequest="uploadFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item
            label="身份证/护照正面照（实控人）"
            name="enterpriseCertImg"
          >
            <a-upload
              v-model:file-list="mainlandEnterprises.enterpriseCertImg"
              name="enterpriseCertImg"
              accept="image/png, image/jpeg, image/jpg"
              :maxCount="1"
              :customRequest="uploadFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item
            label="身份证/护照反面照（实控人）"
            name="holdingCertImgFront"
          >
            <a-upload
              v-model:file-list="mainlandEnterprises.holdingCertImgFront"
              name="holdingCertImgFront"
              accept="image/png, image/jpeg, image/jpg"
              :maxCount="1"
              :customRequest="uploadFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item label="证件照片（营业执照）" name="holdingCertImgBack">
            <a-upload
              v-model:file-list="mainlandEnterprises.holdingCertImgBack"
              name="holdingCertImgBack"
              accept="image/png, image/jpeg, image/jpg"
              :maxCount="1"
              :customRequest="uploadFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="3" tab="香港企业">
        <a-form
          ref="hkEnterprisesRef"
          layout="vertical"
          name="hk-enterprises-form"
          :model="hkEnterprises"
          :rules="hkEnterprisesRules"
        >
          <a-form-item label="姓名（实控人）" name="holdingCertName">
            <a-input
              v-model:value="hkEnterprises.holdingCertName"
              placeholder="请输入姓名（实控人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="证件号码（实控人）" name="holdingCertNo">
            <a-input
              v-model:value="hkEnterprises.holdingCertNo"
              placeholder="请输入证件号码（实控人）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="证件号码（商业登记证）" name="enterpriseCertNo">
            <a-input
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
              v-model:value="hkEnterprises.enterpriseCertAddress"
              placeholder="请输入证件地址（商业登记证）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="姓名（董事）" name="certName">
            <a-input
              v-model:value="hkEnterprises.certName"
              placeholder="请输入姓名（董事）"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="证件号码（董事）" name="certNo">
            <a-input
              v-model:value="hkEnterprises.certNo"
              placeholder="请输入证件号码（董事）"
            >
            </a-input>
          </a-form-item>

          <a-form-item
            label="身份证/护照正面照（实控人）"
            name="enterpriseCertImg"
          >
            <a-upload
              v-model:file-list="hkEnterprises.enterpriseCertImg"
              name="enterpriseCertImg"
              accept="image/png, image/jpeg, image/jpg"
              :maxCount="1"
              :customRequest="uploadFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item
            label="身份证/护照反面照（实控人）"
            name="holdingCertImgFront"
          >
            <a-upload
              v-model:file-list="hkEnterprises.holdingCertImgFront"
              name="holdingCertImgFront"
              accept="image/png, image/jpeg, image/jpg"
              :maxCount="1"
              :customRequest="uploadFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item label="身份证/护照正面照（董事）" name="certImgFront">
            <a-upload
              v-model:file-list="hkEnterprises.certImgFront"
              name="certImgFront"
              accept="image/png, image/jpeg, image/jpg"
              :maxCount="1"
              :customRequest="uploadFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item label="身份证/护照反面照（董事）" name="certImgBack">
            <a-upload
              v-model:file-list="hkEnterprises.certImgBack"
              name="certImgBack"
              accept="image/png, image/jpeg, image/jpg"
              :maxCount="1"
              :customRequest="uploadFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item label="商业登记证照片" name="enterpriseCertImg">
            <a-upload
              v-model:file-list="hkEnterprises.enterpriseCertImg"
              name="enterpriseCertImg"
              accept="image/png, image/jpeg, image/jpg"
              :maxCount="1"
              :customRequest="uploadFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item label="公司注册证明书照片" name="enterpriseRegisterImg">
            <a-upload
              v-model:file-list="hkEnterprises.enterpriseRegisterImg"
              name="enterpriseRegisterImg"
              accept="image/png, image/jpeg, image/jpg"
              :maxCount="1"
              :customRequest="uploadFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item
            label="法团成立表格NNC1或周年申报表NAR1照片"
            name="nncImg"
          >
            <a-upload
              v-model:file-list="hkEnterprises.nncImg"
              name="nncImg"
              accept="image/png, image/jpeg, image/jpg"
              :maxCount="1"
              :customRequest="uploadFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>
<script setup>
import { ref } from "vue";
import * as uploadApis from "../services/upload";
import * as kycApis from "../services/kyc";

const activeKey = ref("1");
const visible = ref(false);
class MainlandIndividuals {
  constructor() {
    this.kycType = 1; //1
    this.certNo = ""; //证件号
    this.certName = ""; //证件名
    this.certAddress = ""; //证件地址
    this.certBirthday = ""; //证件生日
    this.certImgFront = []; //身份证正面照   需要调用上传接口上传文件名
    this.certImgBack = []; //身份证反面照   需要调用上传接口上传文件名
    this.certImgHand = []; //手持证件照   需要调用上传接口上传文件名
  }
}
class MainlandEnterprises {
  constructor() {
    this.kycType = 2; //2
    this.certNo = ""; //法人证件号
    this.certName = ""; //法人证件名
    this.certAddress = ""; //法人证件地址
    this.certBirthday = ""; //法人证件生日
    this.holdingCertNo = ""; //实控人证件号
    this.holdingCertName = ""; //实控人证件名
    this.enterpriseCertNo = ""; //营业执照证件号
    this.enterpriseCertAddress = ""; //营业执照地址
    this.certImgFront = []; //身份证正面照   需要调用上传接口上传文件名
    this.certImgBack = []; //身份证反面照   需要调用上传接口上传文件名
    this.certImgHand = []; //手持证件照   需要调用上传接口上传文件名
    this.enterpriseCertImg = []; //营业执照证件照   需要调用上传接口上传文件名
    this.holdingCertImgFront = []; //实控人证件正面照   需要调用上传接口上传文件名
    this.holdingCertImgBack = []; //实控人证件反面照   需要调用上传接口上传文件名
  }
}

class HKEnterprises {
  constructor() {
    this.kycType = 3; //3
    this.certNo = ""; //董事证件号
    this.certName = ""; //董事证件名
    this.holdingCertNo = ""; //实控人证件号
    this.holdingCertName = ""; //实控人证件名
    this.enterpriseCertNo = ""; //商业登记证证件号
    this.enterpriseCertAddress = ""; //商业登记证地址
    this.certImgFront = []; //董事证件正面照   需要调用上传接口上传文件名
    this.certImgBack = []; //董事证件反面照   需要调用上传接口上传文件名
    this.enterpriseCertImg = []; //商业登记证件照   需要调用上传接口上传文件名
    this.holdingCertImgFront = []; //实控人证件正面照   需要调用上传接口上传文件名
    this.holdingCertImgBack = []; //实控人证件反面照   需要调用上传接口上传文件名
    this.enterpriseRegisterImg = []; //公司注册证明书   需要调用上传接口上传文件名
    this.nncImg = []; //nnc或者nar照片   需要调用上传接口上传文件名
  }
}

const mainlandIndividuals = ref(new MainlandIndividuals());
const mainlandEnterprises = ref(new MainlandEnterprises());
const hkEnterprises = ref(new HKEnterprises());

const mainlandIndividualsRef = ref();
const mainlandEnterprisesRef = ref();
const hkEnterprisesRef = ref();

const uploadFile = async ({ file, onSuccess, onError }) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await uploadApis.upload(formData);
    onSuccess(res);
  } catch (error) {
    onError(error);
  }
};

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
      message: "请上传身份证正面照",
    },
  ],
  certImgBack: [
    {
      required: true,
      message: "请上传身份证反面照",
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
      message: "请上传法人身份证正面照",
    },
  ],
  certImgBack: [
    {
      required: true,
      message: "请上传法人身份证反面照",
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
      message: "请上传实控人身份证正面照",
    },
  ],
  holdingCertImgBack: [
    {
      required: true,
      message: "请上传实控人身份证反面照",
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
      certImgFront: mainlandIndividuals.value.certImgFront[0].name,
      certImgBack: mainlandIndividuals.value.certImgBack[0].name,
      certImgHand: mainlandIndividuals.value.certImgHand[0].name,
    };
  } else if (activeKey.value === "2") {
    body = {
      ...mainlandEnterprises.value,
      certImgFront: mainlandEnterprises.value.certImgFront[0].name,
      certImgBack: mainlandEnterprises.value.certImgBack[0].name,
      certImgHand: mainlandEnterprises.value.certImgHand[0].name,
      enterpriseCertImg: mainlandEnterprises.value.enterpriseCertImg[0].name,
      holdingCertImgFront:
        mainlandEnterprises.value.holdingCertImgFront[0].name,
      holdingCertImgBack: mainlandEnterprises.value.holdingCertImgBack[0].name,
    };
  } else if (activeKey.value === "3") {
    body = {
      ...hkEnterprises.value,
      certImgFront: hkEnterprises.value.certImgFront[0].name,
      certImgBack: hkEnterprises.value.certImgBack[0].name,
      enterpriseCertImg: hkEnterprises.value.enterpriseCertImg[0].name,
      holdingCertImgFront: hkEnterprises.value.holdingCertImgFront[0].name,
      holdingCertImgBack: hkEnterprises.value.holdingCertImgBack[0].name,
      enterpriseRegisterImg: hkEnterprises.value.enterpriseRegisterImg[0].name,
      nncImg: hkEnterprises.value.nncImg[0].name,
    };
  }
  await kycApis.createOrder(values);
  message.success("已提交认证，待处理");
};

defineExpose({
  show() {
    hkEnterprisesRef.value?.clearValidate();
    hkEnterprisesRef.value?.clearValidate();
    hkEnterprisesRef.value?.clearValidate();
    visible.value = true;
  },
});
</script>
