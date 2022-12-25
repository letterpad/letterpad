import Head from "next/head";
import { FC } from "react";

import { Row } from "@/components/builder/layouts/story-builder";

import { PageType } from "@/graphql/types";

import { useBuilderContext } from "./context";
import { EditSwitch } from "./toolbar/editSwitch";

interface Props {
  type: PageType;
  editable?: boolean;
}

export const Layout: FC<Props> = ({ editable = true }) => {
  const { grid } = useBuilderContext();
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&family=Bowlby+One+SC&family=Bungee+Inline&family=Caveat:wght@500;700&family=Farsan&family=Germania+One&family=Knewave&family=Major+Mono+Display&family=Merriweather:ital,wght@0,400;0,700;0,900;1,700&family=Metal+Mania&family=Nanum+Pen+Script&family=Niconne&family=PT+Sans:ital,wght@0,400;0,700;1,400&family=Potta+One&family=Raleway:ital,wght@0,400;0,500;0,800;1,500&family=Roboto:wght@400;500;900&family=Skranji&family=Spectral:ital,wght@0,400;0,500;0,700;0,800;1,500;1,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div id="creative">
        {editable && (
          <div className="flex justify-end p-4">
            <EditSwitch />
          </div>
        )}
        <div className="flex flex-col">
          {grid.map((row, rowIndex) => {
            const isPrevRowImageLeft =
              grid[rowIndex - 1]?.data[0]?.type === "image";
            return (
              <Row
                isPrevRowImageLeft={isPrevRowImageLeft}
                row={row}
                key={row.id}
                rowIndex={rowIndex}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Layout;
