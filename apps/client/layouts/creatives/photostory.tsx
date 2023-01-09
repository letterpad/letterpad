import { PageFragmentFragment } from 'letterpad-sdk';
import dynamic from 'next/dynamic';
import { FC, ReactNode, useEffect, useState } from 'react';
import { Parallax } from 'react-parallax';

import { GalleryModal } from '@/components/gallery';
import { Portal } from '@/components/portal';

import { MasonryGrid } from './masonry/grid';
import { isLastImage } from './masonry/selectors';
import { BlockItem } from './types';

const ReactStickyBox = dynamic(() => import('react-sticky-box'), {
  ssr: false,
});

interface Props {
  data: PageFragmentFragment;
}
export const PhotoStory: FC<Props> = ({ data }) => {
  const page_data: BlockItem[] = JSON.parse(data.page_data ?? '').rows;

  return (
    <>
      {page_data.map((item: any, rowIndex: number) => {
        const columns = Array.from({ length: item.columns }, (_, i) => i);
        return (
          <div
            key={rowIndex}
            data-cover={item.cover}
            data-row={rowIndex}
            className={
              'relative flex flex-1  lg:flex-row ' +
              (item.data[1]?.type === 'image'
                ? 'flex-col-reverse'
                : 'flex-col ')
            }
          >
            {columns.map((col, colIndex) => {
              const _item = item.data[col];
              return (
                <div
                  className="relative flex w-full justify-center align-middle"
                  style={{ backgroundColor: _item.bgColor }}
                  key={rowIndex + colIndex}
                >
                  <SectionImage
                    columns={item.columns}
                    item={_item}
                    cover={item.cover}
                    rowIndex={rowIndex}
                  />
                  <SectionText
                    columns={item.columns}
                    text={_item?.text}
                    type={_item.type}
                    cover={item.cover}
                  />
                  <SectionMasonry item={_item} position={[rowIndex]} />
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

const SectionImage: FC<any> = ({ columns, item, rowIndex, cover }) => {
  const { image, type } = item;

  useEffect(() => {
    const div = document.querySelector(`.row-${rowIndex}`) as HTMLDivElement;
    div?.style.setProperty('min-height', getHeight(cover) + 'px');
  }, [cover, rowIndex]);

  if (type !== 'image') return null;
  const className = 'w-full';

  return (
    <ReactStickyBox
      data-background
      style={{
        height: getHeight(cover),
      }}
      className={`${className} flex w-full items-center justify-center bg-cover bg-center bg-no-repeat row-${rowIndex}`}
    >
      <Parallax
        strength={300}
        lazy={true}
        bgImage={image?.src}
        className="flex h-full w-full flex-col items-center justify-center"
        bgImageStyle={{ height: '100%', objectFit: 'cover' }}
        style={{
          minHeight: getHeight(cover),
        }}
        contentClassName="w-full"
      >
        <Wrapper className="w-full">
          <div
            className={
              columns == 2
                ? 'margin-auto w-full max-w-full lg:max-w-[calc(500px)]'
                : 'z-[2] w-full'
            }
            dangerouslySetInnerHTML={{
              __html: decodeURIComponent(item?.text ?? ''),
            }}
          />
        </Wrapper>
      </Parallax>
      {rowIndex === 0 && (
        <div
          className={'dots'}
          style={{
            backgroundSize: '3px 3px',
            backgroundColor: item?.image?.pattern?.background ?? '',
            backgroundImage: `radial-gradient(${item?.image?.pattern?.gradientStart}, ${item?.image?.pattern?.gradientEnd})`,
          }}
        ></div>
      )}
    </ReactStickyBox>
  );
};

const SectionText: FC<any> = ({ columns, text, type }) => {
  if (type !== 'text') return null;
  if (!text) return null;

  return (
    <div
      data-text
      className={
        'my-20 flex w-full flex-col items-center justify-center p-6 text-center leading-6 text-gray-800 dark:text-white ' +
        (columns == 2 ? ' max-w-full lg:max-w-[calc(500px)]' : ' w-full ')
      }
      dangerouslySetInnerHTML={{
        __html: decodeURIComponent(text),
      }}
    />
  );
};

export const SectionMasonry: FC<{
  item: BlockItem;
  position: [rowIndex: number];
}> = ({ item, position }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [rowIndex] = position;

  useEffect(() => {
    disableScroll(selectedIndex > 0);
  }, [selectedIndex]);

  const onImageChange = (index: number) => {
    if (isLastImage(item.masonry || [], index)) {
      return setSelectedIndex(0);
    }
    if (index < 0) {
      return setSelectedIndex((item.masonry ?? []).length - 1);
    }
    setSelectedIndex(index);
  };

  const onSelect = (idx: number) => {
    setSelectedIndex(idx);
  };

  if (item.type !== 'masonry' || !item.masonry) return null;

  return (
    <Wrapper className={`row-${rowIndex} lg:py-0`}>
      <MasonryGrid items={item.masonry ?? []} onSelect={onSelect} />
      <div className="modal">
        <Portal id="modal-creatives">
          <GalleryModal
            items={item.masonry ?? []}
            onSelect={onImageChange}
            index={selectedIndex}
            onClose={() => setSelectedIndex(-1)}
          />
        </Portal>
      </div>
    </Wrapper>
  );
};

const Wrapper: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={
        'margin-auto px:10 flex h-full w-full flex-col items-center justify-center p-6 py-20 text-center leading-6 text-gray-800 dark:text-white lg:px-40 ' +
        className
      }
    >
      {children}
    </div>
  );
};

const getHeight = (size: 'small' | 'big') => {
  const h = typeof window !== 'undefined' ? window.innerHeight : 600;

  if (size === 'small') return h * 0.4;
  if (size === 'big') return h;
  if (size === 'banner') return 200;
  return h;
};

export const disableScroll = (flag: boolean) => {
  if (flag) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'scroll';
  }
};
