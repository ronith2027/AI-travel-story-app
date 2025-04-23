import React, {useState} from 'react'
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from 'react-icons/md';
import DateSelector from '../../components/Input/DateSelector';
import ImageSelector from '../../components/Input/ImageSelector';
import TagInput from '../../components/Input/TagInput';
import axiosInstance from "../../utils/axiosInstance";
import moment from 'moment';
import { toast } from 'react-toastify';
import uploadImage from '../../utils/uploadImage';
import { GoogleGenerativeAI } from "@google/generative-ai";

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo ?.title || "") ;
  const [storyImg, setStoryImg] = useState(storyInfo ?.imageUrl || null) ;
  const [story, setStory] = useState(storyInfo ?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(storyInfo ?.visitedLocation || []);
  const [visitedDate, setVisitedDate] = useState(storyInfo ?.visitedDate || null);
  const [isImproving, setIsImproving] = useState(false);
  const [error,setError] = useState("")

   // AI improvement function
   const improveStoryWithAI = async () => {
    setIsImproving(true);
    const previousStory = story;

    setStory(""); // Clear existing story during improvement

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

      const textPrompt = "Please rewrite and enhance this travel story:";
      const inputForAI = `${textPrompt}\n\n${story}`;

      const result = await model.generateContentStream(inputForAI);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        setStory((prevStory) => prevStory + chunkText); // Append streamed chunks
      }

      toast.success("Story improved successfully");
    } catch (error) {
      console.error("Failed to improve story:", error);
      setStory(previousStory);
      toast.error("Failed to improve story");
    } finally {
      setIsImproving(false);
    }
  };


  // add new travel story
  const addNewTravelStory = async () => {
    try{
      let imageUrl = "";

      // upload image
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        // get img url
        imageUrl = imgUploadRes.imageUrl || "";
      }

    const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate 
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      if(response.data && response.data.story){
        toast.success("Story added successfully");
        //refresh stories
        getAllTravelStories();
        //close form
        onClose();
      }  
    } catch (error){
         if( 
          error.response && 
          error.response.data && 
          error.response.data.message 
      ){
        setError(error.response.data.message);
      } else{
        setError("unexpected error. try again");
      }
    }
  }


  // update travel story
  const updateTravelStory = async () => {
     const storyId = storyInfo._id;

    try{
      let imageUrl = "";

      let postData =  {
        title,
        story,
        imageUrl: storyInfo.imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate 
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      }

      if(typeof storyImg === "object"){
        //upload new image
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";

        postData ={
          ...postData,
          imageUrl: imageUrl,
        };
      }


    const response = await axiosInstance.put("/edit-story/" + storyId, postData );

      if(response.data && response.data.story){
        toast.success("Story Updated successfully");
        //refresh stories
        getAllTravelStories();
        //close form
        onClose();
      }  
    } catch (error){
         if( 
          error.response && 
          error.response.data && 
          error.response.data.message 
      ){
        setError(error.response.data.message);
      } else{
        setError("unexpected error. try again");
      }
    }
  };

    const handleAddOrUpdateClick = () => {
      console.log("input data:", {title, storyImg, story, visitedLocation, visitedDate})

      if(!title){
        setError("please enter title");
        return;
      }

      if(!story){
        setError("please enter story");
        return;
      }

      setError("")

      if(type === "edit"){
        updateTravelStory();
      }else {
        addNewTravelStory();
      }
    };

    // delete story image and update story
  const handleDeleteStoryImg = async () => {
    const deleteImgRes = await axiosInstance.delete("/delete-image", {
      params: {
        imageUrl: storyInfo.imageUrl,
      },
    });

    if(deleteImgRes.data){
      const storyId = storyInfo._id;

      const postData ={
        title,
        story,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl: "",
      };

      //update story
      const response = await axiosInstance.put("/edit-story" + storyId, postData);

      setStoryImg(null);
    }
  };

  return ( 
    <div>
        <div className="flex items-center justify-between">
            <h5 className="text-xl font-medium text-slate-700">
               {type === "add" ? "Add Story" : "Upadte Story"} 
            </h5>

            <div>
                <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
                    {type === 'add' ?(
                     <button className="btn-small" onClick={handleAddOrUpdateClick}>
                        <MdAdd className="text-lg" /> ADD STORY
                    </button> 
                    ) :(
                     <>
                    <button className="btn-small" onClick={handleAddOrUpdateClick}>
                        <MdUpdate className="text-lg" /> UPDATE STORY
                    </button>
                    </>
                    )}

                    <button className='' onClick={onClose}>
                      <MdClose className="text-xl text-slate-400" />
                    </button>
                </div>

                {error && (
                  <p className="text-red-500 text-s pt-2 text-right">{error}</p>
                )}
            </div>
        </div>

        <div>
            <div className="flex-1 flex flex-col gap-2 pt-4">
                <label> TITLE</label>
                <input 
                  type="text"
                  className="text-2xl text-slate-950 outline-none"
                  placeholder="A Day at Bengaluru Traffic"
                  value={title}
                  onChange={({ target }) => setTitle(target.value)}
                />

                <div className="my-3">
                   <DateSelector date={visitedDate} setDate={setVisitedDate}/> 
                </div>
                
                <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteStoryImg} />
              
                <div className="flex flex-col gap-2 mt-4">
                    <label className='input-label'>STORY</label>
                    <textarea
                      type="text"
                      className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                      placeholder="Your Story"
                      rows={15}
                      value={story}
                      onChange={({ target }) => setStory(target.value)}
                    />
                    <div className="flex justify-end">
                        <button className="btn-small" onClick={improveStoryWithAI} disabled={isImproving}>
                             {isImproving ? "generating..." : <><MdAdd className="text-lg" /> IMPROVE WITH AI</>}
                         </button>
                    </div>
                </div>

                <div className="pt-3">
                  <label className="input-label">Visited Locations</label>
                 {/* <TagInput tags={visitedLocation} setTags={setVisitedLocation} />*/}
                 <TagInput
                  tags={visitedLocation.map((loc) => loc.location)} // Pass only location names
                  setTags={(newTags) =>
                    setVisitedLocation((prev) =>
                      newTags.map((location, index) => ({
                        ...prev[index],
                        location, // Update only the location field
                      }))
                    )
                  }
                />
                </div>
            </div>
        </div>
    </div>
  );
};

export default AddEditTravelStory