import { searchPersonalTaskApi } from '@/apis/task';
import { ITask, TaskStatusEnum } from '@/apis/task/index.interface';
import { useFusionTable } from 'ahooks';
import { Button, Table, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import { useNavigate, useParams } from 'react-router-dom';
import { getTaskStatusEnumText } from './taskPool';
import { getTaskTypeEnumText } from './createModal';
import { formatDate } from '@/utils';
import { useState } from 'react';
import { LeftOutlined } from '@ant-design/icons';

interface IBasicTaskInfo {
  pendingTask: number;
  pendingReviewTask: number;
  rejectedTask: number;
  reward: number;
  finishedTask: number;
}

const PersonalTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [taskInfo, setTaskInfo] = useState<IBasicTaskInfo>({
    pendingTask: 0,
    pendingReviewTask: 0,
    rejectedTask: 0,
    reward: 0,
    finishedTask: 0
  });

  const columns: ColumnsType<ITask> = [
    {
      title: '任务Id',
      dataIndex: 'id',
      render: (text) => text ?? '-'
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      render: (text) => text ?? '-'
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      render: (text) => (text ? getTaskStatusEnumText(text) : '-')
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      render: (text) => (text ? getTaskTypeEnumText(text) : '-')
    },
    {
      title: '任务限时',
      dataIndex: 'timeLimit',
      render: (text) => (text ? `${text}天` : '-')
    },
    {
      title: '任务酬劳',
      dataIndex: 'reward',
      render: (text) => (text ? `${text}元` : '-')
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text) => (text ? formatDate(text, 'yyyy-MM-dd HH:mm:ss') : '-')
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render: (text) => (text ? formatDate(text, 'yyyy-MM-dd HH:mm:ss') : '-')
    },
    {
      title: '预览歌曲',
      dataIndex: 'extra',
      render: (text) => {
        if (!text) return '-';
        const { playUrl } = JSON.parse(text);
        if (!playUrl) return '-';
        return (
          <audio controls src={playUrl}>
            <a href={playUrl}>Download audio</a>
          </audio>
        );
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_text, { status, id }) => (
        <Button
          type="link"
          block
          disabled={status !== TaskStatusEnum.PENDING}
          onClick={() => {
            navigate(`/production/task/${id}`);
          }}
        >
          制作
        </Button>
      )
    }
  ];

  const getTableData = async ({
    current,
    pageSize
  }: {
    current: number;
    pageSize: number;
  }) => {
    if (!id) {
      message.error('userId不能为空');
      return {
        list: [],
        total: 0
      };
    }
    const { data } = await searchPersonalTaskApi({
      userId: id,
      offset: (current - 1) * pageSize,
      limit: pageSize
    });
    const { task, total } = data;
    let [
      pendingTask,
      finishedTask,
      totalReward,
      pendingReviewTask,
      rejectedTask
    ] = [0, 0, 0, 0, 0];
    task.forEach(({ status, reward }) => {
      if (status === TaskStatusEnum.PENDING) {
        pendingTask += 1;
      } else if (status === TaskStatusEnum.FINISHED) {
        finishedTask += 1;
        totalReward += reward;
      } else if (status === TaskStatusEnum.CHECK_PENDING) {
        pendingReviewTask += 1;
      } else if (status === TaskStatusEnum.CHECK_REJECT) {
        rejectedTask += 1;
      }
    });
    setTaskInfo({
      pendingTask,
      finishedTask,
      reward: totalReward,
      pendingReviewTask,
      rejectedTask
    });

    return {
      list: task.map((item) => ({ key: item.id, ...item })),
      total
    };
  };

  const { paginationProps, tableProps } = useFusionTable(getTableData);

  return (
    <div className=" w-full h-full p-5 ">
      <div className="w-full h-65px p-2">
        <Tooltip title="返回任务列表">
          <LeftOutlined
            className=" cursor-pointer"
            onClick={() => {
              navigate('/task');
            }}
          />
        </Tooltip>
        <Title level={3}>我的任务</Title>
      </div>
      <div className="w-full h-[calc(100%_-_65px)] bg-white p-2 overflow-auto">
        <div className="flex border w-full">
          {[
            {
              label: '待完成任务',
              value: taskInfo.pendingTask,
              color: 'text-yellow-500'
            },
            {
              label: '待审核任务',
              value: taskInfo.pendingReviewTask,
              color: 'text-purple-500'
            },
            {
              label: '被驳回任务',
              value: taskInfo.rejectedTask,
              color: 'text-red-500'
            },
            {
              label: '已完成任务',
              value: taskInfo.finishedTask,
              color: 'text-blue-500'
            },
            {
              label: '已获得酬劳',
              value: `${taskInfo.reward}元`,
              color: 'text-green-500'
            }
          ].map(({ label, value, color }, index) => (
            <div
              className="w-1/5 h-55px border rounded text-center"
              key={index}
            >
              <p className=" text-2xl font-bold">{label}</p>
              <p className={` text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
        <Table
          className="mt-5"
          columns={columns}
          {...tableProps}
          pagination={paginationProps}
        />
      </div>
    </div>
  );
};

export default PersonalTask;
