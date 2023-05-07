import { createReviewApi } from '@/apis/review';
import { searchPersonalTaskApi, searchTaskApi } from '@/apis/task';
import CentralLoading from '@/components/CentralLoading';
import LyricEditor from '@/components/LyricEditor';
import { useUserStore } from '@/store/user';
import { useRequest } from 'ahooks';
import { Button, message } from 'antd';
import Title from 'antd/es/typography/Title';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface IBasicInfo {
  songName?: string;
  artistName?: string;
}

const Production: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [playUrl, setPlayUrl] = useState<string>('');
  const [basicInfo, setBasicInfo] = useState<IBasicInfo>({});
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const { taskId } = useParams();
  const { loading } = useRequest(async () => {
    if (!taskId) return;
    const { data } = await searchTaskApi({
      id: taskId,
      offset: 0,
      limit: 1
    });
    if (!data.length) {
      message.error('该任务不存在');
      return;
    }
    const { extra } = data[0];
    if (extra) {
      const { songName, artistName, lyric, playUrl } = JSON.parse(extra);
      if (playUrl) {
        setPlayUrl(playUrl);
      }

      if (lyric) {
        setContent(lyric);
      }

      const info: IBasicInfo = {};
      if (songName) {
        info.songName = songName;
      }
      if (artistName) {
        info.artistName = artistName;
      }

      setBasicInfo(info);
    }
  });

  const { loading: submitting, runAsync: handleSubmit } = useRequest(
    async () => {
      if (!taskId) {
        message.error('taskId 不能为空');
        return;
      }
      const { data } = await searchPersonalTaskApi({
        taskId,
        offset: 0,
        limit: 100
      });
      const { personalTask } = data;
      const { data: createData } = await createReviewApi({
        reviewerId: user.id,
        employeeId: personalTask[0].userId,
        taskId
      });
      if (!isEmpty(createData)) {
        message.success('任务提交成功, 等待审核');
        navigate('/task');
      } else {
        message.error('任务提交失败，请重试');
      }
    },
    { manual: true }
  );

  return (
    <div className=" w-full h-full rounded p-5 ">
      <Title level={3}>音乐制作</Title>
      <div className="w-full h-auto bg-white mb-2 overflow-auto">
        {loading ? (
          <CentralLoading />
        ) : (
          <>
            <div className="text-center mb-2">
              {basicInfo?.songName ? (
                <div>
                  <span className="text-xl font-bold">
                    {basicInfo.songName}
                  </span>
                </div>
              ) : (
                <></>
              )}
              {basicInfo?.artistName ? (
                <div>
                  <span className="text-lg font-semibold text-gray-500">
                    {basicInfo.artistName}
                  </span>
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className="flex justify-center items-center">
              <LyricEditor
                initialContent={content
                  .split('\n')
                  .map((text) => ({ type: 'text', children: [{ text }] }))}
                initialPlayUrl={playUrl}
              />
            </div>
          </>
        )}
      </div>
      <div className="w-full h-55 mt-1 p-2 border-1 bg-slate-100 z-10 border-gray-100 shadow-xl flex items-center flex-row-reverse">
        <Button loading={submitting} onClick={handleSubmit}>
          提交
        </Button>
      </div>
    </div>
  );
};

export default Production;
