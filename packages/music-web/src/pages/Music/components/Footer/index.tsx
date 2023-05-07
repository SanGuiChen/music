import { useAudioStore } from '@/store';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import H5AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import previousIcon from '@/assets/previous.svg';
import nextIcon from '@/assets/next.svg';
import playIcon from '@/assets/play-player.svg';
import pauseIcon from '@/assets/pause-player.svg';
import errorIcon from '@/assets/error.svg';
import { Drawer, Tooltip, message } from 'antd';
import Artists from '@/components/Aritist';
import { DoubleRightOutlined } from '@ant-design/icons';
import LyricPreview from '../LyricPreview';
import { Image } from 'antd';

interface IProps {}

const Footer: React.FC<IProps> = () => {
  // music的
  const currentIndex = useAudioStore((state) => state.currentIndex);
  const playList = useAudioStore((state) => state.playList);
  const setCurrentIndex = useAudioStore((state) => state.setCurrentIndex);

  const { updateState, state, play, pause } = useAudioStore();

  const audioPlayerRef = useRef<H5AudioPlayer>(null);
  const [lyricVisible, setLyricVisible] = useState<boolean>(false);

  const isplay = useMemo(() => !state.paused, [state.paused]);

  useLayoutEffect(() => {
    const audioEl = audioPlayerRef.current?.audio.current;
    useAudioStore.setState((state) => ({
      state: { ...state.state, audioRef: audioEl }
    }));
    return () => {
      useAudioStore.setState((state) => ({
        state: { ...state.state, audioRef: null }
      }));
    };
  }, [audioPlayerRef]);

  useEffect(() => {
    audioPlayerRef.current?.audio.current?.addEventListener(
      'play',
      updateState
    );
    audioPlayerRef.current?.audio.current?.addEventListener(
      'pause',
      updateState
    );
    audioPlayerRef.current?.audio.current?.addEventListener(
      'ended',
      updateState
    );
    audioPlayerRef.current?.audio.current?.addEventListener(
      'timeupdate',
      updateState
    );

    return () => {
      audioPlayerRef.current?.audio.current?.removeEventListener(
        'play',
        updateState
      );
      audioPlayerRef.current?.audio.current?.removeEventListener(
        'pause',
        updateState
      );
      audioPlayerRef.current?.audio.current?.removeEventListener(
        'ended',
        updateState
      );
      audioPlayerRef.current?.audio.current?.removeEventListener(
        'timeupdate',
        updateState
      );
    };
  }, [audioPlayerRef, updateState]);

  const src = useMemo(() => {
    return playList.length > 0
      ? currentIndex < playList.length
        ? playList[currentIndex].playUrl
        : playList[playList.length - 1].playUrl
      : '';
  }, [currentIndex, playList.length]);

  const handlePlayNext = (hasError?: boolean) => {
    if (hasError) {
      console.error(`资源加载出错：${playList?.[currentIndex]?.playUrl}`);
    }
    if (currentIndex < playList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (playList.length > 1) {
        message.info('已播放到最后一首,即将重新播放第一首...');
        setCurrentIndex(0);
      }
    }
  };

  const handlePlayPre = () => {
    if (currentIndex === 0) {
      message.error('当前歌曲已在队首');
      return;
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleShowLyric = () => {
    setLyricVisible(true);
  };

  const handleLyricHidden = () => {
    setLyricVisible(false);
  };

  return (
    <>
      <AudioPlayer
        src={src}
        onEnded={() => {
          handlePlayNext();
        }}
        onPlayError={() => handlePlayNext(true)}
        customControlsSection={[
          // RHAP_UI.ADDITIONAL_CONTROLS,
          <div className="flex-1">
            <div className="flex">
              <div className=" relative">
                <Image
                  src={playList?.[currentIndex]?.picUrl}
                  alt=""
                  width={40}
                  className="rounded"
                  loading="lazy"
                  preview={false}
                  fallback={errorIcon}
                />
                {playList?.[currentIndex]?.picUrl && (
                  <Tooltip title={lyricVisible ? '关闭歌词' : '展开歌词'}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%,-50%) ${
                          lyricVisible ? 'rotate(90deg)' : 'rotate(-90deg)'
                        }`,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                      className=" bg-gray-600 rounded opacity-0 hover:opacity-100"
                      onClick={
                        lyricVisible ? handleLyricHidden : handleShowLyric
                      }
                    >
                      <DoubleRightOutlined />
                    </div>
                  </Tooltip>
                )}
              </div>

              <div className="ml-2 flex justify-center flex-col">
                <div className="font-light mb-1">
                  {playList?.[currentIndex]?.name}
                </div>
                <Artists artists={playList?.[currentIndex]?.artists ?? []} />
              </div>
            </div>
          </div>,
          <div className="flex items-center">
            <Tooltip title="上一首">
              <img
                src={previousIcon}
                alt=""
                width={25}
                className=" cursor-pointer"
                onClick={handlePlayPre}
              />
            </Tooltip>
            <Tooltip title={isplay ? '暂停' : '播放'}>
              <img
                src={isplay ? pauseIcon : playIcon}
                alt=""
                width={50}
                onClick={async () => {
                  if (!playList.length) {
                    message.warning('当前播放队列为空');
                    return;
                  }
                  if (!isplay) {
                    play();
                  } else {
                    pause();
                  }
                }}
                className=" cursor-pointer mx-2"
              />
            </Tooltip>

            <Tooltip title="下一首">
              <img
                src={nextIcon}
                alt=""
                width={25}
                className=" cursor-pointer"
                onClick={() => handlePlayNext()}
              />
            </Tooltip>
          </div>,
          RHAP_UI.VOLUME_CONTROLS
        ]}
        ref={audioPlayerRef}
        style={{ height: 90 }}
      />
      <Drawer
        placement="bottom"
        closable={false}
        onClose={handleLyricHidden}
        open={lyricVisible}
        height="calc(100% - 140px)"
        headerStyle={{ height: 0 }}
        bodyStyle={{ padding: 0 }}
        style={{
          position: 'relative',
          bottom: 90
        }}
        mask={false}
      >
        <LyricPreview
          picUrl={playList?.[currentIndex]?.picUrl}
          name={playList?.[currentIndex]?.name}
          artist={playList?.[currentIndex]?.artists ?? []}
          id={playList?.[currentIndex]?.id}
          handleClose={handleLyricHidden}
        />
      </Drawer>
    </>
  );
};

export default Footer;
