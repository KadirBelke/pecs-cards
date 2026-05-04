const updateEvents = new EventTarget()

let waitingWorker: ServiceWorker | null = null

function emitUpdateAvailable() {
  updateEvents.dispatchEvent(new Event('update-available'))
}

function trackRegistration(registration: ServiceWorkerRegistration) {
  if (registration.waiting) {
    waitingWorker = registration.waiting
    emitUpdateAvailable()
  }

  registration.addEventListener('updatefound', () => {
    const installingWorker = registration.installing

    if (!installingWorker) {
      return
    }

    installingWorker.addEventListener('statechange', () => {
      if (
        installingWorker.state === 'installed' &&
        navigator.serviceWorker.controller
      ) {
        waitingWorker = registration.waiting ?? installingWorker
        emitUpdateAvailable()
      }
    })
  })
}

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return
  }

  let refreshing = false

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) {
      return
    }

    refreshing = true
    window.location.reload()
  })

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        trackRegistration(registration)
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error)
      })
  })
}

export function subscribeToServiceWorkerUpdate(
  onUpdateAvailable: () => void,
) {
  const listener = () => onUpdateAvailable()

  updateEvents.addEventListener('update-available', listener)

  return () => {
    updateEvents.removeEventListener('update-available', listener)
  }
}

export function applyServiceWorkerUpdate() {
  waitingWorker?.postMessage({ type: 'SKIP_WAITING' })
}
