import Title from 'antd/es/typography/Title';
import TaskPool, { getTaskStatusEnumText } from './taskPool';
import { useRequest } from 'ahooks';
import { searchTaskApi } from '@/apis/task';
import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import CreateModal, { getTaskTypeEnumText } from './createModal';
import { useState } from 'react';
import {
  ISearchTaskParams,
  ITask,
  TaskStatusEnum,
  TaskTypeEnum
} from '@/apis/task/index.interface';
import { useForm } from 'antd/es/form/Form';
import { isNil, pickBy } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { RoleEnum, useUserStore } from '@/store/user';

const Task: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const [createVisible, setCreateVisible] = useState<boolean>(false);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [form] = useForm<ISearchTaskParams>();

  const { loading, runAsync: searchTask } = useRequest(async () => {
    const formVal = form.getFieldsValue();
    const { data } = await searchTaskApi({
      ...pickBy(formVal, (value) => !isNil(value) && value !== ''),
      offset: 0,
      limit: 10
    });
    setTasks([...data]);
  });

  return (
    <div className=" w-full h-full rounded p-5 ">
      <div className="w-full h-55px flex justify-between items-center rounded p-2">
        <Title level={3}>音乐任务</Title>
        <div>
          <Button
            type="primary"
            className="mr-2"
            onClick={() => {
              navigate(`/task/${user.id}`);
            }}
          >
            我的任务
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setCreateVisible(true);
            }}
            disabled={user.role !== RoleEnum.SUPER_ADMIN}
          >
            创建任务
          </Button>
        </div>
      </div>
      <Form form={form} layout="inline" className="h-50px mb-2">
        <Form.Item name="id" style={{ width: 150 }}>
          <Input placeholder="根据任务Id搜索" allowClear />
        </Form.Item>
        <Form.Item name="name" style={{ width: 150 }}>
          <Input placeholder="根据任务名称搜索" allowClear />
        </Form.Item>
        <Form.Item
          name="type"
          initialValue={[TaskTypeEnum.LRC]}
          style={{ width: 250 }}
        >
          <Select mode="multiple">
            {[TaskTypeEnum.LRC, TaskTypeEnum.KRC, TaskTypeEnum.ARTIST_INFO].map(
              (val, index) => (
                <Select.Option value={val} key={index}>
                  {getTaskTypeEnumText(val)}
                </Select.Option>
              )
            )}
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          initialValue={[TaskStatusEnum.NOT_START, TaskStatusEnum.PENDING]}
          style={{ width: 250 }}
        >
          <Select mode="multiple">
            {[
              TaskStatusEnum.NOT_START,
              TaskStatusEnum.PENDING,
              TaskStatusEnum.FINISHED,
              TaskStatusEnum.CHECK_REJECT,
              TaskStatusEnum.CHECK_PENDING
            ].map((val, index) => (
              <Select.Option value={val} key={index}>
                {getTaskStatusEnumText(val)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="timeLimit" style={{ width: 150 }}>
          <InputNumber addonAfter="天" placeholder="根据大于该任务限时搜索" />
        </Form.Item>
        <Form.Item name="reward" style={{ width: 150 }}>
          <InputNumber addonAfter="元" placeholder="根据大于该任务酬劳搜索" />
        </Form.Item>
        <Form.Item name="createTime">
          <DatePicker
            placeholder="根据指定时间向后搜索"
            style={{ width: 200 }}
            showTime
          />
        </Form.Item>
        <Button
          type="primary"
          disabled={
            !!form.getFieldsError().filter(({ errors }) => errors.length).length
          }
          onClick={searchTask}
        >
          搜索
        </Button>
      </Form>
      <div className="w-full h-[calc(100%_-_105px)] bg-white p-2 overflow-auto">
        <TaskPool
          cards={tasks}
          loading={loading}
          refresh={async () => {
            await searchTask();
          }}
        />
      </div>
      <CreateModal
        title="创建任务"
        okText="创建"
        isOpen={createVisible}
        onCancel={() => {
          setCreateVisible(false);
        }}
        refresh={async () => {
          await searchTask();
        }}
        onOk={async () => {
          await searchTask();
          setCreateVisible(false);
        }}
      />
    </div>
  );
};

export default Task;
