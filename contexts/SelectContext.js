import React, { createContext } from 'react';

export const SelectContext = createContext({
    likes: [],
    dislikes: [],

    setLikes: ()=>{},
    setDislikes: ()=>{},
});