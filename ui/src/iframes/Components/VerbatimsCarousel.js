/* eslint-disable no-undef */
import "swiper/css";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { useEffect, useState } from "react";
import { Controller, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Quote from "../../assets/icons/quote.svg";
import ThumbsUpFill from "../../assets/icons/thumbs-up-fill.svg";
import ThumbsUpLine from "../../assets/icons/thumbs-up-line.svg";
import useBreakpoints from "../../hooks/useBreakpoints";
import usePatchVerbatimFeedback from "../../hooks/usePatchVerbatimFeedback";
import { etablissementLabelGetterFromFormation } from "../../utils/etablissement";
import {
  ApprentiInfo,
  CarouselContainer,
  FeedbackContainer,
  NavigationContainer,
  PaginationContainer,
  VerbatimContainer,
  VerbatimContent,
} from "./shared.style";

export const VerbatimsCarousel = ({ verbatims, setVerbatimsStep }) => {
  const [swiperControl, setSwiperControl] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [usefullFeedback, setUsefullFeedback] = useState(() => {
    const savedFeedback = localStorage.getItem("usefullFeedback");
    return savedFeedback ? JSON.parse(savedFeedback) : [];
  });
  const { isMobile, isDesktop } = useBreakpoints();

  const { mutate: patchVerbatimFeedback, patchedVerbatimFeedback } = usePatchVerbatimFeedback();

  useEffect(() => {
    localStorage.setItem("usefullFeedback", JSON.stringify(usefullFeedback));
  }, [usefullFeedback]);

  if (!verbatims.length) return null;

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleUsefullFeedback = (id) => {
    if (usefullFeedback.includes(id)) {
      patchVerbatimFeedback({ verbatimId: id, isUseful: false });
      setUsefullFeedback(usefullFeedback.filter((item) => item !== id));
    } else {
      patchVerbatimFeedback({ verbatimId: id, isUseful: true });
      setUsefullFeedback([...usefullFeedback, id]);
    }
  };

  return (
    <Swiper
      rewind={true}
      spaceBetween={isMobile ? 20 : 15}
      slidesPerView={isMobile ? 1.3 : 1.3}
      centeredSlides={true}
      modules={[Controller, Keyboard]}
      controller={{ control: swiperControl }}
      keyboard={{
        enabled: true,
      }}
      onSwiper={(swiper) => setSwiperControl(swiper)}
      onSlideChange={() => {
        setActiveIndex(swiperControl.activeIndex);
        setExpandedIndex(null);
      }}
    >
      <CarouselContainer>
        {verbatims.map((verbatim, index) => (
          <SwiperSlide
            key={index}
            onClick={() =>
              index !== activeIndex
                ? index > activeIndex
                  ? swiperControl.slideNext()
                  : swiperControl.slidePrev()
                : null
            }
          >
            <VerbatimContainer isDesktop={isDesktop}>
              <img src={Quote} aria-hidden={true} />
              <VerbatimContent>
                {expandedIndex === index
                  ? `« ${verbatim.content} »`
                  : `« ${verbatim.content.substring(0, 230)}${verbatim.content.length > 230 ? "..." : ""} »`}
                {verbatim.content.length > 230 && (
                  <>
                    <br />
                    <span onClick={() => toggleExpand(index)}>
                      {expandedIndex === index ? " Voir moins" : " Voir plus"}
                    </span>
                  </>
                )}
              </VerbatimContent>
              <ApprentiInfo>
                Apprenti·e du {etablissementLabelGetterFromFormation(verbatim)} -{" "}
                {new Date(verbatim.createdAt).toLocaleDateString("fr", { month: "long", year: "numeric" })}
              </ApprentiInfo>
              <FeedbackContainer onClick={() => handleUsefullFeedback(verbatim.id)}>
                Cet avis est utile ?{" "}
                <img
                  src={usefullFeedback.includes(verbatim.id) ? ThumbsUpFill : ThumbsUpLine}
                  alt="feedback avis utile"
                />
              </FeedbackContainer>
            </VerbatimContainer>
          </SwiperSlide>
        ))}
      </CarouselContainer>
      <NavigationContainer>
        <PaginationContainer>
          <Button
            aria-label="Précédent"
            iconId="fr-icon-arrow-left-s-line"
            priority="tertiary no outline"
            onClick={() => swiperControl.slidePrev()}
          />
          <p>
            {activeIndex + 1} sur {verbatims.length}
          </p>
          <Button
            aria-label="Suivant"
            iconId="fr-icon-arrow-right-s-line"
            priority="tertiary no outline"
            onClick={() => swiperControl.slideNext()}
          />
        </PaginationContainer>
        <Button priority="secondary" onClick={() => setVerbatimsStep(2)}>
          Voir plus de témoignages
        </Button>
      </NavigationContainer>
    </Swiper>
  );
};
