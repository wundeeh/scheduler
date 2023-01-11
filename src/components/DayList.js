import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {

  const daysArr = props.days

  return (
    <ul>
      {daysArr.map((day) =>
        <DayListItem 
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === props.value}
        setDay={props.onChange}
        />
      )}
    </ul>
  );
}