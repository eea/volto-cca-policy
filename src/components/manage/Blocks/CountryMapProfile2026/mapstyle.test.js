import { makeStyles } from './mapstyle';

const openLayers = () => {
  class Style {
    constructor(options) {
      this.options = options;
    }
  }
  class Fill {
    constructor(options) {
      this.options = options;
    }
  }
  class Stroke {
    constructor(options) {
      this.options = options;
    }
  }
  return {
    style: { Style, Fill, Stroke },
    render: {
      toContext: jest.fn(() => ({
        setFillStrokeStyle: jest.fn(),
        drawGeometry: jest.fn(),
      })),
    },
  };
};

const draw = (renderer, feature, context = {}) => {
  const geometry = { clone: () => ({ setCoordinates: jest.fn() }) };
  renderer([], {
    context: {
      save: jest.fn(),
      clip: jest.fn(),
      restore: jest.fn(),
      ...context,
    },
    geometry,
    feature: { get: (key) => feature[key] },
  });
};

describe('CountryMapProfile2026 map styles', () => {
  it('colors country groups using the 2026 grouping and hover highlight', () => {
    const ol = openLayers();
    const styles = makeStyles({ current: 'Ukraine' }, 'Ukraine', ol);
    const { eucountriesStyle } = styles;

    const selectedContext = {
      setFillStrokeStyle: jest.fn(),
      drawGeometry: jest.fn(),
    };
    ol.render.toContext.mockReturnValue(selectedContext);
    draw(eucountriesStyle.options.renderer, { id: 'UA', na: 'Ukraine' });
    expect(
      selectedContext.setFillStrokeStyle.mock.calls[0][0].options.color,
    ).toBe('rgb(138, 156, 58, 0.8)');

    const groupCases = [
      ['CH', '#50B0A4'],
      ['RS', '#A0E5DC'],
      ['GE', '#C8FFF8'],
      ['DE', '#007B6C'],
      ['ZZ', 'rgb(251,250,230, 0.8)'],
    ];
    groupCases.forEach(([id, color]) => {
      ol.render.toContext.mockReturnValue(selectedContext);
      draw(eucountriesStyle.options.renderer, { id, na: id });
      expect(
        selectedContext.setFillStrokeStyle.mock.calls.at(-1)[0].options.color,
      ).toBe(color);
    });
  });

  it('draws a selected country outline only for the selected feature', () => {
    const ol = openLayers();
    const { highlightedCountryStyle } = makeStyles(
      { current: null },
      'France',
      ol,
    );
    const selectedContext = {
      setFillStrokeStyle: jest.fn(),
      drawGeometry: jest.fn(),
    };
    ol.render.toContext.mockReturnValue(selectedContext);

    draw(highlightedCountryStyle.options.renderer, { id: 'FR', na: 'France' });
    expect(selectedContext.setFillStrokeStyle.mock.calls[0][1].options).toEqual(
      {
        color: '#f69c35',
        width: 3,
      },
    );
    const calls = selectedContext.setFillStrokeStyle.mock.calls.length;
    draw(highlightedCountryStyle.options.renderer, { id: 'DE', na: 'Germany' });
    expect(selectedContext.setFillStrokeStyle).toHaveBeenCalledTimes(calls);
  });
});
