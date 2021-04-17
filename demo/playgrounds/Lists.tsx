import React, { PropsWithChildren, useState } from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  ViewProps,
  ViewStyle
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RenderHTMLProps } from 'react-native-render-html';
import HtmlDisplay from '../components/HtmlDisplay';
import AtomicText from '../components/AtomicText';
import SourceDisplay from '../components/SourceDisplay';
import { Stack, Column, Columns, useSpacing } from '@mobily/stacks';
import { useComponentColors, useThemeColors } from '../state/ThemeProvider';
import AtomicBox from '../components/AtomicBox';
import AtomicRadioControl from '../components/AtomicRadioControl';
import AtomicSlider from '../components/AtomicSlider';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  demoContainer: {
    borderWidth: 3
  }
});

const DemoCaption = ({
  children,
  style
}: PropsWithChildren<{ style?: StyleProp<ViewProps> }>) => {
  const { backgroundColor, color } = useComponentColors('demoCaption');
  return (
    <AtomicBox padding={1} backgroundColor={backgroundColor} style={style}>
      <AtomicText italic align="center" color={color}>
        {children}
      </AtomicText>
    </AtomicBox>
  );
};

const DemoSectionTitle = ({
  children,
  style
}: PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>) => {
  const { backgroundColor, color } = useComponentColors('demoSectionTitle');
  return (
    <AtomicBox padding={1} backgroundColor={backgroundColor} style={style}>
      <AtomicText color={color} fontSize="small">
        {children}
      </AtomicText>
    </AtomicBox>
  );
};

function Demo({
  html,
  contentWidth,
  htmlProps,
  children,
  style
}: PropsWithChildren<{
  html: string;
  contentWidth: number;
  htmlProps?: Partial<RenderHTMLProps>;
  style?: StyleProp<ViewStyle>;
}>) {
  const spacing = useSpacing(1);
  const theme = useThemeColors();
  const htmlCombo = useComponentColors('html');
  const demoSectionCombo = useComponentColors('demoSectionTitle');
  return (
    <AtomicBox style={style}>
      <AtomicBox
        padding={1}
        style={[
          styles.demoContainer,
          {
            borderColor: theme.primary,
            backgroundColor: demoSectionCombo.backgroundColor
          }
        ]}>
        <Stack space={3}>
          <Stack space={0}>
            <DemoSectionTitle>HTML source</DemoSectionTitle>
            <AtomicBox padding={1} {...htmlCombo}>
              <SourceDisplay html={html} />
            </AtomicBox>
          </Stack>
          <Stack space={0}>
            <DemoSectionTitle>RenderHTML</DemoSectionTitle>
            <AtomicBox padding={1} {...htmlCombo}>
              <HtmlDisplay
                renderHtmlProps={{ ...htmlProps, source: { html } }}
                useLegacy={false}
                supportsLegacy={false}
                contentWidth={contentWidth - 2 * spacing}
              />
            </AtomicBox>
          </Stack>
        </Stack>
      </AtomicBox>
      <DemoCaption>{children}</DemoCaption>
    </AtomicBox>
  );
}
interface ControlsProps extends Pick<ViewProps, 'style'> {
  fontSize: number;
  listType: ListType;
  lineHeight: number;
  fontWeight: FontWeight;
  fontFamily: string;
  fontStyle: FontStyle;
  setLineHeight: (lineHeight: number) => void;
  setListType: (listType: ListType) => void;
  setFontSize: (fontSize: number) => void;
  setFontWeight: (fontWeight: FontWeight) => void;
  setFontFamily: (fontFamily: string) => void;
  setFontStyle: (fontStyle: FontStyle) => void;
  contentWidth: number;
}

const listTypes = [
  'disk',
  'circle',
  'square',
  'disclosure-open',
  'disclosure-closed',
  'decimal',
  'lower-alpha',
  'upper-alpha',
  'lower-greek',
  'decimal-leading-zero',
  'none'
] as const;

type ListType = typeof listTypes[number];

