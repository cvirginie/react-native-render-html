import TRenderEngine from '@native-html/transient-render-engine';
import React, { PropsWithChildren } from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import useTRenderEngine from './hooks/useTRenderEngine';
import { TransientRenderEngineConfig } from './shared-types';
import RenderRegistryProvider from './context/RenderRegistryProvider';
import defaultSystemFonts from './defaultSystemFonts';

const defaultTRenderEngine = {} as any;

const TRenderEngineContext = React.createContext<TRenderEngine>(
  defaultTRenderEngine
);

export const tRenderEngineProviderPropTypes: Record<
  keyof TransientRenderEngineConfig,
  any
> = {
  renderers: PropTypes.object.isRequired,
  enableCSSInlineProcessing: PropTypes.bool,
  enableUserAgentStyles: PropTypes.bool,
  idsStyles: PropTypes.object,
  ignoredTags: PropTypes.array.isRequired,
  ignoredStyles: PropTypes.array.isRequired,
  allowedStyles: PropTypes.array,
  htmlParserOptions: PropTypes.object,
  ignoreDOMNode: PropTypes.func,
  alterDOMData: PropTypes.func,
  alterDOMChildren: PropTypes.func,
  alterDOMElement: PropTypes.func,
  tagsStyles: PropTypes.object,
  classesStyles: PropTypes.object,
  emSize: PropTypes.number.isRequired,
  baseStyle: PropTypes.object,
  systemFonts: PropTypes.arrayOf(PropTypes.string),
  fallbackFonts: PropTypes.shape({
    serif: PropTypes.string,
    'sans-serif': PropTypes.string,
    monospace: PropTypes.string
  }),
  triggerTREInvalidationPropNames: PropTypes.arrayOf(PropTypes.string),
  onDocumentMetadataLoaded: PropTypes.func
};

/**
 * Default fallback font for special keys such as 'sans-serif', 'monospace',
 * 'serif', based on current platform.
 */
export const defaultFallbackFonts = {
  'sans-serif': Platform.select({ ios: 'system', default: 'sans-serif' }),
  monospace: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  serif: Platform.select({ ios: 'Times New Roman', default: 'serif' })
};

export const defaultTRenderEngineProviderProps: TransientRenderEngineConfig = {
  htmlParserOptions: {
    decodeEntities: true
  },
  emSize: 14,
  ignoredTags: [],
  ignoredStyles: [],
  baseStyle: { fontSize: 14 },
  tagsStyles: {},
  classesStyles: {},
  enableUserAgentStyles: true,
  enableCSSInlineProcessing: true,
  renderers: {},
  fallbackFonts: defaultFallbackFonts,
  systemFonts: defaultSystemFonts,
  triggerTREInvalidationPropNames: []
};

export function useAmbiantTRenderEngine() {
  const engine = React.useContext(TRenderEngineContext);
  if (__DEV__ && engine === defaultTRenderEngine) {
    console.error('TRenderEngineProvider is missing in the render tree.');
  }
  return engine;
}

/**
 * A react component to share a transient web engine instance across different
 * rendered contents via `RenderHTMLFragment`. This can seriously enhance
 * performance in applications with potentially dozens or hundreds of distinct
 * rendered snippets such as chat apps.
 *
 * @param props - Pass engine config here.
 */
export default function TRenderEngineProvider({
  children,
  ...config
}: PropsWithChildren<TransientRenderEngineConfig>) {
  const engine = useTRenderEngine(config);
  return (
    <TRenderEngineContext.Provider value={engine}>
      <RenderRegistryProvider renderers={config.renderers}>
        {children}
      </RenderRegistryProvider>
    </TRenderEngineContext.Provider>
  );
}

TRenderEngineProvider.defaultProps = defaultTRenderEngineProviderProps;
TRenderEngineProvider.propTypes = tRenderEngineProviderPropTypes;