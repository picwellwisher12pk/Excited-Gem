"use client";

import { useState } from "react";
import Alert from "@/components/Alert";
import SmallCard from "@/components/SmallCard";
import Select from "@/components/Select";
import { smallCard } from "@/constant/smallCardData";
import Rating from "@/components/Rating/Rating";
import UploadingBox from "@/components/UploadingBox";
import { OptionsMenu } from "./OptionMenu";
import RecordVideo from "./recordVideo/RecordVideo";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import SliderBtn from "../SliderBtn";
import { ChevronLeft, ChevronRight } from "lucide-react";

import QualityCard from "./videoQuality/QualityCard";

interface CardProps {
  setRatingOpen: (ratingOpen: boolean) => void;
  ratingOpen: boolean;
}

export function CardContent({ ratingOpen, setRatingOpen }: CardProps) {
  const [alert, setAlert] = useState(true);
  const [screenshot, setScreenshot] = useState(false);
  const [recordVideo, setRecordVideo] = useState(false);
  const [videoQualityPage, setVideoQualityPage] = useState(false);
  const [webCam, setWebCam] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const smallCardData = recordVideo
    ? smallCard.slice(2, 6)
    : smallCard.slice(0, 3);

  const handleCardSelect = (text: string) => {
    setSelectedCard(text);
    if (!recordVideo) {
      if (text === "Entire Page") {
        setScreenshot(true);
      }
    } else {
      setWebCam(text === "Webcam");
    }
  };

  if (ratingOpen) {
    return <Rating setRatingOpen={setRatingOpen} />;
  }

  if (screenshot) {
    return (
      <div className='py-6'>
        <UploadingBox />
      </div>
    );
  }

  return (
    <div className='p-6 pt-0 relative'>
      {alert && <Alert handleClose={() => setAlert(false)} />}
      {recordVideo ? (
        <div className='py-6 relative'>
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={3}
            navigation={{ nextEl: "#next1", prevEl: "#prev1" }}
            className='!overflow-visible '
          >
            <SliderBtn
              icon={<ChevronRight size={18} className='text-dark !fill-none' />}
              id='next1'
              className='right-0 h-6 w-6'
            />
            {smallCardData.map((item, i) => (
              <SwiperSlide key={i}>
                <SmallCard
                  recordVideo={recordVideo}
                  setWebCam={setWebCam}
                  setScreenShot={setScreenshot}
                  icon={item.icon}
                  text={item.name}
                  content={item.key}
                  isSelected={recordVideo && selectedCard === item.name}
                  onSelect={handleCardSelect}
                />
              </SwiperSlide>
            ))}
            <SliderBtn
              icon={<ChevronLeft size={18} className='text-dark !fill-none' />}
              id='prev1'
              className='left-[-9px] h-6 w-6'
            />
          </Swiper>
        </div>
      ) : videoQualityPage ? (
        ""
      ) : (
        <div className='py-6 grid grid-cols-3 gap-3'>
          {smallCardData.map((item, i) => (
            <SmallCard
              recordVideo={recordVideo}
              setWebCam={setWebCam}
              key={i}
              setScreenShot={setScreenshot}
              icon={item.icon}
              text={item.name}
              content={item.key}
              isSelected={!recordVideo && selectedCard === item.name}
              onSelect={handleCardSelect}
            />
          ))}
        </div>
      )}

      {!recordVideo && !videoQualityPage && (
        <>
          <OptionsMenu setRecordVideo={setRecordVideo} />
          <div className='pt-6'>
            <Select />
          </div>
        </>
      )}
      {recordVideo && (
        <>
          <RecordVideo
            setRecord={setRecordVideo}
            webCam={webCam}
            setVideoQualityPage={setVideoQualityPage}
          />
          <QualityCard card={videoQualityPage} setCard={setVideoQualityPage} />
        </>
      )}
    </div>
  );
}
