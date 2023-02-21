import React, { useState } from 'react';
import { Button, Form, Input, message, Modal, Upload } from 'antd';
import { useTranslation } from 'react-i18next';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { loginApi, registerApi } from '@/apis/User/user';
import _ from 'lodash';
import { useRequest } from 'ahooks';
import { MUSIC_TOKEN } from '@/constants';

enum FormStatus {
  LOGIN = 1,
  REGISTER = 2
}

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.LOGIN);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const { loading: submitting, runAsync: submit } = useRequest(
    async (params: any) => {
      const api = formStatus === FormStatus.LOGIN ? loginApi : registerApi;
      const { data } = await api(params);
      return data;
    },
    {
      manual: true
    }
  );

  const onFinish = async (values: any) => {
    let val = values;
    if (formStatus === FormStatus.REGISTER) {
      val = _.omit(val, ['confirmPassword']);
    }
    const data = await submit(val);
    localStorage.setItem(MUSIC_TOKEN, data.token);

    message.success('Log in successfully');
    setIsOpen(false);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Modal
        open={isOpen}
        closable={false}
        footer={null}
        centered={true}
        className="p-3"
      >
        <div className="flex justify-center p-3">
          <span className="font-mono text-lg text-gray-800">
            {formStatus === FormStatus.LOGIN ? t('LOGIN') : t('REGISTER')}
          </span>
        </div>
        <Form name="basic" onFinish={onFinish} autoComplete="off">
          {formStatus === FormStatus.REGISTER && (
            <Form.Item
              label={t('NICKNAME')}
              name="nickname"
              rules={[
                {
                  required: true,
                  message: `${t('PLEASE_INPUT_YOUR')}${t('NICKNAME')}`
                },
                {
                  min: 1,
                  max: 50
                }
              ]}
            >
              <Input />
            </Form.Item>
          )}
          {formStatus === FormStatus.REGISTER && (
            <Form.Item
              name="avatar"
              label={t('AVATAR')}
              valuePropName="fileList"
              extra="请上传头像"
            >
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                // beforeUpload={beforeUpload}
                // onChange={handleChange}
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          )}
          <Form.Item
            label={t('EMAIL')}
            name="email"
            rules={[
              {
                required: true,
                message: `${t('PLEASE_INPUT_YOUR')}${t('EMAIL')}`
              },
              { type: 'email' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t('PASSWORD')}
            name="password"
            rules={[
              {
                required: true,
                message: `${t('PLEASE_INPUT_YOUR')}${t('PASSWORD')}`
              },
              {
                min: 8,
                max: 16
              }
            ]}
          >
            <Input.Password />
          </Form.Item>
          {formStatus === FormStatus.REGISTER && (
            <Form.Item
              label={t('CONFIRM_PASSWORD')}
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: `${t('PLEASE_INPUT_YOUR')}${t('CONFIRM_PASSWORD')}`
                },
                {
                  min: 8,
                  max: 16
                }
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              loading={submitting}
            >
              {formStatus === FormStatus.LOGIN ? t('LOGIN') : t('REGISTER')}
            </Button>
            Or
            <span
              className="text-green-600 hover:text-green-700 cursor-pointer"
              onClick={() => {
                setFormStatus(
                  formStatus === FormStatus.REGISTER
                    ? FormStatus.LOGIN
                    : FormStatus.REGISTER
                );
              }}
            >
              {formStatus === FormStatus.REGISTER ? t('LOGIN') : t('REGISTER')}
            </span>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Login;
