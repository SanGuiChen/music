import { SearchOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, MenuProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import musicIcon from '@/assets/music-listen.svg';
import { MusicPageStatusEnum, useAudioStore } from '@/store';
import { useRequest } from 'ahooks';
import { getSearchHot, getSearchSuggest } from '@/apis/music';
import CentralLoading from '@/components/CentralLoading';
import { compact, debounce } from 'lodash';
import { useMemo, useState } from 'react';

const DISCOVERY_PATH = '/music/discovery';

const Header = () => {
  const { pathname } = useLocation();
  const pageStatus = useAudioStore((state) => state.pageStatus);
  const setPageStatus = useAudioStore((state) => state.setPageStatus);
  const navigate = useNavigate();

  const [isFocus, setIsFocus] = useState<boolean>(false);

  const {
    data: hots = [],
    runAsync: searchHot,
    loading: hotSearching
  } = useRequest(
    async () => {
      const { result } = await getSearchHot();
      const { hots } = result;
      return hots;
    },
    { manual: true }
  );

  let {
    data: suggestions = [],
    runAsync: searchSuggeest,
    loading: suggestSearching
  } = useRequest(
    async (keyWords: string) => {
      const { result } = await getSearchSuggest(keyWords);
      const { albums = [], artists = [], playlists = [], songs = [] } = result;

      return compact([
        ...songs.map((s) => s.name),
        ...artists.map((a) => a.name),
        ...albums.map((a) => a.name),
        ...playlists.map((p) => p.name)
      ]);
    },
    { manual: true }
  );

  const menuItems = [
    {
      label: '个性推荐',
      key: MusicPageStatusEnum.DISCOVERY_RECOMENDATION
    },
    {
      label: '最新音乐',
      key: MusicPageStatusEnum.DISCOVERY_LATEST_MUSIC
    }
  ];

  const dropDownItems: MenuProps['items'] = useMemo(
    () => [
      {
        label:
          suggestions.length && isFocus ? (
            <span className=" text-gray-400">推荐搜索</span>
          ) : (
            ''
          ),
        key: 'drop-0'
      },
      {
        label: (
          <>
            {suggestSearching ? (
              <CentralLoading />
            ) : (
              <div className="w-full flex flex-wrap">
                {(isFocus ? suggestions : [])?.map((text, index) => (
                  <Button
                    className="mr-2 mt-1"
                    key={index}
                    shape="round"
                    onClick={() => {
                      navigate(`/music/search?keyWords=${text}`);
                    }}
                  >
                    {text}
                  </Button>
                ))}
              </div>
            )}
          </>
        ),
        key: 'drop-1'
      },
      {
        label: <span className=" text-gray-400">热门搜索</span>,
        key: 'drop-2'
      },
      {
        label: (
          <>
            {hotSearching ? (
              <CentralLoading />
            ) : (
              <div className="w-full flex flex-wrap">
                {hots?.map(({ first }, index) => (
                  <Button
                    className="mr-2 mt-1"
                    key={index}
                    shape="round"
                    onClick={() => {
                      navigate(`/music/search?keyWords=${first}`);
                    }}
                  >
                    {first}
                  </Button>
                ))}
              </div>
            )}
          </>
        ),
        key: 'drop-3'
      }
    ],
    [suggestSearching, hotSearching, isFocus]
  );

  const dropdownRender = (
    <div>
      {suggestions.length && isFocus ? (
        <div className=" text-gray-400">推荐搜索</div>
      ) : (
        ''
      )}
      {suggestSearching ? (
        <CentralLoading />
      ) : (
        <div className="w-full flex flex-wrap">
          {(isFocus ? suggestions : [])?.map((text, index) => (
            <Button
              className="mr-2 mt-1"
              key={index}
              shape="round"
              onClick={() => {
                navigate(`/music/search?keyWords=${text}`);
              }}
            >
              {text}
            </Button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex w-full h-30px bg-gray-50 z-10 border-b-1 border-gray-300">
      <div className="w-1/6 h-full border-gray-300 flex items-center justify-center">
        <img src={musicIcon} alt="" width={50} />
        <span className="text-gray-900 text-2xl mt-4 font-mono italic block">
          Relax
        </span>
      </div>
      <div className="w-5/6 h-full flex justify-between items-center">
        {pathname === DISCOVERY_PATH ? (
          <Menu
            mode="horizontal"
            items={menuItems}
            selectedKeys={[pageStatus]}
            onClick={({ key }) => setPageStatus(key as MusicPageStatusEnum)}
          />
        ) : (
          <div className="h-30px"></div>
        )}
        <Dropdown
          overlayClassName="w-2/5"
          menu={{ items: dropDownItems }}
          trigger={['click']}
          onOpenChange={async (open) => {
            if (!open) {
              setIsFocus(false);
            } else {
              await searchHot();
            }
          }}
        >
          <Input
            placeholder="搜索"
            prefix={<SearchOutlined />}
            className="w-1/5 h-full mr-12"
            onPressEnter={(e: any) => {
              if (e.target.value) {
                navigate(`/music/search?keyWords=${e.target.value}`);
              }
            }}
            onChange={(e) =>
              debounce(async () => {
                if (!isFocus) {
                  setIsFocus(true);
                }
                if (e.target.value) await searchSuggeest(e.target.value);
              }, 500)()
            }
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
