import { IUpdate } from '@/apis/user/index.interface';
import { updateUserInfoApi } from '@/apis/user/user';
import { RoleEnum, RoleEnumTextMap, useUserStore } from '@/store/user';
import { Form, Input, Modal, Image, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { assign, isEmpty, isEqual, keys, omit, pick } from 'lodash';
import { useTranslation } from 'react-i18next';

interface IProps {
  visible: boolean;
  onCancel?: () => void;
}

export interface IFormVal {
  id: string;
  nickname: string;
  role: RoleEnum;
  email: string;
  avatar: string;
}

const EditUserModal: React.FC<IProps> = ({ visible, onCancel }) => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { t } = useTranslation();
  const [form] = useForm<IFormVal>();

  const handleSubmit = async () => {
    const formVal = form.getFieldsValue();
    formVal.id = user.id;
    const realUpdateVal = omit(formVal, ['id', 'role', 'avatar']);

    const pickKeys: string[] = [];
    keys(realUpdateVal).forEach((key) => {
      if (
        !isEqual(user[key as keyof IFormVal], formVal[key as keyof IFormVal])
      ) {
        pickKeys.push(key);
      }
    });

    if (isEmpty(pickKeys)) {
      message.warning(t('NOT_UPDATE'));
      onCancel?.();
      return;
    }
    await updateUserInfoApi(pick(formVal, [...pickKeys, 'id']) as IUpdate);
    message.success(t('UPDATE_SUCCESS'));
    setUser(assign(user, realUpdateVal));
    onCancel?.();
  };

  return (
    <Modal
      open={visible}
      centered={true}
      className="p-3"
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
      title={t('USER_INFO_EDIT')}
      okText={t('SUBMIT')}
      cancelText={t('CANCEL')}
    >
      <Form form={form}>
        <Form.Item
          label={t('NICKNAME')}
          name="nickname"
          initialValue={user.nickname}
        >
          <Input />
        </Form.Item>

        <Form.Item label={t('EMAIL')} name="email" initialValue={user.email}>
          <Input />
        </Form.Item>

        <Form.Item label={t('AVATAR')} name="avatar">
          <Image src={user.avatar} alt="avatar" width={30} />
        </Form.Item>

        <Form.Item label={t('ROLE')} name="role">
          <span>{RoleEnumTextMap(user.role)}</span>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
