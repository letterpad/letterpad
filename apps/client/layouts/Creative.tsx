'use client';
import {
  MeFragmentFragment,
  PageFragmentFragment,
  SettingsFragmentFragment,
} from 'letterpad-sdk';
import Head from 'next/head';
import { BuilderContext, Layout } from 'ui';

import './creatives.css';

import ScrollTop from '../src/components/scroll-top';

interface Props {
  data: PageFragmentFragment;
  site_name: string;
  settings: SettingsFragmentFragment;
  me: MeFragmentFragment;
}
export default function Creative({ data, settings, me }: Props) {
  if (settings.__typename !== 'Setting') return null;
  if (me?.__typename !== 'Author' || data.author?.__typename !== 'Author')
    return null;

  return (
    <>
      <ScrollTop />
      <article>
        <BuilderContext
          data={JSON.parse(data.page_data ?? '').rows}
          onSave={() => null}
          FileExplorer={() => null}
          previewMode={true}
        >
          <Layout editable={false} />
        </BuilderContext>
      </article>
    </>
  );
}
