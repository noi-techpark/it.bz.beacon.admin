// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export function fixScrollable(scrollable, freezable = true) {
  scrollable.classList.add('scrollable')
  if (freezable !== false) {
    scrollable.classList.add('scrollable-freezable')
  }

  scrollable.addEventListener('touchstart', (e) => {
    if (scrollable.scrollHeight !== scrollable.clientHeight) {
      // If we're at the top, scroll down one pixel to allow scrolling up
      if (scrollable.scrollTop === 0) {
        scrollable.scrollTop = 1
      }
      // If we're at the bottom, scroll up one pixel to allow scrolling down
      if (scrollable.scrollTop === scrollable.scrollHeight - scrollable.clientHeight) {
        scrollable.scrollTop = scrollable.scrollHeight - scrollable.clientHeight - 1
      }
    }
    // Check if we can scroll
    scrollable.allowUp = scrollable.scrollTop > 0
    scrollable.allowDown = scrollable.scrollTop < (scrollable.scrollHeight - scrollable.clientHeight)
    scrollable.lastY = e.pageY
  })

  scrollable.addEventListener('touchmove', (e) => {
    let up = e.pageY > scrollable.lastY
    scrollable.lastY = e.pageY

    if ((up && scrollable.allowUp) || (!up && scrollable.allowDown)) {
      e.stopPropagation()
    } else {
      e.preventDefault()
    }
  })
}

export function freezeScrollable(freeze = true) {
  if (freeze) {
    document.body.classList.add('freeze-scrollable')
  } else {
    document.body.classList.remove('freeze-scrollable')
  }
}

