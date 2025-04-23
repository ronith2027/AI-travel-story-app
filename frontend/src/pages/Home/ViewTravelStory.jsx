import React from 'react'
import { GrMapLocation } from 'react-icons/gr';
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from 'react-icons/md';
import moment from 'moment';


const ViewTravelStory = ({
  storyInfo, 
  onClose, 
  onEditClick, 
  onDeleteClick
}) => {
  return (
    <div className="relative">
        <div className="flex items-center justify-end">
            <div>
                <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
                    <button className="btn-small" onClick={onEditClick}>
                        <MdUpdate className="text-lg" /> UPDATE STORY
                    </button>

                    <button className="btn-small btn-delete" onClick={onDeleteClick}>
                        <MdDeleteOutline className="text-lg" /> Delete
                    </button>
                
                    <button className='' onClick={onClose}>
                        <MdClose className="text-xl text-slate-400" />
                    </button>
                </div>
            </div>
        </div>

        <div>
            <div className="flex-1 flex flex-col gap-2 py-4">
                <h1 className="text-2xl text-slate-950">
                    {storyInfo && storyInfo.title}
                </h1>

                <div className="flex items-center justify-between gap-3">
                    <span className="text-xl text-slate-500">
                        {storyInfo && moment(storyInfo.visitedDate).format("Do MMM YYYY")}
                    </span>

                    <div className="inline-flex items-center gap-2 flex-wrap">
                        {storyInfo &&
                            storyInfo.visitedLocation.map((item, index) => (
                            <div
                                key={index}
                                className="inline-flex items-center gap-2 text-[18px] text-cyan-700 bg-cyan-300/40 rounded px-2 py-1"
                            >
                                <GrMapLocation className="text-sm" />
                                {item.location}
                            </div>
                        ))}
                   </div>

                </div>
              </div>
                <div className="flex justify-center items-center py-4">
                    <img
                    src={storyInfo && storyInfo.imageUrl}
                    alt="selected"
                    className="w-[650px] h-[366px] object-cover rounded-lg"
                    />
                </div>
            <div className="mt-4">
                <p className="text-lg text-slate-950 leading-6 text-justify whitespace-pre-line">{storyInfo.story}</p> 
            </div>
        </div>
    </div>
  );
};

export default ViewTravelStory