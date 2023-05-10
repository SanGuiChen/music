import { IAudioState } from '@/store';
import { formatLyric } from '@/utils/lyric';
import React from 'react';

const { useEffect, useRef, useState, useMemo } = React;

const HIGHLIGHT_LYRIC_TOP = 160;
const LYRIC_LINE_HEIGHT = 30;

interface IProps {
  lyric: string;
  audio: IAudioState;
  center?: boolean;
}

const Lyric: React.FC<IProps> = ({ lyric, audio, center }) => {
  const lyricRef = useRef<HTMLDivElement | null>();
  const [line, setLine] = useState(0);
  const lines = useMemo(() => formatLyric(lyric), [lyric]);
  console.log('lines', lines);
  useEffect(() => {
    if (!audio?.paused) {
      window.requestAnimationFrame(() => {
        const audioTime = audio.time || 0;

        const lineIndex = lines.findIndex(([time], index) => {
          const prevTime = index - 1 >= 0 ? lines[index - 1][0] : time;
          const nextTime =
            index + 1 < lines.length ? lines[index + 1][0] : time;
          if (prevTime <= audioTime && nextTime >= audioTime) {
            return true;
          }
        });

        if (lineIndex > -1) {
          const scrollHeight =
            LYRIC_LINE_HEIGHT * lineIndex - HIGHLIGHT_LYRIC_TOP;
          lyricRef.current?.scrollTo({
            top: scrollHeight < 0 ? 0 : scrollHeight,
            behavior: 'smooth'
          });
          setLine(lineIndex);
        }
      });
    }
  }, [line, audio.time]);

  return (
    <div
      className={`"w-full h-full overflow-auto whitespace-nowrap text-tipsHoverColor text-base" ${
        center ? 'text-center' : ''
      }`}
      ref={(ref) => (lyricRef.current = ref)}
      style={{ minWidth: 300, minHeight: 200 }}
    >
      {lines.length === 0 ? (
        '暂无歌词'
      ) : (
        <div>
          {lines.map(([time, lyric], index) => {
            const isActive = line === index;
            const className = `leading-30 ${
              isActive ? 'text-red-500 text-lg' : ''
            }`;
            return (
              <div
                key={`${time}-${index}`}
                className={className}
                style={{ height: LYRIC_LINE_HEIGHT }}
              >
                {lyric}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Lyric;
