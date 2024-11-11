import "swiper/css";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { useState } from "react";
import { Controller, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Quote from "../../assets/icons/quote.svg";
import useBreakpoints from "../../hooks/useBreakpoints";
import { etablissementLabelGetterFromFormation } from "../../utils/etablissement";
import {
  ApprentiInfo,
  CarouselContainer,
  NavigationContainer,
  PaginationContainer,
  VerbatimContainer,
  VerbatimContent,
} from "./shared.style";

export const VerbatimsCarousel = ({ testimonials }) => {
  const [swiperControl, setSwiperControl] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { isMobile, isDesktop } = useBreakpoints();

  if (!testimonials.length) return null;

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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
        {testimonials.map((testimonial, index) => (
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
                  ? `« ${testimonial.content} »`
                  : `« ${testimonial.content.substring(0, 230)}${testimonial.content.length > 230 ? "..." : ""} »`}
                {testimonial.content.length > 230 && (
                  <>
                    <br />
                    <span onClick={() => toggleExpand(index)}>
                      {expandedIndex === index ? " Voir moins" : " Voir plus"}
                    </span>
                  </>
                )}
              </VerbatimContent>
              <ApprentiInfo>
                Apprenti·e du {etablissementLabelGetterFromFormation(testimonial)} -{" "}
                {new Date(testimonial.createdAt).toLocaleDateString("fr", { month: "long", year: "numeric" })}
              </ApprentiInfo>
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
            {activeIndex + 1} sur {testimonials.length}
          </p>
          <Button
            aria-label="Suivant"
            iconId="fr-icon-arrow-right-s-line"
            priority="tertiary no outline"
            onClick={() => swiperControl.slideNext()}
          />
        </PaginationContainer>
        <Button priority="secondary">Voir plus de témoignages</Button>
      </NavigationContainer>
    </Swiper>
  );
};
