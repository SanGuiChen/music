import {
  DownloadOutlined,
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
import { BaseEditor, createEditor, Editor, Node, Transforms } from 'slate';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';

interface IProps {
  initialContent?: Node[];
}

enum KeyBoardCode {
  SPACE = 32,
  ENTER = 13
}

const LyricEditor: React.FC<IProps> = ({ initialContent }) => {
  const lyricPlayerRef = useRef<HTMLAudioElement>(null);

  const [editor, setEditor] = useState<BaseEditor & ReactEditor>(
    withReact(createEditor())
  );
  // 跟踪编辑器中 value 的值。
  const [content, setContent] = useState<Node[]>(initialContent ?? []);
  const [uploadLyric, setUploadLyric] = useState<string>('');

  const [playUrl, setPlayUrl] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {
    if (uploadLyric.length > 0) {
      const newEditor = withReact(createEditor());
      setContent(
        uploadLyric
          .split('\n')
          .map((text) => ({ type: 'text', children: [{ text }] }))
      );
      setEditor(newEditor);
    }
  }, [uploadLyric]);

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
      const totalSeconds = Math.floor(player.currentTime);
      const hour = Math.floor(totalSeconds / 3600);
      const minute = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `[${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}] `;
    } else {
      message.error('发生了未知错误');
      return '';
    }
  };

  const handleDownload = () => {
    const contentRef = true;
    if (contentRef) {
      const text = '';
      const element = document.createElement('a');
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
      );
      element.setAttribute('download', fileName);
      console.log(fileName);
      console.log(text);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  };

  const handlePlay = async () => {
    await lyricPlayerRef.current?.play();
    setIsPlay(true);
    Transforms.setNodes(
      editor,
      // @ts-ignore
      { isHightLight: true },
      { at: [currentIndex] }
    );
    ReactEditor.focus(editor);
  };

  const handlePause = () => {
    lyricPlayerRef.current?.pause();
    setIsPlay(false);
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
      setIsPlay(true);
      Transforms.setNodes(
        editor,
        // @ts-ignore
        { isHightLight: true },
        { at: [0] }
      );
      ReactEditor.focus(editor);
    }
  };

  const returnPreLine = () => {
    const index = currentIndex - 1;
    setCurrentIndex(index);
    Transforms.removeNodes(editor, { at: [index, 0] });
    lyricPlayerRef.current;
  };

  const readLyricContentByUpload = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const contents = event.target?.result as string;
        resolve(contents);
      };

      reader.readAsText(file);
    });
  };

  return (
    <div
      className="border-gray-300 border border-solid rounded bg-white"
      style={{ width: 800, height: 600 }}
    >
      <div className=" overflow-auto">
        <Slate
          editor={editor}
          value={content}
          onChange={(value) => {
            setContent(value);
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
              const lyric = await readLyricContentByUpload(file);
              setUploadLyric(lyric);
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
        </Space>
        <audio
          controls
          src={playUrl}
          className="w-full"
          ref={lyricPlayerRef}
          onPlay={() => {
            setIsPlay(true);
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
