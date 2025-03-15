import { SummaryCard } from "@/components/cards/SummaryCard";
import React from "react";
import { BsTruck } from "react-icons/bs";
import { FaCommentDots } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { MdOutlineSpeakerNotes, MdOutlineSpeakerNotesOff } from "react-icons/md";

const Summaries = () => {
  const data = [
    {
      title: "Orders",
      icon: <BsTruck />,
      value: 5,
    },
    {
      title: "Reviews",
      icon: <MdOutlineSpeakerNotes />,
      value: 5,
    },
    {
      title: "Yet to Review",
      icon: <MdOutlineSpeakerNotesOff />,
      value: 5,
    },
    {
      title: "Unread",
      icon: <GoBell />,
      value: 5,
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
