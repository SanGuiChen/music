import { searchTaskApi } from '@/apis/task';
import CentralLoading from '@/components/CentralLoading';
import LyricEditor from '@/components/LyricEditor';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

interface IBasicInfo {
  songName?: string;
  artistName?: string;
}

const Production: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [playUrl, setPlayUrl] = useState<string>('');
  const [basicInfo, setBasicInfo] = useState<IBasicInfo>({});

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

  return (
    <div className=" w-full h-full rounded p-5 ">
      <Title level={3}>音乐制作</Title>
      <div className="w-full h-auto p-3  bg-white">
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
    </div>
  );
};

export default Production;
