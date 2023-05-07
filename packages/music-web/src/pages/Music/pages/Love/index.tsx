import { useRequest } from 'ahooks';
import Artists from '@/components/Aritist';
import { formatTime } from '@/utils';
import CentralLoading from '@/components/CentralLoading';
import { HeartTwoTone } from '@ant-design/icons';
import { Button, Tooltip, message } from 'antd';
import Cover from '../Discovery/components/Cover';
import {
  deleteFavoriteApi,
  getSongDetails,
  getSongUrlById,
  searchFavoriteApi
} from '@/apis/music';
import { IMusic, useAudioStore, useUserStore } from '@/store';
import { FavoriteSourceEnum } from '@/apis/music/index.interface';
import { debounce, isEmpty } from 'lodash';

const Love = () => {
  const user = useUserStore((state) => state.user);
  const setPlayList = useAudioStore((state) => state.setPlayList);
  const setCurrentIndex = useAudioStore((state) => state.setCurrentIndex);

  const { play } = useAudioStore();

  const {
    data: favoriteSongs = [],
    loading,
    runAsync
  } = useRequest(async () => {
    const { data } = await searchFavoriteApi(user.id);
    const { songs } = data;
    const netEaseSongIds: number[] = [];
    const songIdToFavoriteIdMap: Record<string, string> = {};
    songs.forEach((song) => {
      if (song.source === FavoriteSourceEnum.NETEASE) {
        netEaseSongIds.push(Number(song.songId));
      }
      songIdToFavoriteIdMap[song.songId] = song.id;
    });
    const res: any[] = [];
    if (netEaseSongIds.length) {
      const { songs = [] } = await getSongDetails(netEaseSongIds);
      res.push(
        ...songs.map((item) => ({
          album: item.al,
          id: item.id,
          artists: item.ar,
          name: item.name,
          duration: item.dt,
          favoriteId: songIdToFavoriteIdMap[item.id]
        }))
      );
    }
    return res;
  });

  const handleDelete = async (id: string) => {
    const { data } = await deleteFavoriteApi({ id });
    if (!isEmpty(data)) {
      message.success('取消收藏成功');
      await runAsync();
    } else {
      message.error('取消失败，请稍后重试');
    }
  };

  const handlePlayAll = async () => {
    const songIds = favoriteSongs.map((item) => item.id);
    const { data } = await getSongUrlById(songIds);
    const songIdToPlayUrlMap: Record<string, string> = {};
    data.forEach((item) => {
      songIdToPlayUrlMap[item.id] = item.url;
    });

    const list: IMusic[] = favoriteSongs.map((item) => ({
      id: item.id,
      playUrl: songIdToPlayUrlMap[item.id] ?? '',
      artists: item.artists,
      name: item.name,
      picUrl: item?.album?.picUrl ?? ''
    }));
    setPlayList(list);
    setCurrentIndex(0);
    play();
  };

  return (
    <div className="overflow-auto w-5/6 flex justify-center">
      <div className="w-4/5 h-full">
        <div className="my-4 text-sm flex justify-between">
          <span className="text-red-500 text-xl font-mono italic block">
            我的喜欢
          </span>
          <Button type="primary" danger onClick={handlePlayAll}>
            播放全部
          </Button>
        </div>

        {loading ? (
          <CentralLoading />
        ) : (
          <>
            {favoriteSongs.map(
              ({ album, id, artists, name, duration, favoriteId }, index) => (
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
                    song={{ id, name, artists, album }}
                  />
                  <div className="font-light w-2/5 flex justify-between ml-2">
                    {name}
                    <Artists artists={artists ?? []} />
                  </div>
                  <div className="font-light w-2/5 ml-14">
                    <div>{album?.name ?? '-'}</div>
                  </div>
                  <div className="font-light mr-2">
                    {formatTime(duration / 1000)}
                  </div>
                  <Tooltip title={'取消收藏'}>
                    <HeartTwoTone
                      twoToneColor="rgb(239 68 68)"
                      style={{ marginTop: 1, cursor: 'pointer' }}
                      width={30}
                      className="opacity-0 group-hover:opacity-100 transition duration-300"
                      onClick={debounce(() => handleDelete(favoriteId), 500)}
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

export default Love;
