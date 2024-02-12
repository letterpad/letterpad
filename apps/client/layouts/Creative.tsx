'use client';
import {
  MeFragmentFragment,
  PageFragmentFragment,
  SettingsFragmentFragment,
} from 'letterpad-sdk';
import Head from 'next/head';
import { BuilderContext, Layout } from 'ui';

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
          <Layout head={<CreativesHead />} editable={false} />
        </BuilderContext>
      </article>
    </>
  );
}

const CreativesHead = () => {
  return (
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin={'anonymous'}
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&family=Bowlby+One+SC&family=Bungee+Inline&family=Caveat:wght@500;700&family=Farsan&family=Germania+One&family=Knewave&family=Major+Mono+Display&family=Merriweather:ital,wght@0,400;0,700;0,900;1,700&family=Metal+Mania&family=Nanum+Pen+Script&family=Niconne&family=PT+Sans:ital,wght@0,400;0,700;1,400&family=Potta+One&family=Raleway:ital,wght@0,400;0,500;0,800;1,500&family=Roboto:wght@400;500;900&family=Skranji&family=Spectral:ital,wght@0,400;0,500;0,700;0,800;1,500;1,700&display=swap"
        rel="stylesheet"
      />
    </Head>
  );
};
