import { getSongUrlById } from '@/apis/music';
import playIcon from '@/assets/play.svg';
import pauseIcon from '@/assets/pause.svg';
import errorIcon from '@/assets/error.svg';
import { IMusic, useAudioStore } from '@/store';
import { isNumber } from 'lodash';
import { Tooltip } from 'antd';
import { Image } from 'antd';

interface IProps {
  picUrl: string;
  song: any;
}

const Cover: React.FC<IProps> = ({ picUrl, song }) => {
  const playList = useAudioStore((state) => state.playList);
  const currentIndex = useAudioStore((state) => state.currentIndex);
  const setPlayList = useAudioStore((state) => state.setPlayList);
  const setCurrentIndex = useAudioStore((state) => state.setCurrentIndex);

  const { state, play, pause } = useAudioStore();

  const handlePlay = async (song: any) => {
    const { id } = song;
    if (isNumber(id)) {
      const { data } = await getSongUrlById([id]);
      const newItemList: IMusic[] = data.map((item) => ({
        playUrl: item.url,
        id,
        picUrl,
        artists: song?.artists ?? [],
        name: song?.name ?? '-'
      }));
      if (playList.length === 0) {
        setPlayList(newItemList);
      } else {
        const list = [...playList];
        list.splice(currentIndex + 1, 0, ...newItemList);
        setPlayList(list);
      }
      setCurrentIndex(currentIndex + 1);
      play();
    }
  };

  const handlePause = () => {
    pause();
  };

  return (
    <div style={{ position: 'relative' }}>
      <Image
        preview={false}
        src={picUrl}
        alt=""
        width={50}
        className="rounded"
        loading="lazy"
        fallback={errorIcon}
      />
      <Tooltip
        title={
          !state.paused && playList[currentIndex]?.id === song.id
            ? '暂停'
            : '播放'
        }
      >
        <img
          src={
            !state.paused && playList[currentIndex]?.id === song.id
              ? pauseIcon
              : playIcon
          }
          width={20}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
            cursor: 'pointer'
          }}
          onClick={() => {
            !state.paused && playList[currentIndex]?.id === song.id
              ? handlePause()
              : handlePlay(song);
          }}
        />
      </Tooltip>
    </div>
  );
};

export default Cover;
