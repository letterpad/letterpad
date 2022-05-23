import { basePath } from "@/constants";
import { useState, useEffect } from "react";
import { PageHeader, Table } from "antd";
import { Divider } from "antd";
import Head from "next/head";
import { Content } from "antd/lib/layout/layout";
import { Row } from "antd";
import { useMeQuery } from "@/__generated__/queries/queries.graphql";
import { LoadingOutlined } from "@ant-design/icons";
import MetricsBar from "@/components/metrics/MetricsBar";

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
            <MetricsBar stats={data.stats} />
          </Row>
          <Divider />
          <Table dataSource={data.urlView} columns={cols} pagination={false} />
        </div>
      </Content>
    </div>
  );
};
export default Metrics;
