/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
import "swiper/css";

import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { useEffect, useState } from "react";
import { Controller, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Quote from "../../assets/icons/quote-blue.svg";
import ThumbsUpFill from "../../assets/icons/thumbs-up-fill.svg";
import ThumbsUpLine from "../../assets/icons/thumbs-up-line.svg";
import useBreakpoints from "../../hooks/useBreakpoints";
import useMatomoEvent from "../../hooks/useMatomoEvent";
import usePatchVerbatimFeedback from "../../hooks/usePatchVerbatimFeedback";
import { MATOMO_ACTION, MATOMO_CATEGORY } from "../../matomo";
import { capitalizeFirstWord, etablissementLabelGetterFromFormation } from "../../utils/etablissement";
import {
  ApprentiInfo,
  CarouselContainer,
  FeedbackContainer,
  NavigationContainer,
  PaginationContainer,
  SeeMoreContainer,
  ThemeLabel,
  VerbatimContainer,
  VerbatimContent,
} from "./shared.style";

export const VerbatimsCarousel = ({ verbatims, setVerbatimsStep, intituleFormation }) => {
  const [swiperControl, setSwiperControl] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [usefullFeedback, setUsefullFeedback] = useState(() => {
    const savedFeedback = localStorage.getItem("usefullFeedback");
    return savedFeedback ? JSON.parse(savedFeedback) : [];
  });
  const { isMobile } = useBreakpoints();
  const trackEvent = useMatomoEvent();

  const MAX_CHAR = isMobile ? 150 : 150;

  const { mutate: patchVerbatimFeedback } = usePatchVerbatimFeedback();

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
      spaceBetween={isMobile ? 50 : 60}
      slidesPerView={"auto"}
      modules={[Controller, Keyboard]}
      controller={{ control: swiperControl }}
      keyboard={{
        enabled: true,
      }}
      onSwiper={(swiper) => setSwiperControl(swiper)}
      onSlideChange={(swiper) => {
        const realIndex = swiper.realIndex;
        setActiveIndex(realIndex);
        trackEvent(
          MATOMO_CATEGORY.IFRAME_FORMATION,
          realIndex > activeIndex ? MATOMO_ACTION.CLICK_CAROUSEL_NEXT : MATOMO_ACTION.CLICK_CAROUSEL_PREVIOUS,
          `${intituleFormation}`
        );
        if (realIndex !== activeIndex) {
          setExpandedIndex(null);
        }
      }}
    >
      <CarouselContainer isMobile={isMobile}>
        {verbatims.map((verbatim, index) => (
          <SwiperSlide
            key={`verbatim-${index}`}
            onClick={() =>
              index !== activeIndex
                ? index > activeIndex
                  ? swiperControl.slideNext()
                  : swiperControl.slidePrev()
                : null
            }
            style={{ width: "80%" }}
          >
            <VerbatimContainer isMobile={isMobile}>
              <ThemeLabel isMobile={isMobile}>
                <img src={Quote} aria-hidden="true" />
                {verbatim.questionLabel}
              </ThemeLabel>
              <VerbatimContent isMobile={isMobile}>
                {expandedIndex === index
                  ? `« ${verbatim.content} »`
                  : `« ${verbatim.content.substring(0, MAX_CHAR)}${verbatim.content.length > MAX_CHAR ? "..." : ""} »`}
                {verbatim.content.length > MAX_CHAR && (
                  <>
                    <br />
                    <span
                      onClick={() => {
                        toggleExpand(index);
                        trackEvent(
                          MATOMO_CATEGORY.IFRAME_FORMATION,
                          MATOMO_ACTION.CLICK_VERBATIM_SEE_MORE,
                          `${intituleFormation}`
                        );
                      }}
                    >
                      {expandedIndex === index ? "Voir moins" : "Voir plus"}
                    </span>
                  </>
                )}
              </VerbatimContent>
              <ApprentiInfo>
                Établissement : {capitalizeFirstWord(etablissementLabelGetterFromFormation(verbatim).toLowerCase())} -{" "}
                {new Date(verbatim.createdAt).toLocaleDateString("fr", {
                  month: "long",
                  year: "numeric",
                })}
              </ApprentiInfo>
              <FeedbackContainer
                onClick={() => {
                  handleUsefullFeedback(verbatim.id);
                  trackEvent(
                    MATOMO_CATEGORY.IFRAME_FORMATION,
                    MATOMO_ACTION.CLICK_USEFUL_VERBATIM,
                    `${intituleFormation}`
                  );
                }}
              >
                Cet avis est utile ?{" "}
                <img
                  src={usefullFeedback.includes(verbatim.id) ? ThumbsUpFill : ThumbsUpLine}
                  alt="feedback avis utile"
                />
              </FeedbackContainer>
            </VerbatimContainer>
          </SwiperSlide>
        ))}
        <SwiperSlide style={{ width: "70%" }}>
          <SeeMoreContainer
            isMobile={isMobile}
            onClick={() => {
              setVerbatimsStep(3);
              trackEvent(
                MATOMO_CATEGORY.IFRAME_FORMATION,
                MATOMO_ACTION.CLICK_CAROUSEL_SEE_MORE,
                `${intituleFormation}`
              );
            }}
          >
            <img src={Quote} aria-hidden="true" />
            <h6>Envie d'en lire davantage ?</h6>
            <p>Explorez les témoignages des apprentis classés selon différentes thématiques.</p>
            <div>
              <span className={fr.cx("fr-icon-arrow-right-line")} />
            </div>
          </SeeMoreContainer>
        </SwiperSlide>
      </CarouselContainer>
      <NavigationContainer>
        <PaginationContainer>
          <Button
            aria-label="Précédent"
            iconId="fr-icon-arrow-left-s-line"
            priority="tertiary no outline"
            onClick={() => swiperControl.slidePrev()}
            disabled={activeIndex === 0}
          />
          <p>
            {activeIndex + 1} sur {verbatims.length + 1}
          </p>
          <Button
            aria-label="Suivant"
            iconId="fr-icon-arrow-right-s-line"
            priority="tertiary no outline"
            onClick={() => swiperControl.slideNext()}
            disabled={activeIndex === verbatims.length}
          />
        </PaginationContainer>
      </NavigationContainer>
    </Swiper>
  );
};
