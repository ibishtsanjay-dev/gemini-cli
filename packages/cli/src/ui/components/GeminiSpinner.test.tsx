/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { renderWithProviders } from '../../test-utils/render.js';
import { GeminiSpinner } from './GeminiSpinner.js';
import { describe, it, expect, vi } from 'vitest';
import { useIsScreenReaderEnabled } from 'ink';

vi.mock('ink', async () => {
  const actual = await vi.importActual('ink');
  return {
    ...actual,
    useIsScreenReaderEnabled: vi.fn(),
  };
});

describe('<GeminiSpinner />', () => {
  it('should render BrailleAnimation when screen reader is disabled', async () => {
    vi.mocked(useIsScreenReaderEnabled).mockReturnValue(false);
    const { lastFrame, waitUntilReady } = await renderWithProviders(
      <GeminiSpinner />,
    );
    await waitUntilReady();
    // Composite variant with startFrameIndex 0 starts with '⠊⠁' or similar
    // We just check it's not empty and doesn't contain the altText
    expect(lastFrame()).not.toContain('Responding');
    expect(lastFrame()).toBeTruthy();
  });

  it('should render altText when screen reader is enabled', async () => {
    vi.mocked(useIsScreenReaderEnabled).mockReturnValue(true);
    const { lastFrame, waitUntilReady } = await renderWithProviders(
      <GeminiSpinner altText="Custom Loading" />,
    );
    await waitUntilReady();
    expect(lastFrame()?.trim()).toBe('Custom Loading');
  });
});
