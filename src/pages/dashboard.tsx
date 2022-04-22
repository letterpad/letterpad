import { basePath } from "@/constants";
import { useState, useEffect } from "react";
import { PageHeader, Table } from "antd";
import { Divider, Select, Tag, Card } from "antd";
import Head from "next/head";
import { Content } from "antd/lib/layout/layout";
import { Statistic, Row, Col } from "antd";
import { useMeQuery } from "@/__generated__/queries/queries.graphql";

const { Option } = Select;

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

  const pageViews = data.stats?.pageviews;
  const visitors = data.stats?.uniques;
  const bounces = data.stats?.bounces;
  const totalTime = data.stats?.totaltime;
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
          <Select
            defaultValue={days}
            style={{ width: 120 }}
            onChange={setDays}
            loading={loading}
          >
            <Option value={0}>Today</Option>
            <Option value={1}>Yesterday</Option>
            <Option value={7}>Last Week</Option>
            <Option value={14}>Last 2 weeks</Option>
            <Option value={30}>Last 1 Month</Option>
            <Option value={90}>Last 3 Months</Option>
          </Select>
          <Divider />
          <Row gutter={16}>
            <Box title="Views" item={pageViews} />
            <Box title="Visitors" item={visitors} />
            <Box title="Bounces" item={bounces} />
            <Box title="Total time" item={totalTime} unit="s" />
          </Row>
          <Divider />
          <Table dataSource={data.urlView} columns={cols} pagination={false} />
        </div>
      </Content>
    </div>
  );
};
export default Metrics;

const Box = ({ title, item, unit = "" }) => {
  return (
    <Col span={12} md={{ span: 6 }}>
      <Card style={{ textAlign: "center" }}>
        <Statistic
          title={title}
          value={item.value + unit}
          valueStyle={{ fontSize: "3em" }}
        />
        <Tag color={item.change >= 0 ? "lime" : "magenta"}>
          {item.change >= 0 ? "+" : "-"}
          {item.change + unit}
        </Tag>
      </Card>
    </Col>
  );
};
