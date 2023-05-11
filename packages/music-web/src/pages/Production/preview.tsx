import LyricEditor from '@/components/LyricEditor';
import Title from 'antd/es/typography/Title';
import React from 'react';

const content = `作词：方文山
作曲：周杰伦
编曲：钟兴民
窗外的麻雀
在电线杆上多嘴
妳说这一句
很有夏天的感觉
手中的铅笔
在纸上来来回回
我用几行字形容妳是我的谁`;

const Production: React.FC = () => {
  return (
    <div className=" w-full h-full rounded p-5 ">
      <Title level={3}>音乐生产</Title>
      <div className="flex justify-center items-center overflow-auto">
        <LyricEditor
          initialContent={content
            .split('\n')
            .map((text) => ({ type: 'text', children: [{ text }] }))}
          initialPlayUrl="https://zz123.com/xplay/?act=songplay&id=ukdav"
        />
      </div>
    </div>
  );
};

export default Production;
