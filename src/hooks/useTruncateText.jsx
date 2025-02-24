import React from 'react'
export const useTruncateText = (text, maxLength) => {
    return text?.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};