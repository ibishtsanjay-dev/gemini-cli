/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { act } from 'react';
import { renderWithProviders } from '../../test-utils/render.js';
import { createMockSettings } from '../../test-utils/settings.js';
import { BrailleAnimation } from './BrailleAnimation.js';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('<BrailleAnimation />', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the static frame correctly', async () => {
    const { lastFrame, waitUntilReady } = await renderWithProviders(
      <BrailleAnimation variant="Static" />,
    );
    await waitUntilReady();
    expect(lastFrame()?.trim()).toBe('⢎⡱');
  });

  it('should render Small variant frames (tail length 2)', async () => {
    const {
      lastFrame: lastFrame0,
      waitUntilReady: wait0,
      rerender,
    } = await renderWithProviders(
      <BrailleAnimation variant="Small" frameIndex={0} />,
    );
    await wait0();
    // Frame 0: idx 0, 7
    // bits1 = 0x08 (⠈), bits2 = 0x01 (⠁)
    expect(lastFrame0({ allowEmpty: true })?.trim()).toBe('⠈⠁');

    await act(async () => {
      rerender(<BrailleAnimation variant="Small" frameIndex={1} />);
    });
    await wait0();
    // Frame 1: idx 1, 0
    // bits1 = 0, bits2 = 0x11 (⠑)
    expect(lastFrame0({ allowEmpty: true })?.trim()).toBe('⠀⠑');

    await act(async () => {
      rerender(<BrailleAnimation variant="Small" frameIndex={2} />);
    });
    await wait0();
    // Frame 2: idx 2, 1
    // bits2 = 0x30 (⠰)
    expect(lastFrame0({ allowEmpty: true })?.trim()).toBe('⠀⠰');
  });

  it('should render Medium variant frames (tail length 3)', async () => {
    const { lastFrame, waitUntilReady, rerender } = await renderWithProviders(
      <BrailleAnimation variant="Medium" frameIndex={0} />,
    );
    await waitUntilReady();

    // Frame 0: idx 0, 7, 6
    // bits1 = 0x0A (⠊), bits2 = 0x01 (⠁)
    expect(lastFrame({ allowEmpty: true })?.trim()).toBe('⠊⠁');

    await act(async () => {
      rerender(<BrailleAnimation variant="Medium" frameIndex={1} />);
    });
    await waitUntilReady();
    // Frame 1: idx 1, 0, 7
    // bits1 = 0x08 (⠈), bits2 = 0x11 (⠑)
    expect(lastFrame({ allowEmpty: true })?.trim()).toBe('⠈⠑');
  });

  it('should handle showSpinner setting', async () => {
    const settings = createMockSettings({
      merged: {
        ui: { showSpinner: false },
      },
    });

    const { lastFrame, waitUntilReady } = await renderWithProviders(
      <BrailleAnimation />,
      { settings },
    );
    await waitUntilReady();
    expect(lastFrame({ allowEmpty: true })?.trim()).toBe('');
  });
});
