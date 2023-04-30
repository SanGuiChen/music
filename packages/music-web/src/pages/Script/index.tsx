import { getPlayUrlApi, searchApi } from '@/apis/script';
import { uniqueIdGenerator } from '@/utils';
import { useAntdTable, useRequest } from 'ahooks';
import { Input, Image, Typography, Button, message, Form } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import { omit } from 'lodash';
import { useState } from 'react';
import { clampedAll } from 'clamped-promise-all';
import { CONCURRENT_LIMIT } from '@/constants';
import { useTranslation } from 'react-i18next';
import { useForm } from 'antd/es/form/Form';
import { IStorageParams } from '@/apis/meta/index.interface';
import { storageApi } from '@/apis/meta';

const { Text } = Typography;
const { Search } = Input;

interface ISearchTable {
  key: React.Key;
  songId: number;
  songName: string;
  artistId: string;
  artistName: string;
  albumId: number;
  albumName: string;
  imgUrl: string;
  playUrl: string;
}

type KeyRecordMap = Record<string, IStorageParams>;

const Script: React.FC = () => {
  const tableitemKeyGenerator = uniqueIdGenerator('table-item');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [keyTableItemMap, setKeyTableItemMap] = useState<KeyRecordMap>({});
  const { t } = useTranslation();
  const [form] = useForm();

  const columns: ColumnsType<ISearchTable> = [
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
    }
  ];

  const { loading: storaging, runAsync: storage } = useRequest(
    async (params: IStorageParams[]) => {
      const res = [];
      await clampedAll(
        params.map((param) => async () => {
          res.push(await storageApi(param));
        }),
        CONCURRENT_LIMIT
      );
      if (res.length === params.length) {
        message.success(t('STORAGE_ALL_SUCCESS'));
      } else {
        message.error(t('STORAGE_SOME_FAILED'));
      }
      setSelectedRowKeys([]);
    },
    { manual: true }
  );

  const getTableData = async (
    {
      current,
      pageSize
    }: {
      current: number;
      pageSize: number;
    },
    formData: { keywords: string }
  ): Promise<{ list: ISearchTable[]; total: number }> => {
    const { keywords } = formData;
    if (!keywords) {
      return {
        list: [],
        total: 0
      };
    }
    const { data } = await searchApi({
      keyWords: keywords.split(' '),
      offset: (current - 1) * pageSize,
      limit: pageSize
    });
    const { list, total } = data;
    const songIds = list.map(({ songId }) => songId);
    const { data: playUrlMap } = await getPlayUrlApi({
      songIds
    });
    const map: KeyRecordMap = {};

    const res = list.map((item) => {
      const key = tableitemKeyGenerator.next().value;
      const tableItem = {
        ...omit(item, ['artists', 'playUrl']),
        artistName: item.artists.map(({ artistName }) => artistName).join(';'),
        artistId: item.artists.map(({ artistId }) => artistId).join(';'),
        playUrl: playUrlMap[item.songId] ? playUrlMap[item.songId] : '-'
      };
      map[key] = tableItem;

      return {
        key,
        ...tableItem
      };
    });
    setKeyTableItemMap(map);
    return {
      list: res,
      total
    };
  };

  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form
  });

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleSearch = async () => {
    search.submit();
  };

  const handleStorage = async () => {
    const params = selectedRowKeys.map((key) => keyTableItemMap[key]);
    await storage(params);
  };

  return (
    <div className="w-full h-full rounded p-5">
      <Title level={3}>{t('KEYWORDS_SEARCH')}</Title>
      <div className="bg-white p-3 min-h-full">
        <Form form={form} layout="inline">
          <Form.Item name="keywords" className="w-full">
            <Search
              placeholder={`${t('CAN_SEARCH_SONG_ALBUM_ARTIST_ETC')} ${t(
                'SPACE_DIFF'
              )}`}
              onSearch={handleSearch}
              allowClear
            />
          </Form.Item>
        </Form>

        <Button
          className="mt-5"
          type="primary"
          onClick={handleStorage}
          loading={storaging}
          disabled={!selectedRowKeys.length}
        >
          {t('STORAGE')}
          {selectedRowKeys.length
            ? `${selectedRowKeys.length}${t('SOME_SONGS')}`
            : ''}
        </Button>
        <Table
          className="mt-5"
          columns={columns}
          {...tableProps}
          rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
        />
      </div>
    </div>
  );
};

export default Script;
