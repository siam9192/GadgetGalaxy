import { SummaryCard } from "@/components/cards/SummaryCard";
import { getMyOverviewData } from "@/services/overview.service";
import React from "react";
import { BsTruck } from "react-icons/bs";
import { GoBell } from "react-icons/go";
import { MdOutlineSpeakerNotes, MdOutlineSpeakerNotesOff } from "react-icons/md";

const Summaries = async () => {
  const resData = (await getMyOverviewData())?.data;
  const data = [
    {
      title: "Orders",
      icon: <BsTruck />,
      value: resData?.ordersTotal || 0,
    },
    {
      title: "Reviews",
      icon: <MdOutlineSpeakerNotes />,
      value: resData?.reviewsTotal || 0,
    },
    {
      title: "Yet to Review",
      icon: <MdOutlineSpeakerNotesOff />,
      value: resData?.notReviewedTotal || 0,
    },
    {
      title: "Unread",
      icon: <GoBell />,
      value: resData?.unreadNotificationsTotal || 0,
    },
  ];
  return (
    <section className="p-5 bg-white grid lg:grid-cols-4 grid-cols-2 gap-5">
      {data.map((item, index) => (
        <SummaryCard data={item} key={index} />
      ))}
    </section>
  );
};

export default Summaries;
