import React, { useState, useEffect, useRef } from 'react';
import 'emoji-picker-element';

const Emoji = ({ onEmojiSelect }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    if (showPicker && pickerRef.current) {
      const picker = pickerRef.current;
      const handleEmojiClick = (event) => {
        const emoji = event.detail.unicode;
        if (onEmojiSelect) {
          onEmojiSelect(emoji);
        }
        setShowPicker(false); // Hide the picker after selection
      };
      picker.addEventListener('emoji-click', handleEmojiClick);
      return () => {
        picker.removeEventListener('emoji-click', handleEmojiClick);
      };
    }
  }, [showPicker, onEmojiSelect]);

  return (
    <div className="emoji-container" style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onClick={() => setShowPicker(!showPicker)}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
          <svg className='click-emoji' width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 11.5918C15.8978 11.5918 16.2794 11.4338 16.5607 11.1525C16.842 10.8712 17 10.4896 17 10.0918C17 9.69397 16.842 9.31244 16.5607 9.03114C16.2794 8.74983 15.8978 8.5918 15.5 8.5918C15.1022 8.5918 14.7206 8.74983 14.4393 9.03114C14.158 9.31244 14 9.69397 14 10.0918C14 10.4896 14.158 10.8712 14.4393 11.1525C14.7206 11.4338 15.1022 11.5918 15.5 11.5918ZM10 10.0918C10 10.4896 9.84196 10.8712 9.56066 11.1525C9.27936 11.4338 8.89782 11.5918 8.5 11.5918C8.10218 11.5918 7.72064 11.4338 7.43934 11.1525C7.15804 10.8712 7 10.4896 7 10.0918C7 9.69397 7.15804 9.31244 7.43934 9.03114C7.72064 8.74983 8.10218 8.5918 8.5 8.5918C8.89782 8.5918 9.27936 8.74983 9.56066 9.03114C9.84196 9.31244 10 9.69397 10 10.0918ZM6.328 15.7218C6.49192 15.6102 6.69335 15.5681 6.88825 15.6046C7.08314 15.6412 7.25564 15.7534 7.368 15.9168L7.377 15.9288L7.421 15.9878C7.463 16.0418 7.531 16.1238 7.624 16.2258C7.811 16.4288 8.096 16.7058 8.482 16.9828C9.25 17.5358 10.412 18.0918 12 18.0918C13.588 18.0918 14.75 17.5358 15.518 16.9828C15.904 16.7058 16.19 16.4288 16.376 16.2258C16.4634 16.1309 16.5462 16.0317 16.624 15.9288L16.631 15.9188C16.7431 15.7544 16.9158 15.6412 17.1113 15.6041C17.3069 15.5671 17.5091 15.6092 17.6735 15.7213C17.8379 15.8334 17.9511 16.0061 17.9882 16.2016C18.0252 16.3971 17.9831 16.5994 17.871 16.7638L17.869 16.7648V16.7668L17.866 16.7698L17.859 16.7798L17.837 16.8108L17.761 16.9108C17.6716 17.0238 17.5783 17.1335 17.481 17.2398C17.1529 17.5966 16.7886 17.9183 16.394 18.1998C15.424 18.8988 13.962 19.5918 12 19.5918C10.038 19.5918 8.576 18.8978 7.606 18.2008C7.21096 17.9187 6.84633 17.5963 6.518 17.2388C6.3852 17.0924 6.25971 16.9396 6.142 16.7808L6.134 16.7708L6.132 16.7668L6.131 16.7648L6.13 16.7638C6.01808 16.5994 5.97607 16.3972 6.0132 16.2018C6.05033 16.0064 6.16357 15.8337 6.328 15.7218ZM12 0.591797C5.373 0.591797 0 5.9648 0 12.5918C0 19.2188 5.373 24.5918 12 24.5918C18.627 24.5918 24 19.2188 24 12.5918C24 5.9648 18.627 0.591797 12 0.591797ZM1.5 12.5918C1.5 6.7928 6.201 2.0918 12 2.0918C17.799 2.0918 22.5 6.7928 22.5 12.5918C22.5 18.3908 17.799 23.0918 12 23.0918C6.201 23.0918 1.5 18.3908 1.5 12.5918Z" fill="black"/>
          </svg>
      </div>
      {showPicker && (
        <div className="emoji-picker-popup" style={{ position: 'absolute', bottom: '100%', left: 0, zIndex: 10 }}>
          <emoji-picker ref={pickerRef}></emoji-picker>
        </div>
      )}
    </div>
  );
};

export default Emoji;
