import {
  rejectReviewApi,
  searchReviewApi,
  submitReviewApi
} from '@/apis/review';
import { searchTaskApi } from '@/apis/task';
import CentralLoading from '@/components/CentralLoading';
import LyricEditor from '@/components/LyricEditor';
import { useRequest } from 'ahooks';
import { Button, message } from 'antd';
import Title from 'antd/es/typography/Title';
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
  const navigate = useNavigate();

  const { reviewId } = useParams();
  const { loading } = useRequest(async () => {
    if (!reviewId) return;
    const { data: reviewData } = await searchReviewApi({
      id: reviewId,
      offset: 0,
      limit: 1
    });
    const { reviews } = reviewData;
    if (!reviews.length) {
      message.error('该审核任务不存在');
      return;
    }
    const taskId = reviews[0].taskId;
    const { data } = await searchTaskApi({
      id: taskId,
      offset: 0,
      limit: 1
    });
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

  const { loading: passing, runAsync: handlePass } = useRequest(
    async () => {
      if (!reviewId) return;
      try {
        await submitReviewApi({ id: reviewId });
        message.success('通过成功');
        navigate('/review');
      } catch (e) {
        message.success('通过失败，请重试');
      }
    },
    { manual: true }
  );

  const { loading: rejecting, runAsync: handleReject } = useRequest(
    async () => {
      if (!reviewId) return;
      try {
        await rejectReviewApi({ id: reviewId });
        message.success('不通过成功');
        navigate('/review');
      } catch (e) {
        message.success('不通过失败，请重试');
      }
    },
    { manual: true }
  );

  return (
    <div className=" w-full h-full rounded p-5 ">
      <Title level={3}>音乐审核</Title>
      <div className="w-full h-full p-3 bg-white overflow-auto">
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
        <Button loading={rejecting} onClick={handleReject}>
          不通过
        </Button>
        <Button className="mr-2" loading={passing} onClick={handlePass}>
          通过
        </Button>
      </div>
    </div>
  );
};

export default Production;
