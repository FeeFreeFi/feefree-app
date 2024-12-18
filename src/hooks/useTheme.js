import * as themeVars from "@/assets/styles/variables.module.scss"

/**
 * @type {import('naive-ui').GlobalThemeOverrides}
 */
export const themeOverrides = {
  common: {
    primaryColor: themeVars.primaryColor,
    successColor: themeVars.successColor,
    warningColor: themeVars.warningColor,
    errorColor: themeVars.errorColor,

    textColorBase: themeVars.textColorBase,
    textColor1: themeVars.textColor1,
    textColor2: themeVars.textColor2,
    textColor3: themeVars.textColor3,
    textColorDisabled: themeVars.textColorDisabled,
  },
  Typography: {
    textColor: themeVars.textColorBase,
    textColor1Depth: themeVars.textColor1,
    textColor2Depth: themeVars.textColor2,
    textColor3Depth: themeVars.textColor3,
  },
  Button: {
    textColor: themeVars.buttonTextColor,
    textColorHover: themeVars.buttonTextColorHover,
    textColorFocus: themeVars.buttonTextColorFocus,
    textColorPressed: themeVars.buttonTextColorPressed,
    textColorDisabled: themeVars.buttonTextColorDisabled,
    textColorTextDisabledPrimary: themeVars.primary80,
    opacityDisabled: themeVars.opacityDisabled,
  },
  Input: {
    caretColor: themeVars.textColorBase,
    color: themeVars.transparent,
    colorFocus: themeVars.transparent,
    paddingTiny: themeVars.inputPadding,
    paddingSmall: themeVars.inputPadding,
    paddingMedium: themeVars.inputPadding,
    paddingLarge: themeVars.inputPadding,
    textColor: themeVars.textColorBase,
  },
  Checkbox: {
    color: themeVars.transparent,
    colorChecked: themeVars.primaryColor,
    colorDisabled: themeVars.transparent,
    colorDisabledChecked: themeVars.primary50,
    textColor: themeVars.textColor1,
    textColorDisabled: themeVars.textColor3,
    border: `1px solid ${themeVars.primaryColor}`,
    borderChecked: `1px solid ${themeVars.primaryColor}`,
    borderDisabled: `1px solid ${themeVars.primary50}`,
    borderDisabledChecked: `1px solid ${themeVars.primary50}`,
    boxShadowFocus: themeVars.none,
  },
  Radio: {
    color: themeVars.transparent,
    boxShadow: `inset 0 0 0 1px ${themeVars.primaryColor}`,
  },
  Popselect: {
    peers: {
      InternalSelectMenu: {
        optionTextColor: themeVars.textColorBase,
        color: themeVars.colorContainer,
        optionColorActivePending: themeVars.colorCard1,
        optionColorPending: themeVars.colorCard1,
      },
    },
  },
  Notification: {
    color: themeVars.colorDialog,
    borderRadius: themeVars.roundedLg,
    titleFontSize: themeVars.textSm,
    fontSize: themeVars.textXs,
    headerTextColor: themeVars.textColorBase,
    textColor: themeVars.textColorBase,
  },
  Message: {
    color: themeVars.colorDialog,
    colorInfo: themeVars.colorDialog,
    colorSuccess: themeVars.colorDialog,
    colorWarning: themeVars.colorDialog,
    colorError: themeVars.colorDialog,
    borderRadius: themeVars.roundedLg,
    titleFontSize: themeVars.textSm,
    fontSize: themeVars.textXs,
    textColor: themeVars.textColorBase,
    textColorInfo: themeVars.textColorBase,
    textColorSuccess: themeVars.textColorBase,
    textColorWarning: themeVars.textColorBase,
    textColorError: themeVars.textColorBase,
  },
  Slider: {
    railColor: themeVars.primary20,
    railColorHover: themeVars.primary20,
    railHeight: themeVars.px2,
    handleSize: themeVars.px12,
  },
  Divider: {
    color: themeVars.colorDivider1,
  },
  Scrollbar: {
    color: themeVars.primary40,
    colorHover: themeVars.primary50,
  },
  Progress: {
    fillColor: themeVars.primaryGradient,
    railColor: themeVars.colorCard,
  },
}
