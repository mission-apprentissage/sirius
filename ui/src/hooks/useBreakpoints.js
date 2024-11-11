import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";

const useBreakpoints = () => {
  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const isMobile = windowInnerWidth <= breakpointsValues.sm;
  const isTablet = windowInnerWidth > breakpointsValues.sm && windowInnerWidth <= breakpointsValues.lg;
  const isDesktop = windowInnerWidth > breakpointsValues.lg;

  return { isMobile, isTablet, isDesktop };
};

export default useBreakpoints;
