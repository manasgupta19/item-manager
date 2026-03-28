import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// This extends Vitest's 'expect' with all the 
// DOM-specific matchers like toHaveTextContent, toBeInTheDocument, etc.
expect.extend(matchers);