const fontWeights = ['normal', 'bold'] as const;
const fontStyles = ['normal', 'italic'] as const;
type FontWeight = typeof fontWeights[number];
type FontStyle = typeof fontStyles[number];

function Control({
  style,
  label,
  children
}: PropsWithChildren<{ style?: StyleProp<ViewStyle>; label: string }>) {
  return (
    <Stack style={style} space={1}>
      <AtomicText fontSize="small">{label}</AtomicText>
      {children}
    </Stack>
  );
}

function Controls({
  listType,
  contentWidth,
  fontFamily,
  fontSize,
  fontStyle,
  fontWeight,
  lineHeight,
  setFontFamily,
  setFontSize,
  setFontStyle,
  setFontWeight,
  setLineHeight,
  setListType,
  style
}: ControlsProps) {
  return (
    <Stack style={style} space={1}>
      <Control label="Font size">
        <Columns space={3}>
          <Column width={'content'}>
            <AtomicSlider
              key="font-size"
              width={contentWidth - 50}
              minimumValue={10}
              maximumValue={40}
              step={0.1}
              value={fontSize}
              onValueChange={setFontSize}
            />
          </Column>
          <Column>
            <AtomicText>{fontSize.toFixed(1)}</AtomicText>
          </Column>
        </Columns>
      </Control>
      <Control label="Line height">
        <Columns space={3}>
          <Column width={'content'}>
            <AtomicSlider
              key="line-height"
              width={contentWidth - 50}
              minimumValue={1}
              maximumValue={4}
              step={0.1}
              value={lineHeight}
              onValueChange={setLineHeight}
            />
          </Column>
          <Column>
            <AtomicText>{lineHeight.toFixed(1)}</AtomicText>
          </Column>
        </Columns>
      </Control>
      <Control label="Font weight">
        <AtomicRadioControl
          selectedValue={fontWeight}
          onSelectedValueChange={setFontWeight}
          values={fontWeights}
        />
      </Control>
      <Control label="Font style">
        <AtomicRadioControl
          selectedValue={fontStyle}
          onSelectedValueChange={setFontStyle}
          values={fontStyles}
        />
      </Control>
      <Control label="List type">
        <AtomicRadioControl
          selectedValue={listType}
          onSelectedValueChange={setListType}
          values={listTypes}
        />
      </Control>
    </Stack>
  );
}

export default function Lists() {
  const { width: contentWidth } = useWindowDimensions();
  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(1.2);
  const [listType, setListType] = useState<ListType>('circle');
  const [fontWeight, setFontWeight] = useState<FontWeight>('normal');
  const [fontStyle, setFontStyle] = useState<FontStyle>('normal');
  const [fontFamily, setFontFamily] = useState(
    Platform.select({ ios: 'system', default: 'system' })
  );
  const spacing = useSpacing(1);
  const demoWidth = contentWidth - spacing * 2;
  const htmlExample = `<ul>
	<li>Sneaky</li>
	<li>Beaky</li>
	<li>Like</li>
</ul>`;
  const htmlProps: Partial<RenderHTMLProps> = {
    baseStyle: {
      fontSize,
      lineHeight: lineHeight * fontSize,
      fontFamily,
      fontStyle,
      fontWeight
    },
    tagsStyles: {
      ul: {
        listStyleType: listType
      }
    }
  };
  const theme = useThemeColors();
  const controlsProps: ControlsProps = {
    contentWidth: demoWidth,
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
    lineHeight,
    listType,
    setFontStyle,
    setFontFamily,
    setFontSize,
    setFontWeight,
    setLineHeight,
    setListType
  };
  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing }}>
        <Stack space={3}>
          <Controls {...controlsProps} />
          <Demo
            htmlProps={htmlProps}
            html={htmlExample}
            contentWidth={demoWidth}>
            An{' '}
            <AtomicText italic={false} mono>
              &lt;ul/&gt;
            </AtomicText>{' '}
            element
          </Demo>
        </Stack>
      </ScrollView>
    </SafeAreaView>
  );
}