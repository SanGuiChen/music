import { ITask, TaskStatusEnum } from '@/apis/task/index.interface';
import {
  Button,
  Card,
  Descriptions,
  Space,
  Tag,
  Tooltip,
  Typography,
  message
} from 'antd';
import { getTaskTypeEnumText } from './createModal';
import { formatDate } from '@/utils';
import { claimTaskApi, deleteTaskApi } from '@/apis/task';
import { useUserStore } from '@/store/user';
import { isEmpty } from 'lodash';
import { DeleteOutlined } from '@ant-design/icons';

interface IProps {
  cards: ITask[];
  loading: boolean;
  refresh: () => Promise<void>;
}

export const getTaskStatusEnumText = (status: TaskStatusEnum) => {
  switch (status) {
    case TaskStatusEnum.NOT_START:
      return '待领取';
    case TaskStatusEnum.PENDING:
      return '进行中';
    case TaskStatusEnum.CHECK_PENDING:
      return '待审核';
    case TaskStatusEnum.CHECK_REJECT:
      return '审核驳回';
    case TaskStatusEnum.FINISHED:
      return '已完成';
    default:
      return '未知状态';
  }
};

const getTaskStatusEnumColor = (status: TaskStatusEnum) => {
  switch (status) {
    case TaskStatusEnum.NOT_START:
      return 'green';
    case TaskStatusEnum.PENDING:
      return 'cyan';
    case TaskStatusEnum.CHECK_PENDING:
      return 'blue';
    case TaskStatusEnum.CHECK_REJECT:
      return 'red';
    case TaskStatusEnum.FINISHED:
      return 'purple';
    default:
      return 'volcano';
  }
};

// Todo: 权限区分
const { Text } = Typography;

const TaskPool: React.FC<IProps> = ({ cards, loading, refresh }) => {
  const user = useUserStore((state) => state.user);

  const handleClaimTask = async (taskId: string) => {
    const { data } = await claimTaskApi({ taskId, userId: user.id });

    if (!isEmpty(data)) {
      message.success('领取成功');
      await refresh();
    } else {
      message.error('领取失败，请重试');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const { data } = await deleteTaskApi(taskId);
    if (!isEmpty(data)) {
      message.success('删除成功');
      await refresh();
    } else {
      message.error('删除失败，请重试');
    }
  };

  return (
    <Space wrap>
      {cards.map(
        (
          { id, name, reward, status, timeLimit, type, createTime, creatorId },
          index
        ) => (
          <Card
            hoverable
            title={
              <Text style={{ width: 300 }} ellipsis={{ tooltip: name }}>
                {name}
              </Text>
            }
            extra={
              <>
                <Tag color={getTaskStatusEnumColor(status)}>
                  {getTaskStatusEnumText(status)}
                </Tag>
                {/* 其实这里的删除应该在后端也做个校验删除人逻辑的 */}
                {creatorId === user.id && (
                  <Tooltip title="删除该任务">
                    <DeleteOutlined
                      onClick={() => {
                        handleDeleteTask(id);
                      }}
                    />
                  </Tooltip>
                )}
              </>
            }
            style={{ width: 250 }}
            key={index}
            bodyStyle={{ padding: 0 }}
            loading={loading}
          >
            <Descriptions column={2}>
              {[
                { label: 'Id', value: id },
                { label: '类型', value: getTaskTypeEnumText(type) },
                { label: '酬劳', value: `${reward}元` },
                { label: '限时', value: `${timeLimit}天` }
              ].map(({ label, value }, i) => (
                <Descriptions.Item label={label} key={`${index}-${i}`}>
                  <Text style={{ width: 50 }} ellipsis={{ tooltip: value }}>
                    {value}
                  </Text>
                </Descriptions.Item>
              ))}
            </Descriptions>
            <div className="text-center text-gray-500">
              发布时间：{formatDate(createTime, 'yyyy-MM-dd HH:mm:ss')}
            </div>
            <Button
              disabled={status !== TaskStatusEnum.NOT_START}
              onClick={() => handleClaimTask(id)}
              block
            >
              领取任务
            </Button>
          </Card>
        )
      )}
    </Space>
  );
};

export default TaskPool;
