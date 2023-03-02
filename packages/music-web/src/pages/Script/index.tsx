import { getPlayUrlApi, searchApi, storageApi } from '@/apis/script';
import { IStorageParams } from '@/apis/script/index.interface';
import { uniqueIdGenerator } from '@/utils';
import { useRequest } from 'ahooks';
import { Input, Image, Typography, Button, message } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import { omit } from 'lodash';
import { useState } from 'react';
import { clampedAll } from 'clamped-promise-all';
import { CONCURRENT_LIMIT } from '@/constants';

const { Search } = Input;
const { Text } = Typography;

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

const columns: ColumnsType<ISearchTable> = [
  {
    title: '歌曲Id',
    dataIndex: 'songId',
    render: (text) => text ?? '-'
  },
  {
    title: '歌曲名',
    dataIndex: 'songName',
    render: (text) =>
      (
        <Text ellipsis={{ tooltip: text }} className="font-bold w-20">
          {text}
        </Text>
      ) ?? '-'
  },
  {
    title: '艺人Id',
    dataIndex: 'artistId',
    render: (text) => text ?? '-'
  },
  {
    title: '艺人名',
    dataIndex: 'artistName',
    render: (text) =>
      (
        <Text ellipsis={{ tooltip: text }} className="font-bold w-20">
          {text}
        </Text>
      ) ?? '-'
  },
  {
    title: '专辑Id',
    dataIndex: 'albumId',
    render: (text) => text ?? '-'
  },
  {
    title: '专辑名',
    dataIndex: 'albumName',
    render: (text) =>
      (
        <Text ellipsis={{ tooltip: text }} className="font-bold w-20">
          {text}
        </Text>
      ) ?? '-'
  },
  {
    title: '封面',
    dataIndex: 'imgUrl',
    render: (text) => (text ? <Image src={text} width={30} /> : '-')
  },
  {
    title: '播放链接',
    dataIndex: 'playUrl',
    render: (text) =>
      text ? (
        <audio controls className="w-50 h-10">
          <source src={text} type="audio/mpeg" />
          您的浏览器不支持 audio 元素。
        </audio>
      ) : (
        '-'
      )
  },
  {
    title: '操作',
    dataIndex: 'operation',
    render: () => <>operation</>
  }
];

const Script: React.FC = () => {
  const tableitemKeyGenerator = uniqueIdGenerator('table-item');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [keyTableItemMap, setKeyTableItemMap] = useState<KeyRecordMap>({});

  const { loading, runAsync, data } = useRequest(
    async (keyWords: string[]) => {
      const { data = [] } = await searchApi({ keyWords });
      const songIds = data.map(({ songId }) => songId);
      const { data: playUrlMap } = await getPlayUrlApi({
        songIds
      });
      const map: KeyRecordMap = {};

      const res = data.map((item) => {
        const key = tableitemKeyGenerator.next().value;
        const tableItem = {
          ...omit(item, ['artists', 'playUrl']),
          artistName: item.artists
            .map(({ artistName }) => artistName)
            .join(';'),
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
      return res;
    },
    {
      manual: true
    }
  );

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
        message.success('全部入库成功');
      } else {
        message.error('部分入库失败');
      }
      setSelectedRowKeys([]);
    },
    { manual: true }
  );

  const onSearch = async (value: string) => {
    const keyWords = value.split(' ');
    await runAsync(keyWords);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleStorage = async () => {
    const params = selectedRowKeys.map((key) => keyTableItemMap[key]);
    await storage(params);
  };

  return (
    <div className="bg-white w-full h-full rounded p-5">
      <Title level={5}>关键字搜索</Title>
      <Search
        placeholder="可搜索音乐 / 专辑 / 歌手 空格区分"
        className="w-200"
        allowClear
        onSearch={onSearch}
        loading={loading}
      />
      <Button
        className="mt-5"
        type="primary"
        onClick={handleStorage}
        loading={storaging}
        disabled={!selectedRowKeys.length}
      >
        入库{selectedRowKeys.length ? `${selectedRowKeys.length}首歌曲` : ''}
      </Button>
      <Table
        className="mt-5"
        columns={columns}
        dataSource={data ?? []}
        loading={loading}
        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
      />
    </div>
  );
};

export default Script;
