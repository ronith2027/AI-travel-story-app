import React, { useState } from "react";
import { MdOutlineDateRange, MdClose } from "react-icons/md";
import { DayPicker } from "react-day-picker";
import moment from "moment";

const DateSelector = ({ date, setDate }) => {
    const [openDatePicker, setOpenDatePicker] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpenDatePicker(prev => !prev)}
                className="inline-flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-200/40 hover:bg-sky-200/40 rounded px-3 py-1 cursor-pointer"
            >
                <MdOutlineDateRange className="text-lg" />
                {date ? moment(date).format("Do MMM YYYY") : moment().format("Do MMM YYYY")}
            </button>

            {openDatePicker && (
                <div className="bg-sky-50/80 rounded-lg relative w-[380px]">
                    <button
                        onClick={() => setOpenDatePicker(false)}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100 hover:bg-sky-100 absolute right-0 top-0"
                    >
                        <MdClose className="text-xl text-sky-600" />
                    </button>
                    <DayPicker
                        captionLayout="dropdown-buttons"
                        mode="single"
                        selected={date}
                        onSelect={selectedDate => {
                            setDate(selectedDate);
                            setOpenDatePicker(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default DateSelector;
