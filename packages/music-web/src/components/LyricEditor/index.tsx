import {
  DownloadOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  UploadOutlined,
  UpSquareOutlined
} from '@ant-design/icons';
import { Button, message, Space, Upload } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { createEditor, Editor, Node, Transforms } from 'slate';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import Lyric from '../Lyric';
import { IAudioState } from '@/store';

interface IProps {
  initialContent?: Node[];
  initialPlayUrl?: string;
  onChange?: (data: string) => void;
}

enum KeyBoardCode {
  SPACE = 32,
  ENTER = 13
}

const LyricEditor: React.FC<IProps> = ({
  initialContent,
  initialPlayUrl,
  onChange
}) => {
  const lyricPlayerRef = useRef<HTMLAudioElement>(null);
  const editor = useMemo(() => withReact(createEditor()), []);

  // 跟踪编辑器中 value 的值。
  const [content, setContent] = useState<Node[]>(initialContent ?? []);
  const [playUrl, setPlayUrl] = useState<string>(initialPlayUrl ?? '');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [audioState, setAudioState] = useState<IAudioState>({
    audioRef: lyricPlayerRef.current,
    paused: lyricPlayerRef.current?.paused ?? false,
    time: lyricPlayerRef.current?.currentTime ?? 0
  });

  const handleUpdateState = () => {
    setAudioState({
      audioRef: lyricPlayerRef.current,
      paused: lyricPlayerRef.current?.paused ?? false,
      time: lyricPlayerRef.current?.currentTime ?? 0
    });
  };

  useEffect(() => {
    lyricPlayerRef.current?.addEventListener('play', handleUpdateState);
    lyricPlayerRef.current?.addEventListener('pause', handleUpdateState);
    lyricPlayerRef.current?.addEventListener('ended', handleUpdateState);
    lyricPlayerRef.current?.addEventListener('timeupdate', handleUpdateState);

    return () => {
      lyricPlayerRef.current?.removeEventListener('play', handleUpdateState);
      lyricPlayerRef.current?.removeEventListener('pause', handleUpdateState);
      lyricPlayerRef.current?.removeEventListener('ended', handleUpdateState);
      lyricPlayerRef.current?.removeEventListener(
        'timeupdate',
        handleUpdateState
      );
    };
  }, [lyricPlayerRef]);

  const renderElement = useCallback(
    ({ attributes, children, element }: any) => {
      switch (element.type) {
        case 'text':
          return (
            <div
              {...attributes}
              className={
                element.isHightLight && isPlay
                  ? 'bg-cyan-200 p-0.5 rounded mb-0.5'
                  : ' p-0.5 rounded mb-0.5'
              }
              style={{ height: 20 }}
            >
              {children}
            </div>
          );

        default:
          return <div {...attributes}>{children}</div>;
      }
    },
    [isPlay]
  );

  const renderLeaf = useCallback((props: any) => {
    return (
      <span {...props.attributes} style={{ color: props.leaf.color }}>
        {props.children}
      </span>
    );
  }, []);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isPlay) return;
    if (e.keyCode === KeyBoardCode.SPACE) {
      e.preventDefault();
      const timeStamp = getCurrentTime();
      Transforms.insertNodes(
        editor,
        //@ts-ignore
        { text: timeStamp, color: 'rgb(202 138 4)' },
        { at: [currentIndex, 0] }
      );

      // 滚动到打轴行
      const hightLightLineNode = Editor.node(editor, [currentIndex])[0];
      const element = ReactEditor.toDOMNode(editor, hightLightLineNode);
      element.scrollIntoView({ behavior: 'smooth' });

      const index = currentIndex + 1;
      setCurrentIndex(index);

      // 歌词行高亮
      index < content.length &&
        Transforms.setNodes(
          editor,
          // @ts-ignore
          { isHightLight: true },
          { at: [index] }
        );

      Transforms.unsetNodes(editor, ['isHightLight'], {
        at: [index - 1]
      });

      if (index === content.length) {
        handlePause();
      }
    }
  };

  const getCurrentTime = () => {
    const player = lyricPlayerRef.current;
    if (player) {
      const currentTime = player.currentTime;
      const minutes = Math.floor(currentTime / 60);
      const seconds = Math.floor(currentTime % 60);
      const milliseconds = Math.floor(currentTime * 1000) % 1000;
      return `[${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}] `;
    } else {
      message.error('发生了未知错误');
      return '';
    }
  };

  const handleDownload = () => {
    const text = content.map((n) => Node.string(n)).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.lrc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePlay = async () => {
    await lyricPlayerRef.current?.play();
  };

  const handlePause = () => {
    lyricPlayerRef.current?.pause();
  };

  const handlePreview = async () => {
    if (!previewVisible) {
      await handlePlay();
    } else {
      handlePause();
    }
    setPreviewVisible(!previewVisible);
  };

  const reMakeLyric = async () => {
    for (let i = 0; i < currentIndex; i++) {
      Transforms.removeNodes(editor, { at: [i, 0] });
    }
    setCurrentIndex(0);
    const player = lyricPlayerRef.current;
    if (player) {
      player.currentTime = 0;
      await player.play();
    }
  };

  const returnPreLine = () => {
    const index = currentIndex - 1;
    setCurrentIndex(index);
    Transforms.removeNodes(editor, { at: [index, 0] });
    lyricPlayerRef.current;
  };

  return (
    <div
      className="border-gray-300 border border-solid rounded bg-white"
      style={{ width: 800, height: 600 }}
    >
      <div className="w-full flex" style={{ height: 500 }}>
        <div className="overflow-auto w-full" style={{ minWidth: 400 }}>
          <Slate
            editor={editor}
            value={content}
            onChange={(value) => {
              setContent(value);
              onChange?.(value.map((n) => Node.string(n)).join('\n'));
            }}
          >
            <Editable
              onKeyDown={(e) => handleKeyDown(e)}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              className="p-2"
              style={{ width: '100%', height: 500 }}
            />
          </Slate>
        </div>
        {previewVisible && (
          <div className="w-full h-full bg-green-100 flex justify-center items-center overflow-auto">
            <div className="w-3/4 h-3/4 ">
              <Lyric
                lyric={content.map((n) => Node.string(n)).join('\n')}
                audio={audioState}
                center={true}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <Space className="mb-2">
          <Button
            icon={<PlayCircleOutlined />}
            disabled={isPlay}
            onClick={async () => {
              const isRestart =
                currentIndex === content.length && currentIndex > 0;
              if (isRestart) {
                await reMakeLyric();
                return;
              }
              if (playUrl) {
                await handlePlay();
              } else {
                message.warning('请先上传歌曲');
              }
            }}
          >
            {currentIndex === content.length && currentIndex > 0
              ? '重新制作'
              : '开始制作'}
          </Button>
          <Button
            icon={<UpSquareOutlined />}
            disabled={!isPlay || currentIndex === 0}
            onClick={returnPreLine}
          >
            返回上一行
          </Button>
          <Upload
            beforeUpload={(file) => {
              const audioUrl = URL.createObjectURL(file);
              setPlayUrl(audioUrl);
              setFileName(file.name.split('.')[0]);
              return false;
            }}
            showUploadList={false}
            accept="audio/*"
          >
            <Button icon={<UploadOutlined />}>上传歌曲</Button>
          </Upload>
          <Upload
            beforeUpload={async (file) => {
              const lyric = await file.text();
              const newNodes = lyric
                .split('\n')
                .filter((text) => text.trim().length > 0)
                .map((text) => ({ type: 'text', children: [{ text }] }));
              Transforms.select(editor, {
                anchor: { path: [0, 0], offset: 0 },
                focus: {
                  path: [
                    content.length - 1,
                    // @ts-ignore
                    content[content.length - 1].children.length - 1
                  ],
                  offset:
                    // @ts-ignore
                    content[content.length - 1].children[
                      // @ts-ignore
                      content[content.length - 1].children.length - 1
                    ].text.length
                }
              });

              Transforms.insertNodes(editor, newNodes);
              // Remove the first paragraph node's empty line if it exists
              // @ts-ignore
              if (editor.children[0].children[0].text === '') {
                Transforms.removeNodes(editor, {
                  at: [0]
                });

                // Merge the first text node of the second paragraph node with the last text node of the previous node
                Transforms.mergeNodes(editor, {
                  at: [0]
                });
              }
              return false;
            }}
            showUploadList={false}
            accept=".txt,.lrc*"
          >
            <Button icon={<UploadOutlined />}>上传歌词</Button>
          </Upload>

          <Button icon={<DownloadOutlined />} onClick={handleDownload}>
            导出歌词
          </Button>

          <Button icon={<EyeOutlined />} onClick={handlePreview}>
            预览
          </Button>
        </Space>
        <audio
          controls
          src={playUrl}
          className="w-full"
          ref={lyricPlayerRef}
          onPlay={() => {
            if (currentIndex < content.length) {
              setIsPlay(true);
              ReactEditor.focus(editor);
              Transforms.setNodes(
                editor,
                // @ts-ignore
                { isHightLight: true },
                { at: [currentIndex] }
              );
            }
          }}
          onPause={() => setIsPlay(false)}
        >
          <a href={playUrl}>Download audio</a>
        </audio>
      </div>
    </div>
  );
};

export default LyricEditor;
