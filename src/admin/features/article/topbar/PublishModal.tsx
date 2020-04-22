import "react-datepicker/dist/react-datepicker.css";

import React, { Component, useState } from "react";
import { WithNamespaces, translate } from "react-i18next";

import { Button } from "../../../components/button";
import DatePicker from "react-datepicker";
import Input from "../../../components/input";
import ModalHoc from "../../../components/modal";
import PostActions from "../PostActions";
import { notify } from "react-notify-toast";
import styled from "styled-components";

const StyledBody = styled.div`
  .grid {
    height: calc(100vh - 248px);
  }
`;

interface IProps extends WithNamespaces {
  onClose: () => void;
  publishNow: () => void;
}
interface IState {
  date: string;
  time: string;
}

const PublishModal: React.FC<IProps> = ({ t, onClose, publishNow }) => {
  const { scheduledAt } = PostActions.getData();
  const date = scheduledAt ? new Date(scheduledAt) : new Date();
  const [startDate, setStartDate] = useState(date);

  const publishLater = async () => {
    PostActions.setDraft({
      scheduledAt: startDate,
    });
    await PostActions.updatePost();
    onClose();
  };
  let currentHour = new Date().getHours();
  const selectedDateIsToday = new Date().getDate() === startDate.getDate();
  if (!selectedDateIsToday) currentHour = 0;

  return (
    <ModalHoc confirm title="Publish Options" onClose={onClose}>
      <StyledBody className="modal-body text-center">
        <Button btnStyle="success" btnSize="lg" onClick={publishNow}>
          Publish Now
        </Button>
        <br />
        <br />
        <br />

        <p>Schedule for publishing later</p>
        <Container>
          <div>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              minDate={new Date()}
              showTimeSelect
              minTime={new Date(new Date().setHours(currentHour, 0, 0, 0))}
              maxTime={new Date(new Date().setHours(23, 59, 0, 0))}
              placeholderText="Select a date"
              dateFormat="MMMM d, yyyy - h:mm aa"
            />
            <br />
            <br />
            <Button btnStyle="" onClick={publishLater}>
              Publish Later
            </Button>
          </div>
        </Container>
      </StyledBody>
    </ModalHoc>
  );
};

export default translate("translations")(PublishModal);

const Container = styled.div`
  display: flex;
  justify-content: center;
  text-align: left;
  > div {
    text-align: center;
  }
  input {
    padding: 4px 8px;
    width: 200px;
    border: 1px solid var(--color-border);
    border-radius: 2px;
    font-size: 0.9rem;
  }
`;
