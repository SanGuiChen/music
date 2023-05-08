import {
  createThumbUpApi,
  deleteThumbUpApi,
  getSongComment,
  searchThumbUpApi
} from '@/apis/music';
import { IComment } from '@/apis/music/index.interface';
import { useUserStore } from '@/store';
import { convertTimestampToUTC8, uniqueIdGenerator } from '@/utils';
import { LikeTwoTone } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Avatar, Button, List, Skeleton, message } from 'antd';
import { debounce, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

interface IProps {
  id: number;
}

const LIMIT = 20;

const Comment: React.FC<IProps> = ({ id }) => {
  const commentListGenerateId = uniqueIdGenerator('comment-list-item');
  const [totalList, setTotalList] = useState<IComment[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const user = useUserStore((state) => state.user);

  const { data: thumbupCommentIds = [], runAsync: refreshThumbUps } =
    useRequest(async () => {
      const { data } = await searchThumbUpApi(user.id, `${id}`);
      const { thumbUps = [] } = data;
      return thumbUps.map((t) => t.commentId);
    });

  const { data, loading, runAsync } = useRequest(async () => {
    const {
      topComments = [],
      comments = [],
      hotComments = [],
      total
    } = await getSongComment(id, offset, LIMIT);
    setTotalList([...totalList, ...comments]);
    return {
      hotComments,
      topComments,
      comments,
      total
    };
  });

  useEffect(() => {
    runAsync();
    refreshThumbUps();
  }, [id]);

  const handleThumbUp = async (commentId: number) => {
    const { data } = await createThumbUpApi({
      userId: user.id,
      songId: `${id}`,
      commentId
    });
    if (!isEmpty(data)) {
      message.success('点赞成功');
      await refreshThumbUps();
    } else {
      message.error('点赞失败');
    }
  };

  const handleCancelThumbUp = async (commentId: number) => {
    const { data } = await deleteThumbUpApi({ commentId, userId: user.id });
    if (!isEmpty(data)) {
      message.success('取消点赞成功');
      await refreshThumbUps();
    } else {
      message.error('取消点赞失败');
    }
  };

  const loadMore = (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px'
      }}
    >
      <Button
        onClick={async () => {
          setOffset(offset + LIMIT);
          await runAsync();
        }}
        type="primary"
      >
        加载更多
      </Button>
    </div>
  );

  return (
    <div className="w-full h-full flex items-center" style={{ minHeight: 500 }}>
      <div className="w-full">
        <div className="w-full mt-4">
          <span className="text-xl mb-4 font-semibold block">
            置顶评论&nbsp;({data?.topComments?.length ?? '-'})
          </span>
          <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={data?.topComments}
            locale={{ emptyText: '暂无评论' }}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  [
                    <div key={commentListGenerateId.next().value}>
                      <LikeTwoTone
                        className=" cursor-pointer mr-1"
                        twoToneColor={`${
                          !thumbupCommentIds.includes(`${item.commentId}`)
                            ? 'rgb(156 163 175)'
                            : 'rgb(239 68 68)'
                        }`}
                        onClick={debounce(
                          () =>
                            !thumbupCommentIds.includes(`${item.commentId}`)
                              ? handleThumbUp(item.commentId)
                              : handleCancelThumbUp(item.commentId),
                          500
                        )}
                      />
                      {item.likedCount +
                        (thumbupCommentIds.includes(`${item.commentId}`)
                          ? 1
                          : 0)}
                    </div>
                  ]
                ]}
                key={index}
              >
                <Skeleton avatar title={false} loading={loading} active>
                  <List.Item.Meta
                    avatar={<Avatar src={item.user.avatarUrl} />}
                    title={
                      <div className="-mt-4">
                        <span className="text-base">
                          {item.user.nickname}：
                        </span>
                        <span className=" font-thin">{item.content}</span>
                      </div>
                    }
                    description={
                      <span>{convertTimestampToUTC8(item.time / 1000)}</span>
                    }
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        </div>

        <div className="w-full mt-4">
          <span className="text-xl mb-4 font-semibold block">
            精彩评论&nbsp;({data?.hotComments?.length ?? '-'})
          </span>
          <List
            loading={loading}
            itemLayout="horizontal"
            locale={{ emptyText: '暂无评论' }}
            dataSource={data?.hotComments}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  [
                    <div key={commentListGenerateId.next().value}>
                      <LikeTwoTone
                        className=" cursor-pointer mr-1"
                        twoToneColor={`${
                          !thumbupCommentIds.includes(`${item.commentId}`)
                            ? 'rgb(156 163 175)'
                            : 'rgb(239 68 68)'
                        }`}
                        onClick={debounce(
                          () =>
                            !thumbupCommentIds.includes(`${item.commentId}`)
                              ? handleThumbUp(item.commentId)
                              : handleCancelThumbUp(item.commentId),
                          500
                        )}
                      />
                      {item.likedCount +
                        (thumbupCommentIds.includes(`${item.commentId}`)
                          ? 1
                          : 0)}
                    </div>
                  ]
                ]}
                key={index}
              >
                <Skeleton avatar title={false} loading={loading} active>
                  <List.Item.Meta
                    avatar={<Avatar src={item.user.avatarUrl} />}
                    title={
                      <div className="-mt-4">
                        <span className="text-base">
                          {item.user.nickname}：
                        </span>
                        <span className=" font-thin">{item.content}</span>
                      </div>
                    }
                    description={
                      <span>{convertTimestampToUTC8(item.time / 1000)}</span>
                    }
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        </div>

        <div className="w-full mt-4">
          <span className=" text-xl font-semibold mb-4 block">
            所有评论&nbsp;({data?.total ?? '-'})
          </span>
          <List
            // loading={loading}
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={totalList}
            locale={{ emptyText: '暂无评论' }}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <div key={commentListGenerateId.next().value}>
                    <LikeTwoTone
                      className=" cursor-pointer mr-1"
                      twoToneColor={`${
                        !thumbupCommentIds.includes(`${item.commentId}`)
                          ? 'rgb(156 163 175)'
                          : 'rgb(239 68 68)'
                      }`}
                      onClick={debounce(
                        () =>
                          !thumbupCommentIds.includes(`${item.commentId}`)
                            ? handleThumbUp(item.commentId)
                            : handleCancelThumbUp(item.commentId),
                        500
                      )}
                    />
                    {item.likedCount +
                      (thumbupCommentIds.includes(`${item.commentId}`) ? 1 : 0)}
                  </div>
                ]}
                key={index}
              >
                <Skeleton avatar title={false} loading={loading} active>
                  <List.Item.Meta
                    avatar={<Avatar src={item.user.avatarUrl} />}
                    title={
                      <div className="-mt-4">
                        <span className="text-base">
                          {item.user.nickname}：
                        </span>
                        <span className=" font-thin">{item.content}</span>
                      </div>
                    }
                    description={
                      <span>{convertTimestampToUTC8(item.time / 1000)}</span>
                    }
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Comment;
