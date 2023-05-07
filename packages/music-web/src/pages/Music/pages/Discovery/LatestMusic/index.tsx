import {
  SONG_TYPE,
  createFavoriteApi,
  getSongUrlById,
  getTopSongs,
  searchFavoriteApi
} from '@/apis/music';
import { useRequest } from 'ahooks';
import Cover from '../components/Cover';
import Artists from '@/components/Aritist';
import { formatTime } from '@/utils';
import CentralLoading from '@/components/CentralLoading';
import { useState } from 'react';
import { HeartTwoTone } from '@ant-design/icons';
import { Button, Tooltip, message } from 'antd';
import { IMusic, useAudioStore, useUserStore } from '@/store';
import { FavoriteSourceEnum } from '@/apis/music/index.interface';
import { debounce, isEmpty } from 'lodash';

const getSONG_TYPEText = (type: SONG_TYPE) => {
  switch (type) {
    case SONG_TYPE.ALL:
      return '全部';
    case SONG_TYPE.CHINESE:
      return '华语';
    case SONG_TYPE.EU_USA:
      return '欧美';
    case SONG_TYPE.JAPANESE:
      return '日语';
    case SONG_TYPE.KOREAN:
      return '韩语';
    default:
      return '全部';
  }
};

const LatestMusic = () => {
  const [songType, setSongType] = useState<SONG_TYPE>(SONG_TYPE.ALL);
  const user = useUserStore((state) => state.user);
  const setPlayList = useAudioStore((state) => state.setPlayList);
  const setCurrentIndex = useAudioStore((state) => state.setCurrentIndex);

  const { play } = useAudioStore();

  const {
    data: topSongs = [],
    loading,
    runAsync: fetchTopSong
  } = useRequest(async (type: SONG_TYPE) => {
    const { data } = await getTopSongs(type);
    return data;
  });

  const { data: favoriteSongIds = [], runAsync: fetchFavorite } = useRequest(
    async () => {
      const { data } = await searchFavoriteApi(user.id);
      const { songs } = data;
      return songs.map((song) => song.songId);
    }
  );

  const handleCreateFavorite = async (songId: string) => {
    const { data } = await createFavoriteApi({
      userId: user.id,
      songId,
      source: FavoriteSourceEnum.NETEASE
    });
    if (!isEmpty(data)) {
      message.success('收藏成功');
      await fetchFavorite();
    } else {
      message.success('收藏失败');
    }
  };

  const handlePlayAll = async () => {
    const songIds = topSongs.map((item) => item.id);
    const { data } = await getSongUrlById(songIds);
    const songIdToPlayUrlMap: Record<string, string> = {};
    data.forEach((item) => {
      item?.url && (songIdToPlayUrlMap[item.id] = item?.url);
    });

    const list: IMusic[] = topSongs.map((item) => ({
      id: item.id,
      playUrl: songIdToPlayUrlMap[`${item.id}`] ?? '-',
      name: item.name,
      picUrl: item?.album?.picUrl,
      artists: item?.artists ?? []
    }));
    setPlayList(list);
    setCurrentIndex(0);
    play();
  };

  return (
    <div className="w-4/5 h-full">
      <div className="my-4 text-sm flex justify-between">
        <div>
          {[
            SONG_TYPE.ALL,
            SONG_TYPE.CHINESE,
            SONG_TYPE.EU_USA,
            SONG_TYPE.JAPANESE,
            SONG_TYPE.KOREAN
          ].map((type) => (
            <span
              key={type}
              className={`mr-4 leading-5 ${
                songType === type ? 'text-red-500' : ''
              } cursor-pointer hover:text-red-500`}
              onClick={async () => {
                if (type === songType) return;
                setSongType(type);
                await fetchTopSong(type);
              }}
            >
              {getSONG_TYPEText(type)}
            </span>
          ))}
        </div>

        <Button type="primary" danger onClick={handlePlayAll}>
          播放全部
        </Button>
      </div>

      {loading ? (
        <CentralLoading />
      ) : (
        <>
          {topSongs.map(
            ({ mp3Url, album, id, artists, name, duration }, index) => (
              <div
                className={`group w-full flex ${
                  index % 2 === 1 ? 'bg-slate-200' : 'bg-slate-50'
                } rounded mt-2 flex items-center px-2 overflow-auto`}
                style={{ height: 80 }}
                key={index}
              >
                <div className="mx-2 text-gray-400 font-normal">
                  {index < 9 ? `0${index + 1}` : index + 1}
                </div>
                <Cover
                  picUrl={album.picUrl}
                  song={{ mp3Url, id, artists, album, name }}
                />
                <div className="font-light w-2/5 flex justify-between ml-2">
                  {name}
                  <Artists artists={artists ?? []} />
                </div>
                <div className="font-light w-2/5 ml-14">
                  <div>{album.name}</div>
                </div>
                <div className="font-light mr-2">
                  {formatTime(duration / 1000)}
                </div>
                <Tooltip
                  title={
                    !favoriteSongIds.includes(`${id}`)
                      ? '收藏到我的喜欢'
                      : '取消收藏'
                  }
                >
                  <HeartTwoTone
                    twoToneColor={`${
                      !favoriteSongIds.includes(`${id}`)
                        ? 'rgb(156 163 175)'
                        : 'rgb(239 68 68)'
                    }`}
                    style={{ marginTop: 1, cursor: 'pointer' }}
                    width={30}
                    className={`opacity-0 group-hover:opacity-100 transition duration-300`}
                    onClick={debounce(() => handleCreateFavorite(`${id}`), 500)}
                  />
                </Tooltip>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default LatestMusic;
