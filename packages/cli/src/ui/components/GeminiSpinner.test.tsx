/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { renderWithProviders } from '../../test-utils/render.js';
import { GeminiSpinner } from './GeminiSpinner.js';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useIsScreenReaderEnabled } from 'ink';

vi.mock('ink', async () => {
  const actual = await vi.importActual('ink');
  return {
    ...actual,
    useIsScreenReaderEnabled: vi.fn(),
  };
});

describe('<GeminiSpinner />', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render BrailleAnimation when screen reader is disabled', async () => {
    vi.mocked(useIsScreenReaderEnabled).mockReturnValue(false);
    const { lastFrame, waitUntilReady, unmount } = await renderWithProviders(
      <GeminiSpinner />,
    );
    await waitUntilReady();
    // Composite variant starts with something non-empty
    expect(lastFrame()).not.toContain('Responding');
    expect(lastFrame()).toBeTruthy();
    unmount();
  });

  it('should render altText when screen reader is enabled', async () => {
    vi.mocked(useIsScreenReaderEnabled).mockReturnValue(true);
    const { lastFrame, waitUntilReady, unmount } = await renderWithProviders(
      <GeminiSpinner altText="Custom Loading" />,
    );
    await waitUntilReady();
    expect(lastFrame()?.trim()).toBe('Custom Loading');
    unmount();
  });
});
