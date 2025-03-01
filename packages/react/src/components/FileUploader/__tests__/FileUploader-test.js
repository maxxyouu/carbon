/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getByLabel, getByText } from '@carbon/test-utils/dom';
import { act, render } from '@testing-library/react';
import React from 'react';
import FileUploader from '../';
import { uploadFiles } from '../test-helpers';

const iconDescription = 'test description';
const requiredProps = { iconDescription };

describe('FileUploader', () => {
  describe('automated accessibility tests', () => {
    it.skip('should have no axe violations', async () => {
      const { container } = render(<FileUploader {...requiredProps} />);
      await expect(container).toHaveNoAxeViolations();
    });

    it.skip('should have no AC violations', async () => {
      const { container } = render(<FileUploader {...requiredProps} />);
      await expect(container).toHaveNoACViolations('FileUploader');
    });
  });

  it('should support a custom class name on the root element', () => {
    const { container } = render(
      <FileUploader {...requiredProps} className="test" />
    );
    expect(container.firstChild).toHaveClass('test');
  });

  it('should not update the label by default when selecting files', () => {
    const { container } = render(
      <FileUploader {...requiredProps} buttonLabel="upload" />
    );
    const input = container.querySelector('input');
    const label = getByText(container, 'upload');

    expect(label).toBeInstanceOf(HTMLElement);
    act(() => {
      uploadFiles(input, [
        new File(['test'], 'test.png', { type: 'image/png' }),
      ]);
    });
    expect(getByText(container, 'upload')).toBeInstanceOf(HTMLElement);
  });

  it('should clear all uploaded files when `clearFiles` is called on a ref', () => {
    const ref = React.createRef();
    const { container } = render(<FileUploader {...requiredProps} ref={ref} />);
    const input = container.querySelector('input');

    const filename = 'test.png';
    act(() => {
      uploadFiles(input, [new File(['test'], filename, { type: 'image/png' })]);
    });

    expect(getByText(container, filename)).toBeInstanceOf(HTMLElement);
    act(() => {
      ref.current.clearFiles();
    });
    expect(getByText(container, filename)).not.toBeInstanceOf(HTMLElement);
  });

  it('should synchronize the filename status state when its prop changes', () => {
    const container = document.createElement('div');
    render(<FileUploader {...requiredProps} filenameStatus="edit" />, {
      container,
    });

    const input = container.querySelector('input');
    act(() => {
      uploadFiles(input, [
        new File(['test'], 'test.png', { type: 'image/png' }),
      ]);
    });

    const edit = getByLabel(container, iconDescription);

    render(<FileUploader {...requiredProps} filenameStatus="complete" />, {
      container,
    });

    const complete = getByLabel(container, iconDescription);
    expect(edit).not.toEqual(complete);
  });
});
