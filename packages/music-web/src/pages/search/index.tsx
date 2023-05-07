import {
  offlineMusicObjectApi,
  searchMusicObjectApi,
  shelvesMusicObjectApi
} from '@/apis/meta';
import {
  IMusicObject,
  IMusicSearchResp,
  MusicObjectStatusEnum
} from '@/apis/meta/index.interface';
import { getPlayUrlApi } from '@/apis/script';
import { useAntdTable, useRequest } from 'ahooks';
import {
  Button,
  Form,
  Input,
  Select,
  Table,
  Typography,
  Image,
  Tag,
  message
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import { isEmpty, isUndefined } from 'lodash';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { Text } = Typography;

enum FormEnum {
  SONGID = 'songId',
  SONGNAME = 'songName',
  ALBUMID = 'albumId',
  ALBUMNAME = 'albumName',
  ARTISTID = 'artistId',
  ARTISTNAME = 'artistName'
}

interface FormValue {
  song: {
    songType: FormEnum;
    songVal?: string;
  };
  album: {
    albumType: FormEnum;
    albumVal?: string;
  };
  artist: {
    artistType: FormEnum;
    artistVal?: string;
  };
}

const MusicSearch: React.FC = () => {
  const [form] = useForm();
  const { t } = useTranslation();

  const { loading, runAsync: handleShelvesOrOffline } = useRequest(
    async (id: string, status: MusicObjectStatusEnum) => {
      const api =
        status === MusicObjectStatusEnum.IN_USE
          ? offlineMusicObjectApi
          : shelvesMusicObjectApi;
      const data = await api({ id });
      if (!data || isEmpty(data)) {
        message.error(
          `${
            status === MusicObjectStatusEnum.IN_USE
              ? t('OFFLINE')
              : t('SHELVES')
          }${t('FAILED')}`
        );
      } else {
        message.success(
          `${
            status === MusicObjectStatusEnum.IN_USE
              ? t('OFFLINE')
              : t('SHELVES')
          }${t('SUCCESS')}`
        );
      }
    },
    { manual: true }
  );

  const columns: ColumnsType<IMusicObject> = [
    {
      title: t('SONG_ID'),
      dataIndex: 'songId',
      render: (text) => text ?? '-'
    },
    {
      title: t('SONG_NAME'),
      dataIndex: 'songName',
      render: (text) =>
        (
          <Text ellipsis={{ tooltip: text }} className="font-bold w-20">
            {text}
          </Text>
        ) ?? '-'
    },
    {
      title: t('ARTIST_ID'),
      dataIndex: 'artistId',
      render: (text) => text ?? '-'
    },
    {
      title: t('ARTIST_NAME'),
      dataIndex: 'artistName',
      render: (text) =>
        (
          <Text ellipsis={{ tooltip: text }} className="font-bold w-20">
            {text}
          </Text>
        ) ?? '-'
    },
    {
      title: t('ALBUM_ID'),
      dataIndex: 'albumId',
      render: (text) => text ?? '-'
    },
    {
      title: t('ALBUM_NAME'),
      dataIndex: 'albumName',
      render: (text) =>
        (
          <Text ellipsis={{ tooltip: text }} className="font-bold w-20">
            {text}
          </Text>
        ) ?? '-'
    },
    {
      title: t('COVER'),
      dataIndex: 'imgUrl',
      render: (text) => (text ? <Image src={text} width={30} /> : '-')
    },
    {
      title: t('PLAY_URL'),
      dataIndex: 'playUrl',
      render: (text) =>
        text ? (
          <audio controls className="w-50 h-10">
            <source src={text} type="audio/mpeg" />
            Your browser does not support Audio Tag
          </audio>
        ) : (
          '-'
        )
    },
    {
      title: t('STATUS'),
      dataIndex: 'status',
      render: (text) =>
        !isUndefined(text) ? (
          <Tag
            color={text === MusicObjectStatusEnum.IN_USE ? 'cyan' : 'orange'}
          >
            {text === MusicObjectStatusEnum.IN_USE ? t('IN_USE') : t('BANNED')}
          </Tag>
        ) : (
          '-'
        )
    },
    {
      title: t('OPERATION'),
      dataIndex: 'operation',
      render: (_text, { id, status }) => (
        <Button
          type="link"
          onClick={async () => {
            await handleShelvesOrOffline(id, status);
            search.submit();
          }}
          loading={loading}
        >
          {status === MusicObjectStatusEnum.IN_USE
            ? t('OFFLINE')
            : t('SHELVES')}
        </Button>
      )
    }
  ];

  const getTableData = async (
    {
      current,
      pageSize
    }: {
      current: number;
      pageSize: number;
    },
    formData: FormValue
  ): Promise<IMusicSearchResp> => {
    const { song, album, artist } = formData;
    const objects = [
      {
        songId:
          song?.songVal && song.songType === FormEnum.SONGID
            ? song?.songVal
            : undefined,
        songName:
          song?.songVal && song.songType === FormEnum.SONGNAME
            ? song?.songVal
            : undefined,
        albumId:
          album?.albumVal && album.albumType === FormEnum.ALBUMID
            ? album?.albumVal
            : undefined,
        albumName:
          album?.albumVal && album.albumType === FormEnum.ALBUMNAME
            ? album?.albumVal
            : undefined,
        artistId:
          artist?.artistVal && artist.artistType === FormEnum.ARTISTID
            ? artist?.artistVal
            : undefined,
        artistName:
          artist?.artistVal && artist.artistType === FormEnum.ARTISTNAME
            ? artist?.artistVal
            : undefined
      }
    ];
    const { data } = await searchMusicObjectApi({
      objects:
        !song?.songVal && !album?.albumVal && !artist?.artistVal
          ? undefined
          : objects,
      offset: (current - 1) * pageSize,
      limit: pageSize
    });
    const { list = [], total } = data;
    const songIds = list.map(({ songId }) => Number(songId));
    const { data: playUrlMap } = await getPlayUrlApi({
      songIds
    });
    return {
      list: list.map((item) => ({
        ...item,
        key: item.id,
        playUrl: playUrlMap[item.songId]
      })),
      total
    };
  };

  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form
  });

  const handleSearch = async () => {
    search.submit();
  };

  return (
    <div className=" w-full h-auto rounded p-5">
      <Title level={3}>{t('MUSIC_RETRIEVAL')}</Title>
      <div className="bg-white p-3 min-h-full overflow-auto">
        <Form form={form} layout="inline">
          <Form.Item>
            <Input.Group compact>
              <Form.Item
                name={['song', 'songType']}
                rules={[{ required: true, message: 'Please input Song Type!' }]}
                initialValue={FormEnum.SONGID}
              >
                <Select>
                  <Option value={FormEnum.SONGID}>{t('SONG_ID')}</Option>
                  <Option value={FormEnum.SONGNAME}>{t('SONG_NAME')}</Option>
                </Select>
              </Form.Item>
              <Form.Item name={['song', 'songVal']}>
                <Input placeholder={`${t('PLEASE_INPUT')}...`} />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item>
            <Input.Group compact>
              <Form.Item
                name={['album', 'albumType']}
                rules={[
                  { required: true, message: 'Please input Album Type!' }
                ]}
                initialValue={FormEnum.ALBUMID}
              >
                <Select>
                  <Option value={FormEnum.ALBUMID}>{t('ALBUM_ID')}</Option>
                  <Option value={FormEnum.ALBUMNAME}>{t('ALBUM_NAME')}</Option>
                </Select>
              </Form.Item>
              <Form.Item name={['album', 'albumVal']}>
                <Input placeholder={`${t('PLEASE_INPUT')}...`} />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item>
            <Input.Group compact>
              <Form.Item
                name={['artist', 'artistType']}
                rules={[
                  { required: true, message: 'Please input Artist Type!' }
                ]}
                initialValue={FormEnum.ARTISTID}
              >
                <Select>
                  <Option value={FormEnum.ARTISTID}>{t('ARTIST_ID')}</Option>
                  <Option value={FormEnum.ARTISTNAME}>
                    {t('ARTIST_NAME')}
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item name={['artist', 'artistVal']}>
                <Input placeholder={`${t('PLEASE_INPUT')}...`} />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleSearch}>
              {t('SEARCH')}
            </Button>
          </Form.Item>
        </Form>
        <Table className="mt-5" columns={columns} {...tableProps} />
      </div>
    </div>
  );
};

export default MusicSearch;
