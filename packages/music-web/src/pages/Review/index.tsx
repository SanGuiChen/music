import { searchReviewApi } from '@/apis/review';
import { IReview, ReviewStatusEnum } from '@/apis/review/index.interface';
import { searchTaskApi } from '@/apis/task';
import { TaskTypeEnum } from '@/apis/task/index.interface';
import { searchUserApi } from '@/apis/user/user';
import { CONCURRENT_LIMIT } from '@/constants';
import { formatDate } from '@/utils';
import { useAntdTable } from 'ahooks';
import { Button, Form, Table } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import { clampedAll } from 'clamped-promise-all';
import { isUndefined, pick } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { getTaskTypeEnumText } from '../Task/createModal';

interface IReviewCol {
  reviewer: string;
  employee: string;
  taskName: string;
  taskType: TaskTypeEnum;
  id: string;
  taskId: string;
  status: ReviewStatusEnum;
  createTime: string;
}

interface FormValue {
  id?: string;
  reviewerId?: string;
  employeeId?: string;
  taskId?: string;
  status?: ReviewStatusEnum;
  createTime?: string;
}

export const getReviewStatusEnumText = (status: ReviewStatusEnum) => {
  switch (status) {
    case ReviewStatusEnum.NOT_START:
      return '未审核';
    case ReviewStatusEnum.NOT_PASS:
      return '审核不通过';
    case ReviewStatusEnum.PASS:
      return '审核通过';
    default:
      return '未知状态';
  }
};

const Review: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  const columns: ColumnsType<IReviewCol> = [
    {
      title: '审核Id',
      dataIndex: 'id',
      render: (text) => text ?? '-'
    },
    {
      title: '任务Id',
      dataIndex: 'taskId',
      render: (text) => text ?? '-'
    },
    {
      title: '任务名',
      dataIndex: 'taskName',
      render: (text) => text ?? '-'
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      render: (text) => (text ? getTaskTypeEnumText(text) : '-')
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      render: (text) =>
        !isUndefined(text) ? getReviewStatusEnumText(text) : '-'
    },
    {
      title: '审核人',
      dataIndex: 'reviewer',
      render: (text) => text ?? '-'
    },
    {
      title: '接单人',
      dataIndex: 'employee',
      render: (text) => text ?? '-'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text) => (text ? formatDate(text, 'yyyy-MM-dd HH:mm:ss') : '-')
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_text, { status, id, taskType }) => (
        <Button
          type="link"
          block
          disabled={status === ReviewStatusEnum.PASS}
          onClick={() => {
            if (taskType === TaskTypeEnum.LRC) {
              navigate(`/production/review/${id}`);
            }
          }}
        >
          审核
        </Button>
      )
    }
  ];

  const getTableData = async (
    {
      current,
      pageSize
    }: {
      current: number;
      pageSize: number;
    },
    formData: FormValue
  ) => {
    const { data } = await searchReviewApi({
      ...formData,
      offset: (current - 1) * pageSize,
      limit: pageSize
    });
    const { reviews, total } = data;
    const list = await clampedAll(
      reviews.map((item) => async () => {
        const { data: tasks } = await searchTaskApi({
          id: item.taskId,
          offset: 0,
          limit: 1
        });
        const { type, name } = tasks[0];
        const { employeeId, reviewerId } = item;
        const { data: employee } = await searchUserApi({ id: employeeId });
        const { data: reviewer } = await searchUserApi({ id: reviewerId });

        return {
          ...pick(item, ['id', 'taskId', 'status', 'createTime']),
          taskName: name,
          taskType: type,
          employee: employee[0].nickname,
          reviewer: reviewer[0].nickname,
          key: item.id
        };
      }),
      CONCURRENT_LIMIT
    );
    return {
      list,
      total
    };
  };

  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form
  });

  return (
    <div className="w-full h-full rounded p-5">
      <Title level={3}>音乐审核</Title>
      <Form form={form} layout="inline"></Form>
      <div className="bg-white p-3 min-h-full">
        <Table className="mt-5" columns={columns} {...tableProps} />
      </div>
    </div>
  );
};

export default Review;
