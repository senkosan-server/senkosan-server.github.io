// Вики открывают двумя способами: внутри сайта (iframe) и отдельно.
// По умолчанию документ прозрачный - так он с первого кадра показывает
// фон сайта. Если вики открыли отдельно, прозрачному фону нечего
// показать, поэтому включаем собственный тёмный фон.
const DOCS_ROOT = '/wiki-docs/'

if (window.self === window.top) {
  document.documentElement.classList.add('is-standalone')
} else {
  // Внутри сайта адрес страницы вики живёт в истории сайта (/wiki/...),
  // а не в истории iframe. Поэтому ссылки перехватываем и отдаём
  // родительскому окну: иначе адресная строка молчит, «назад» возвращает
  // на предыдущую страницу вики мимо адреса, и ссылку на конкретную
  // страницу нельзя ни скопировать, ни отправить.
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const link = event.target.closest?.('a[href]')
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return

    const url = new URL(link.href, location.href)
    if (url.origin !== location.origin || !url.pathname.startsWith(DOCS_ROOT)) return
    // якорь на этой же странице: грузить ничего не нужно, пусть браузер сам прокрутит
    if (url.pathname === location.pathname) return

    event.preventDefault()
    window.parent.postMessage({ type: 'wiki:navigate', path: url.pathname }, location.origin)
  })
}
