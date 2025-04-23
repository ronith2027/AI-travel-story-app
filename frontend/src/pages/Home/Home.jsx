import React, { useState, useEffect} from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../utils/axiosInstance";
import {MdAdd, MdOutlineDashboard} from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";
import Modal from "react-modal";
import TravelStoryCard from '../../components/Cards/TravelStoryCard';
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import EmptyCard from '../../components/Cards/EmptyCard';
import MapView from './MapView';

import { getEmptyCardData } from '../../utils/helper';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const  [allStories, setAllStories] = useState([]);

  const [searchQuery,setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');

  const [showMap, setShowMap] = useState(false);

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    date: null, 
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  //get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user){
        //set user info if data exists
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 400){
        // clear stoarge if unauthorised
        localStorage.clear;
        navigate("/login");
      }
    }
  };

  //get all travel stories
  const getAllTravelStories = async () => {
    try{
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories (response.data.stories);
      }
    } catch (error) {
    console.log("An unexpected error occurred. Please try again.");
    }
  }

  // handle edit story
  const handleEdit =(data) => {
    setOpenAddEditModal({ isShown: true, type:"edit", data: data});
  };

  // handle travel story click
  const handleViewStory = (data) => {
    setOpenViewModal({isShown: true, data});
  }

  // handle update favourite
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;

    try {
      const response=await axiosInstance.put(
        "/update-is-fav/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );

      if(response.data && response.data.story){
        if (response.data.story.isFavourite) {
          toast.success("Story pinned as favourite");
        } else {
          toast.error("Story unpinned from favourites");
        }

        if(filterType == "search" && searchQuery){
          onSearchStory(searchQuery);
        }else {
        getAllTravelStories();
        }
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
      }
  };

  //delete story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try{
      const response = await axiosInstance.delete("delete-story/" + storyId);

      if(response.data && !response.data.error){
        toast.error("story deleted successfully");
        setOpenViewModal((prevState) => ({...prevState, isShown: false}));
        getAllTravelStories();
      }
    }catch (error){
      console.log("unexpected error. try again");
      
      }
    
  };

  //searh story
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query,
        }
      });

      if (response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  }

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();

    return () => {};
  }, [])

  return (
    <>
      <Navbar 
        userInfo={userInfo}  
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
    
    {!showMap ? (
      <div className=" container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0? (      
              <div className="grid grid-cols-3 gap-4">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item.id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onClick={() =>handleViewStory(item)}
                      onFavouriteClick={() =>updateIsFavourite(item)}
                      />
                  );
                })}
              </div> 
            ) : (
              <EmptyCard
                imgSrc={getEmptyCardData(filterType).img}
                message={getEmptyCardData(filterType).message}
              />
            )}
          </div>  
                
          <div className="w-[60px]"></div>
        </div>
      </div>
     ) : (
      <MapView
        allStories={allStories}
        setOpenViewModal={setOpenViewModal} // Pass to map for showing ViewTravelStory
      />
    )}

      {/* add edit travel story*/}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditTravelStory 
         type={openAddEditModal.type}
         storyInfo={openAddEditModal.data}
         onClose={() => {
         setOpenAddEditModal({ isShown: false, type: "add", data: null });
         }}
         getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      {/* view travel story*/}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory storyInfo={openViewModal.data || null} 
           onClose={() => {
            setOpenViewModal((prevState) => ({...prevState, isShown: false }));
           }} 
           onEditClick={() => {
            setOpenViewModal((prevState) => ({...prevState, isShown: false }));
            handleEdit(openViewModal.data || null)
           }} 
           onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null);
            } } 
        />
        </Modal>


      <button className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10 z-50 shadow-lg"
         onClick={() => {
          setOpenAddEditModal({ isShown: true, type:"add", data: null});
         }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

           {/* Toggle Map/Dashboard Button */}
       <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-[200px] z-50 shadow-lg"
        onClick={() => setShowMap(!showMap)}
      >
        {showMap ? (
          <MdOutlineDashboard className="text-[32px] text-white" />
        ) : (
          <GrMapLocation className="text-[32px] text-white" />
        )}
      </button>

      <ToastContainer />
    </>
  );
};

export default Home