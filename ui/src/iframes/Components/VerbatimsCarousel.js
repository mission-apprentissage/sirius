/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
import "swiper/css";

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
import { etablissementLabelGetterFromFormation } from "../../utils/etablissement";
import {
  ApprentiInfo,
  CarouselContainer,
  FeedbackContainer,
  NavigationContainer,
  PaginationContainer,
  ThemeLabel,
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
  const { isMobile } = useBreakpoints();
  const trackEvent = useMatomoEvent();

  const MAX_CHAR = isMobile ? 150 : 300;

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
      spaceBetween={isMobile ? 30 : 20}
      slidesPerView="1.5"
      centeredSlides={true}
      modules={[Controller, Keyboard]}
      controller={{ control: swiperControl }}
      keyboard={{
        enabled: true,
      }}
      loop={true}
      onSwiper={(swiper) => setSwiperControl(swiper)}
      onSlideChange={(swiper) => {
        if (swiper.activeIndex > activeIndex) {
          trackEvent(MATOMO_CATEGORY.IFRAME_FORMATION, MATOMO_ACTION.CLICK_CAROUSEL_NEXT);
        } else if (swiper.activeIndex < activeIndex) {
          trackEvent(MATOMO_CATEGORY.IFRAME_FORMATION, MATOMO_ACTION.CLICK_CAROUSEL_PREVIOUS);
        }
        setActiveIndex(swiperControl?.realIndex);
        if (swiperControl?.realIndex !== activeIndex) {
          setExpandedIndex(null);
        }
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
            <VerbatimContainer>
              <ThemeLabel>
                <img src={Quote} aria-hidden={true} />
                <i>{verbatim.questionLabel}</i>
              </ThemeLabel>
              <VerbatimContent>
                {expandedIndex === index
                  ? `« ${verbatim.content} »`
                  : `« ${verbatim.content.substring(0, MAX_CHAR)}${verbatim.content.length > MAX_CHAR ? "..." : ""} »`}
                {verbatim.content.length > MAX_CHAR && (
                  <>
                    <br />
                    <span
                      onClick={() => {
                        toggleExpand(index);
                        trackEvent(MATOMO_CATEGORY.IFRAME_FORMATION, MATOMO_ACTION.CLICK_VERBATIM_SEE_MORE);
                      }}
                    >
                      {expandedIndex === index ? "Voir moins" : "Voir plus"}
                    </span>
                  </>
                )}
              </VerbatimContent>
              <ApprentiInfo>
                Apprenti·e du {etablissementLabelGetterFromFormation(verbatim)} -{" "}
                {new Date(verbatim.createdAt).toLocaleDateString("fr", { month: "long", year: "numeric" })}
              </ApprentiInfo>
              <FeedbackContainer
                onClick={() => {
                  handleUsefullFeedback(verbatim.id);
                  trackEvent(MATOMO_CATEGORY.IFRAME_FORMATION, MATOMO_ACTION.CLICK_USEFUL_VERBATIM);
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
        <Button
          priority="secondary"
          onClick={() => {
            setVerbatimsStep(3);
            trackEvent(MATOMO_CATEGORY.IFRAME_FORMATION, MATOMO_ACTION.CLICK_CAROUSEL_SEE_MORE);
          }}
        >
          Voir plus de témoignages
        </Button>
      </NavigationContainer>
    </Swiper>
  );
};
