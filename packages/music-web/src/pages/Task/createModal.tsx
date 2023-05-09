import { createTaskApi } from '@/apis/task';
import { ICreateTaskParams, TaskTypeEnum } from '@/apis/task/index.interface';
import { useUserStore } from '@/store/user';
import { Form, Input, InputNumber, Modal, Select, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { isEmpty } from 'lodash';

interface IProps {
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  title: string;
  okText: string;
  refresh: () => Promise<void>;
}

interface createFormVal extends ICreateTaskParams {
  songName?: string;
  artistName?: string;
  albumName?: string;
  playUrl?: string;
  lyric?: string;
}

export const getTaskTypeEnumText = (type: TaskTypeEnum) => {
  switch (type) {
    case TaskTypeEnum.LRC:
      return 'LRC';
    case TaskTypeEnum.KRC:
      return 'KRC';
    case TaskTypeEnum.ARTIST_INFO:
      return '艺人信息';
    default:
      return 'LRC';
  }
};

const CreateModal: React.FC<IProps> = ({
  isOpen,
  onOk,
  onCancel,
  title,
  okText,
  refresh
}) => {
  const [form] = useForm<createFormVal>();
  const typeValue = Form.useWatch('type', form);
  const user = useUserStore((state) => state.user);

  const handleSubmit = async () => {
    const formVal = form.getFieldsValue();
    const { songName, artistName, albumName, playUrl, lyric, ...basicInfo } =
      formVal;

    try {
      const task = await createTaskApi({
        ...basicInfo,
        creatorId: user.id,
        extra:
          basicInfo.type === TaskTypeEnum.LRC
            ? JSON.stringify({
                songName,
                artistName,
                albumName,
                playUrl,
                lyric
              })
            : undefined
      });
      if (!isEmpty(task)) {
        message.success('创建成功');
        form.resetFields();
        await refresh();
      } else {
        message.success('创建失败');
      }
    } catch (e) {
      message.success('创建失败');
    }

    onOk();
  };

  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={okText}
    >
      <Form form={form}>
        <Form.Item
          label="任务名称"
          name="name"
          rules={[
            {
              required: true,
              message: `请输入任务名称`
            }
          ]}
        >
          <Input placeholder="请输入任务名称" />
        </Form.Item>
        <Form.Item
          label="任务类型"
          name="type"
          rules={[
            {
              required: true,
              message: `请选择任务类型`
            }
          ]}
          initialValue={TaskTypeEnum.LRC}
        >
          <Select>
            {[TaskTypeEnum.LRC, TaskTypeEnum.KRC, TaskTypeEnum.ARTIST_INFO].map(
              (val, index) => (
                <Select.Option value={val} key={index}>
                  {getTaskTypeEnumText(val)}
                </Select.Option>
              )
            )}
          </Select>
        </Form.Item>
        {typeValue === TaskTypeEnum.LRC && (
          <>
            <Form.Item
              label="歌曲名"
              name="songName"
              rules={[
                {
                  required: true,
                  message: `请输入歌曲名`
                }
              ]}
            >
              <Input placeholder="请输入歌曲名" />
            </Form.Item>
            <Form.Item
              label="专辑名"
              name="albumName"
              rules={[
                {
                  required: true,
                  message: `请输入专辑名`
                }
              ]}
            >
              <Input placeholder="请输入专辑名" />
            </Form.Item>
            <Form.Item label="歌曲内容" name="lyric">
              <TextArea rows={4} placeholder="请输入歌词内容" />
            </Form.Item>
            <Form.Item
              label="艺人名"
              name="artistName"
              rules={[
                {
                  required: true,
                  message: `请输入艺人名`
                }
              ]}
            >
              <Input placeholder="请输入艺人名" />
            </Form.Item>
            <Form.Item
              label="播放链接"
              name="playUrl"
              rules={[
                {
                  required: true,
                  message: `请输入播放链接`
                }
              ]}
            >
              <Input placeholder="请输入播放链接" />
            </Form.Item>
          </>
        )}
        <Form.Item
          label="任务限时"
          name="timeLimit"
          rules={[
            {
              required: true,
              message: `请输入任务限时`
            }
          ]}
        >
          <InputNumber addonAfter="天" placeholder="请输入任务限时" />
        </Form.Item>
        <Form.Item
          label="任务酬劳"
          name="reward"
          rules={[
            {
              required: true,
              message: `请输入任务酬劳`
            }
          ]}
        >
          <InputNumber addonAfter="元" placeholder="请输入任务酬劳" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateModal;
