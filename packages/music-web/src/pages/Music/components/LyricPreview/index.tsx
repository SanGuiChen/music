import playBar from '@/assets/play-bar.png';
import playCd from '@/assets/play-cd.png';
import { useAudioStore } from '@/store';
import Lyric from '../Lyric';
import Artists from '@/components/Aritist';
import { useRequest } from 'ahooks';
import { getSongLyric } from '@/apis/music';
import { useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

interface IProps {
  picUrl: string;
  name: string;
  artist: any[];
  id: number;
  handleClose: () => void;
}

const LyricPreview: React.FC<IProps> = ({
  picUrl,
  name,
  artist,
  id,
  handleClose
}) => {
  const { state: audioState } = useAudioStore();

  const { data: lyric, runAsync } = useRequest(
    async () => {
      const { lrc } = await getSongLyric(id);
      return lrc?.lyric;
    },
    { manual: true }
  );

  useEffect(() => {
    runAsync();
  }, [id]);

  return (
    <div className="w-full h-full flex justify-center bg-white overflow-auto relative">
      <Tooltip title="关闭歌词">
        <DownOutlined
          className=" absolute cursor-pointer left-4 top-4"
          onClick={handleClose}
        />
      </Tooltip>
      <div className="min-w-3/5 w-4/5 h-full">
        {/* 播放部分 */}
        <div className="flex w-full h-4/5">
          {/* cd部分 */}
          <div className="w-1/2 relative">
            <div className=" relative left-1/2">
              <img
                src={playBar}
                style={{
                  transform: !audioState.paused
                    ? 'rotate(5deg)'
                    : 'rotate(-35deg)',
                  transformOrigin: '0 0',
                  position: 'relative',
                  zIndex: 10,
                  left: 7,
                  top: 5
                }}
                width={100}
              />
              <img
                src={playCd}
                style={{ position: 'absolute', left: 0, top: -5, zIndex: 11 }}
                width={25}
              />
            </div>
            <div
              style={{
                width: 300,
                height: 300,
                borderRadius: '50%',
                backgroundColor: '#1c1d20',
                border: '10px solid #e4e0e0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '-75px'
              }}
            >
              <div
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  border: '5px solid black',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                className={!audioState.paused ? 'animate-spin-slow' : ''}
              >
                <img
                  src={`${picUrl}?param=190y190`}
                  style={{ borderRadius: '50%' }}
                />
              </div>
            </div>
          </div>
          {/* 歌词部分 */}
          <div className="w-1/2 flex justify-center ">
            <div className="w-full h-4/5">
              <span className=" text-xl mb-2 mt-8 block">{name ?? '-'}</span>
              <div className="flex mb-4">
                <span className="mr-1 block text-sm font-medium"> 歌手：</span>
                <Artists artists={artist} fontColor="text-blue-400" />
              </div>
              <Lyric lyric={lyric ?? ''} audio={audioState} />
            </div>
          </div>
        </div>
        {/* 评论部分 */}
        <div className="flex w-full h-1/5">comment</div>
      </div>
    </div>
  );
};

export default LyricPreview;
