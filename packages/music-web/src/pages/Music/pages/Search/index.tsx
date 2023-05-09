import { useRequest } from 'ahooks';
import Artists from '@/components/Aritist';
import { formatTime } from '@/utils';
import CentralLoading from '@/components/CentralLoading';
import { HeartTwoTone } from '@ant-design/icons';
import { Button, Tooltip, message } from 'antd';
import Cover from '../Discovery/components/Cover';
import {
  createFavoriteApi,
  deleteFavoriteApi,
  getSongUrlById,
  searchByKeyWords,
  searchFavoriteApi
} from '@/apis/music';
import { IMusic, SearhcSouceEnum, useAudioStore, useUserStore } from '@/store';
import { debounce, isEmpty, uniqBy } from 'lodash';
import { useSearchParams } from 'react-router-dom';
import { FavoriteSourceEnum } from '@/apis/music/index.interface';
import { useEffect } from 'react';
import { searchMusicObjectApi } from '@/apis/meta';
import { MusicObjectStatusEnum } from '@/apis/meta/index.interface';

interface ISongItem {
  album: any;
  id: number | string;
  artists: any[];
  name: string;
  duration: number;
}

const Search = () => {
  const user = useUserStore((state) => state.user);
  const searchSource = useAudioStore((state) => state.searchSource);
  const setPlayList = useAudioStore((state) => state.setPlayList);
  const setCurrentIndex = useAudioStore((state) => state.setCurrentIndex);

  const { play } = useAudioStore();

  const [searchParams, setSearchParams] = useSearchParams();

  const keyWords = searchParams.get('keyWords');

  useEffect(() => {
    search();
  }, [keyWords, searchSource]);

  const { data: favoriteSongIds = [], runAsync: fetchFavorite } = useRequest(
    async () => {
      const { data } = await searchFavoriteApi(user.id);
      const { songs } = data;
      return songs.map((song) => song.songId);
    }
  );

  const {
    data: songData = { count: 0, songs: [] },
    loading,
    runAsync: search
  } = useRequest(async () => {
    if (!keyWords) {
      message.error('无搜索参数, 请重新搜素');
      return;
    }
    if (searchSource === SearhcSouceEnum.NET_EASE) {
      const { result } = await searchByKeyWords(keyWords);
      const { songs, songCount } = result;
      const list: ISongItem[] = songs.map((item) => ({
        name: item.name,
        album: item.al,
        artists: item.ar,
        duration: item.dt,
        id: item.id
      }));
      return {
        count: songCount,
        songs: list
      };
    } else {
      const { data: songData } = await searchMusicObjectApi({
        offset: 0,
        limit: 100,
        objects: [{ songName: keyWords }]
      });
      const { data: albumData } = await searchMusicObjectApi({
        offset: 0,
        limit: 100,
        objects: [{ albumName: keyWords }]
      });
      const { data: artistData } = await searchMusicObjectApi({
        offset: 0,
        limit: 100,
        objects: [{ artistName: keyWords }]
      });
      const songList = uniqBy(
        [...songData.list, ...albumData.list, ...artistData.list],
        'songId'
      );
      // count不准确
      const list: ISongItem[] = songList
        .filter((item) => item.status === MusicObjectStatusEnum.IN_USE)
        .map((item) => ({
          name: item.songName,
          album: { picUrl: item.imgUrl, name: item.albumName },
          artists: item.artistName.split(';').map((name) => ({ name })),
          duration: 0,
          id: item.songId
        }));
      return {
        count: list.length,
        songs: list
      };
    }
  });

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

  const handleDelete = async (songId: string) => {
    const { data } = await deleteFavoriteApi({ songId, userId: user.id });
    if (!isEmpty(data)) {
      message.success('取消收藏成功');
      await fetchFavorite();
    } else {
      message.error('取消失败，请稍后重试');
    }
  };

  const handlePlayAll = async () => {
    if (searchSource === SearhcSouceEnum.NET_EASE) {
      const songIds = songData.songs.map((item) => item.id);
      const { data } = await getSongUrlById(songIds);
      const songIdToPlayUrlMap: Record<string, string> = {};
      data.forEach((item) => {
        songIdToPlayUrlMap[item.id] = item.url;
      });

      const list: IMusic[] = songData.songs.map((item) => ({
        id: item.id,
        playUrl: songIdToPlayUrlMap[`${item.id}`] ?? '-',
        name: item.name,
        picUrl: item?.album?.picUrl,
        artists: item?.artists ?? []
      }));
      setPlayList(list);
      setCurrentIndex(0);
      play();
    } else {
      const songs = songData.songs.map((item) => ({ songId: item.id }));
      const { data } = await searchMusicObjectApi({
        offset: 0,
        limit: 100,
        objects: songs
      });

      const list: IMusic[] = data.list.map((item) => ({
        id: item.songId,
        playUrl: item.playUrl ?? '-',
        name: item.songName,
        picUrl: item.imgUrl,
        artists: item.artistName.split(';').map((name) => ({ name })) ?? []
      }));

      setPlayList(list);
      setCurrentIndex(0);
      play();
    }
  };

  return (
    <div className="overflow-auto w-5/6 flex justify-center">
      <div className="w-4/5 h-full">
        <div className="my-4 text-sm flex justify-between">
          <div className=" text-xl font-mono italic block">
            搜索结果：
            <span className=" font-bold">{keyWords}</span>
          </div>
          <Button type="primary" danger onClick={handlePlayAll}>
            播放全部
          </Button>
        </div>

        {loading ? (
          <CentralLoading />
        ) : (
          <>
            {songData.songs.map(
              ({ album, id, artists, name, duration }, index) => (
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
                    picUrl={album?.picUrl ?? ''}
                    song={{ id, artists, album, name }}
                  />
                  <div className="font-light w-2/5 flex justify-between ml-2">
                    {name}
                    <Artists artists={artists ?? []} />
                  </div>
                  <div className="font-light w-2/5 ml-14">
                    <div>{album?.name ?? '-'}</div>
                  </div>
                  <div className="font-light mr-2">
                    {duration ? formatTime(duration / 1000) : '-'}
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
                      onClick={debounce(
                        () =>
                          !favoriteSongIds.includes(`${id}`)
                            ? handleCreateFavorite(`${id}`)
                            : handleDelete(`${id}`),
                        500
                      )}
                    />
                  </Tooltip>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
