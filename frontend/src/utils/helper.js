import emptyImg from '../assets/images/empty.svg';
import foundImg from '../assets/images/found.svg';


export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials = (name) => {
    if (!name) return "";

    const words = name.split(" ");
    let initials = "";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words [i][0];
    }
    
    return initials.toUpperCase();
};

export const getEmptyCardData = (filterType) => {
  if (filterType === 'search') {
    return {
      message: "Oops! No stories found matching your search.",
      img: foundImg
    };
  } else {
    return {
      message: "Click the 'Add' button to Start creating your first Travel Story!",
      img: emptyImg
    };
  }
};