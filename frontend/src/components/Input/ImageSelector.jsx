import React, {useEffect, useRef, useState} from 'react'
import { FaRegFileImage } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';

const ImageSelector = ({image, setImage, handleDeleteImg}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file){
      setImage(file);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const handleRemoveImage =() => {
    setImage(null);
    handleDeleteImg();
  };

  useEffect(() => {
   // img prop is string
    if(typeof image === 'string'){
      setPreviewUrl(image);
    } else if (image){
     // img prop is object
      setPreviewUrl(URL.createObjectURL(image));
    } else{

      setPreviewUrl(null);
    }
  
    return () => {
      if (previewUrl && typeof previewUrl === 'string' && !image){
        URL.revokeObjectURL(previewUrl);
      }
    }
  }, [image])
  

  return (
    <div>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleImageChange}
          className='hidden'
        />

        {!image ? (
          <button 
          className="w-[600px] h-[220px]  flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50" 
          onClick={() => onChooseFile()}
        >
            <div className="">
                <FaRegFileImage className="text-xl text-cyan-500" />
            </div>

            <p classNmae="text-sm text-slate-500">Browse Image files </p>
        </button>
        ) : (
        <div className="relative flex justify-center">
          <img src={previewUrl} alt="selected" className="w-[600px] h-[338px] object-cover rounded-lg" />

          <buttton 
             className="btn-small btn-delete absolute top-2 right-2"
             onClick={handleRemoveImage}
          > Delete Image
            <MdDeleteOutline className="text-lg" />
          </buttton>
        </div>
        )}
    </div>
  )
}

export default ImageSelector