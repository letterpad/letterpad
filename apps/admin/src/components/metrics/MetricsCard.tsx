import { Col } from "antd";
import React from "react";
import { animated, useSpring } from "react-spring";

import styles from "./MetricCard.module.css";

import { formatNumber } from "@/utils/format";

const MetricCard = ({
  value = 0,
  change = 0,
  label,
  reverseColors = false,
  format = formatNumber,
  hideComparison = false,
}) => {
  const props = useSpring({ x: Number(value) || 0, from: { x: 0 } });
  const changeProps = useSpring({ x: Number(change) || 0, from: { x: 0 } });

  return (
    <Col>
      <div className="flex w-32 flex-col justify-center gap-8 text-gray-600 dark:text-gray-200">
        <animated.div className={styles.value}>
          {props.x.interpolate((x) => format(x))}
        </animated.div>
        <div className={styles.label}>
          {label}
          {~~change !== 0 && !hideComparison && (
            <animated.span
              className={`${styles.change} ${
                change >= 0
                  ? !reverseColors
                    ? styles.positive
                    : styles.negative
                  : !reverseColors
                  ? styles.negative
                  : styles.positive
              }`}
            >
              {changeProps.x.interpolate(
                (x) => `${change >= 0 ? "+" : ""}${format(x)}`,
              )}
            </animated.span>
          )}
        </div>
      </div>
    </Col>
  );
};

export default MetricCard;
