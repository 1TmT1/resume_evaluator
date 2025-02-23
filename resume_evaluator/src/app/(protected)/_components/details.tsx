"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CircularProgress } from "@heroui/progress";
import GetJobs from "./getJobs";
import toast from "react-hot-toast";
import { trimUntilBraces } from "@/lib/utils";

type DetailsProps = {
  cvDetails: string;
  setError: Dispatch<SetStateAction<boolean>>;
}

type PointsToImproveType = {
  suggestion: string;
  reason: string;
};

type CvDataType = {
  key_skills: string[];
  job_title: string;
  country: string;
  points_to_improve: PointsToImproveType[];
  cv_score: number;
}

export const Details = ({ cvDetails, setError }: DetailsProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [score, setScore] = useState(1);
  const [isHideDashboard, setIsHideDashboard] = useState(false);
  let cvData!: CvDataType;

  try {
    cvData = JSON.parse(trimUntilBraces(cvDetails));
  } catch {
    setError(true);
  }

  useEffect(() => {

    // Floating dashboard
    let isScrolling = false;

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(() => {
          const newScrollY = window.scrollY;
          setScrollY(newScrollY);
          isScrolling = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Score Animation
    const easeOut = (t: number) => Math.pow(t, 0.8);

    const scoreInterval = setInterval(() => {
      setScore((prevScore) => {
        if (prevScore >= cvData.cv_score) {
          clearInterval(scoreInterval);
          return cvData.cv_score;
        }

        const increment = (1 - easeOut(prevScore / cvData.cv_score)) * 20;
        return Math.min(prevScore + increment, cvData.cv_score);
      });
    }, 100);

    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsHideDashboard(false);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    // Clean event listener when component unmount
    return () => {
      clearInterval(scoreInterval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  });

  const floatingStyle = {
    transform: `translateY(${scrollY*1}px)`,
    willChange: `transform`,
    transition: `transform 0.1s ease-out`,
  };

  const changeDashboardStatus = () => {
    if (!isHideDashboard) {
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve('success');
          }, 2000);
        }),
        {
          loading: 'Open back from CV score section',
          success: <b>Closed Dashboard</b>,
      })
    }
    setIsHideDashboard(!isHideDashboard);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-wrap justify-center gap-6">
      {/* Sidebar */}
      <div style={{...floatingStyle}} className={`${isHideDashboard && "hidden"} w-full h-fit lg:w-[20vw] z-[2] bg-gray-800 text-white flex flex-col p-6 rounded-lg max-h-[60vh] lg:max-h-[calc(100vh-108.6px-4rem)]`}>
        <button onClick={changeDashboardStatus} title="Close Dashboard" className="lg:hidden absolute top-0 right-0 p-6 w-10 h-10 bg-red-600 rounded-lg m-4 flex justify-center items-center hover:bg-red-500 duration-300">
          <span className="text-4xl">&times;</span>
        </button>
        <h2 className="text-center text-3xl font-semibold mb-6">Dashboard</h2>
        <div className="text-lg font-semibold mb-4">Job Title: {cvData?.job_title ? cvData.job_title : 'Error'}</div>
        <div className="text-md mb-6">Country: {cvData?.country ? cvData.country : 'Error'}</div>
        <GetJobs jobTitle={cvData?.job_title ? cvData?.job_title : 'error'} location={cvData?.country ? cvData.country : 'error'} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="grid">
        {/* CV Score */}
        <div className="bg-white p-6 rounded-lg relative shadow-md border border-gray-200 mb-8">
          <button onClick={changeDashboardStatus} title="Open Dashboard" className={`${!isHideDashboard && "hidden"} lg:hidden absolute top-0 right-0 p-6 w-10 h-10 bg-blue-600 rounded-lg m-4 flex justify-center items-center hover:bg-blue-500 duration-300`}>
            <span className="text-3xl text-white">+</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center select-none">CV Score</h1>
          <div className="relative z-[1]  flex items-center justify-center">
          <CircularProgress 
            aria-label="Loading..."
            classNames={{
              svg: "w-64 h-64 drop-shadow-md",
              indicator: `stroke-green-400`,
              track: "stroke-white/10",
            }}
            value={score}
            showValueLabel={false}
          />
          <p className="text-center text-6xl select-none drop-shadow-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {cvData?.cv_score ? cvData.cv_score : 0}
          </p>
          </div>
        </div>
        {/* Key Skills Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Key Skills & Improvements</h2>
          {/* <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Skills</h2> */}
          <ul className="text-gray-700 list-none grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 auto-rows-fr gap-4">
            {cvData?.key_skills ? cvData.key_skills.map((skill, index) => (
              // index < 3 ?
              <li key={index} className={`flex justify-center items-center text-center rounded-xl bg-slate-200 hover:bg-slate-300 duration-300 select-none`}>
                <a href={`https://www.google.com/search?q=${skill}`} className="w-full h-full p-4" target="_blank">{skill}</a>
              </li>
              //:
              // <li key={index}>{skill}</li>
            )) : <li key={1}>Error...</li>}
          </ul>
        </div>
        </div>

        {/* Points to Improve Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Points to Improve CV</h2>
          {cvData?.points_to_improve ? cvData.points_to_improve.map((point, index) => (
            <div key={index} className="mb-6">
              <div className="font-semibold text-gray-700 mb-2">Suggestion:</div>
              <p className="text-gray-600 mb-2">{point.suggestion}</p>
              <div className="font-semibold text-gray-700 mb-2">Reason:</div>
              <p className="text-gray-600 mb-2">{point.reason}</p>
              <div className="w-full border-2"></div>
            </div>
          )) : <div key={2}>Error</div>}
        </div>
      </div>
    </div>
  );
};
