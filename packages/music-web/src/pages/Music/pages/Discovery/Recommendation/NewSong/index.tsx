import { getPersonalizedNewMusic } from '@/apis/music';
import Artists from '@/components/Aritist';
import CentralLoading from '@/components/CentralLoading';
import { RightOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import Cover from '../../components/Cover';
import { MusicPageStatusEnum, useAudioStore } from '@/store';

const NewSong: React.FC = () => {
  const setPageStatus = useAudioStore((state) => state.setPageStatus);

  const { data: songList = [], loading } = useRequest(async () => {
    const { result } = await getPersonalizedNewMusic(10);
    return result;
  });

  return (
    <>
      <span className="mb-2 mr-1 block text-base font-medium">
        最新音乐
        <RightOutlined
          className=" cursor-pointer"
          onClick={() =>
            setPageStatus(MusicPageStatusEnum.DISCOVERY_LATEST_MUSIC)
          }
        />
      </span>
      {loading ? (
        <CentralLoading />
      ) : (
        <div className="flex justify-between flex-wrap">
          {songList.map(({ id, name, picUrl, song, ...others }, index) => (
            <div
              key={index}
              className="hover:bg-gray-100 rounded-md flex items-center"
              style={{ width: '45%', height: 60, marginBottom: 10 }}
            >
              <Cover picUrl={picUrl} song={song} />
              <div className="flex items-center">
                <div className="mx-2 text-gray-400 font-normal">
                  {index < 9 ? `0${index + 1}` : index + 1}
                </div>
                <div>
                  <div className="font-light">{name}</div>
                  <Artists artists={song?.artists ?? []} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default NewSong;
