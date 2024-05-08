import React, { createContext } from "react";

export const MenuContext = createContext({
    name: '',
    category: '',
    like: false,
    dislike: false,
});