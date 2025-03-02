"use client"
import React, { useState, useEffect, useContext, createContext } from 'react';
import { createPortal } from 'react-dom';

type ToastTypes = "normal" | "error" | "success";

const ToastContext = createContext(({}: {text:string; type?:ToastTypes}) => {});
ToastContext.displayName = "ToastContext";

export const useToast = () => {
    return useContext(ToastContext);
}



export const ToastProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [visible, setVisible] = useState(false);
    const [toastText, setToastText] = useState("");
    const [toastType, setToastType] = useState<ToastTypes>("normal");

    const showToast = ({text, type}: {text:string; type?:ToastTypes}) => {
        setToastText(text);
        setToastType(type || "normal");
        setVisible(true);
        setTimeout(() => {
            setVisible(false);
        }, 3000);
    }

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <Toast visible={visible} toastType={toastType}>
                    {toastText}
                </Toast>
            {/* {createPortal(
                ,
                document.body
            )} */}
        </ToastContext.Provider>
    )
}



const Toast = ({children, visible, toastType}: {children:React.ReactNode;visible:boolean; toastType:ToastTypes}) => {
    const [isVisible, setIsVisible] = useState(visible);

    useEffect(() => {
        console.log("visible", visible);
        if (visible) {
            setIsVisible(true);
          const timer = setTimeout(() => {
            setIsVisible(false);
          }, 3000); // 3秒後に非表示
          return () => clearTimeout(timer);
        }
      }, [visible]);
    
      if (!isVisible) return null; // 非表示の場合は何も描画しない
    
      // トーストタイプに応じたスタイル
      const getToastStyle = () => {
        switch (toastType) {
          case 'success':
            return 'bg-green-500 text-white';
          case 'error':
            return 'bg-red-500 text-white';
          default:
            return 'bg-gray-500 text-white';
        }
      };
    
      return (
        <div
          className={`fixed top-0 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg flex justify-center items-center w-auto ${getToastStyle()}`}
        >
          <span>{children}</span>
        </div>
      );
    };