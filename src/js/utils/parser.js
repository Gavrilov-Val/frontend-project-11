const parseRSS = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');
  
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('errors.rss');
  }

  const channel = doc.querySelector('channel');
  if (!channel) {
    throw new Error('errors.rss');
  }

  const feedTitle = channel.querySelector('title')?.textContent || 'Без названия';
  const feedDescription = channel.querySelector('description')?.textContent || 'Без описания';

  const items = doc.querySelectorAll('item');
  const posts = Array.from(items).map((item) => {
    const title = item.querySelector('title')?.textContent || 'Без названия';
    const link = item.querySelector('link')?.textContent || '#';
    const description = item.querySelector('description')?.textContent || 'Без описания';
    
    // Очищаем описание от HTML тегов
    const cleanDescription = stripHtmlTags(description);
    
    return {
      title,
      link,
      description: cleanDescription,
    };
  });

  return {
    feed: {
      title: feedTitle,
      description: feedDescription,
    },
    posts,
  };
};

// Функция для удаления HTML тегов
const stripHtmlTags = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export { parseRSS, stripHtmlTags };
export default parseRSS;