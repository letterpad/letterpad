import { basePath } from "@/constants";
import { useState, useEffect } from "react";
import { PageHeader, Table } from "antd";
import { Divider, Tag, Card } from "antd";
import Head from "next/head";
import { Content } from "antd/lib/layout/layout";
import { Statistic, Row, Col } from "antd";
import { useMeQuery } from "@/__generated__/queries/queries.graphql";
import {
  formatLongNumber,
  formatNumber,
  formatShortTime,
} from "@/utils/format";
import { LoadingOutlined } from "@ant-design/icons";

const cols = [
  {
    title: "Slug",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Views",
    dataIndex: "y",
    key: "y",
  },
];
const defaultValue = { value: 0, change: 0 };
const Metrics = () => {
  const meResult = useMeQuery({
    variables: {},
  });

  const [data, setData] = useState({
    urlView: [],
    stats: {
      pageviews: defaultValue,
      uniques: defaultValue,
      bounces: defaultValue,
      totaltime: defaultValue,
    },
  });
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [days, meResult.data]);

  const fetchData = async (d = days) => {
    if (meResult.data?.me?.__typename !== "Author") return;
    setLoading(true);
    try {
      const res = await fetch(
        basePath +
          `/api/analytics?websiteId=${meResult.data?.me.analytics_id}&days=` +
          d,
      );
      const json = await res.json();
      setData(json);
    } catch (e) {
      //
    }
    setLoading(false);
  };

  const { pageviews, uniques, bounces, totaltime } = data.stats || {};
  const num = Math.min(data && uniques.value, data && bounces.value);
  const diffs = data && {
    pageviews: pageviews.value - pageviews.change,
    uniques: uniques.value - uniques.change,
    bounces: bounces.value - bounces.change,
    totaltime: totaltime.value - totaltime.change,
  };

  const formatFunc = (n) =>
    n >= 0 ? formatLongNumber(n) : `-${formatLongNumber(Math.abs(n))}`;

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <PageHeader className="site-page-header" title="Analytics">
        <span className="help-text">Analytics of your blog.</span>
      </PageHeader>
      <Content>
        <div className="site-layout-background" style={{ padding: 24 }}>
          <select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setDays(Number(e.target.value))
            }
            value={days}
          >
            <option value={0}>Today</option>
            <option value={1}>Yesterday</option>
            <option value={7}>Last Week</option>
            <option value={14}>Last 2 weeks</option>
            <option value={30}>Last 1 Month</option>
            <option value={90}>Last 3 Months</option>
          </select>{" "}
          {loading && <LoadingOutlined />}
          <Divider />
          <Row gutter={16}>
            <Box
              title="Views"
              item={{
                value: pageviews.value,
                change: pageviews.change,
              }}
              format={formatFunc}
            />
            <Box
              title="Visitors"
              item={{
                value: uniques.value,
                change: uniques.change,
              }}
              format={formatFunc}
            />
            <Box
              title="Bounces"
              item={{
                value: uniques.value ? (num / uniques.value) * 100 : 0,
                change:
                  uniques.value && uniques.change
                    ? (num / uniques.value) * 100 -
                        (Math.min(diffs.uniques, diffs.bounces) /
                          diffs.uniques) *
                          100 || 0
                    : 0,
              }}
              format={(n) => Number(n).toFixed(0) + "%"}
            />
            <Box
              title="Average time"
              item={{
                value:
                  totaltime.value && pageviews.value
                    ? totaltime.value / (pageviews.value - bounces.value)
                    : 0,
                change:
                  totaltime.value && pageviews.value
                    ? (diffs.totaltime / (diffs.pageviews - diffs.bounces) -
                        totaltime.value / (pageviews.value - bounces.value)) *
                        -1 || 0
                    : 0,
              }}
              unit="s"
              format={(n) =>
                `${n < 0 ? "-" : ""}${formatShortTime(
                  Math.abs(~~n),
                  ["m", "s"],
                  " ",
                )}`
              }
            />
          </Row>
          <Divider />
          <Table dataSource={data.urlView} columns={cols} pagination={false} />
        </div>
      </Content>
    </div>
  );
};
export default Metrics;

const Box = ({ title, item, unit = "", format = formatNumber }) => {
  return (
    <Col span={12} md={{ span: 6 }}>
      <Card style={{ textAlign: "center" }}>
        <Statistic
          title={title}
          value={item.value + unit}
          valueStyle={{ fontSize: "3em" }}
        />
        <Tag color={item.change >= 0 ? "lime" : "magenta"}>
          {format(item.change)}
        </Tag>
      </Card>
    </Col>
  );
};
