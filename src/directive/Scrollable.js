/**
 * This is to fix mobile Safari scroll bugs.
 * 1. Enable smooth touch scroll
 * 2. Make modals appear on top even with smooth touch scroll enabled
 */

import { fixScrollable } from '../service/scrollable'

export const Scrollable = {
  inserted(scrollable, binding) {
    fixScrollable(scrollable, binding.value)
  }
}
