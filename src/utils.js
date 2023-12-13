/* eslint-disable import/prefer-default-export */

/**
 * Check if storage is available by its type
 * @param {*} type localStoarge | sessionStorage
 * @returns 0: available, 1: not available, 2: not available because quota is exceeded.
 */
export function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return 0;
  } catch (e) {
    const isQuotaExceeded =
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0;
    return isQuotaExceeded ? 2 : 1;
  }
}
