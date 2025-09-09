import { useState, useEffect, useRef } from 'react';

/**
 * Hook personnalisé pour détecter quand un élément est visible dans le viewport.
 * @param {object} options - Options pour l'IntersectionObserver (threshold, rootMargin, etc.).
 * @returns {[React.MutableRefObject, boolean]} - Un tableau contenant la ref à attacher à l'élément et un booléen indiquant s'il est visible.
 */
function useIntersectionObserver(options = {}) {
  // 'entry' stocke les informations sur l'intersection (est-ce visible, etc.)
  const [entry, setEntry] = useState(null);
  // La ref qui sera attachée à l'élément DOM que nous voulons observer
  const elementRef = useRef(null);

  useEffect(() => {
    const node = elementRef.current; // L'élément DOM actuel

    // On ne continue que si l'élément existe
    if (!node) return;

    // Création de l'observateur
    const observer = new IntersectionObserver(
      ([entry]) => {
        // La fonction de callback qui se déclenche quand la visibilité change
        setEntry(entry);
      },
      {
        threshold: 0.1, // Se déclenche quand 10% de l'élément est visible
        ...options,
      }
    );

    // On commence à observer l'élément
    observer.observe(node);

    // Fonction de nettoyage : quand le composant est retiré, on arrête d'observer
    return () => observer.disconnect();
  }, [options.root, options.rootMargin, options.threshold]); // On recrée l'observateur si les options changent

  // On retourne la ref pour l'attacher à un élément, et si cet élément est en train d'intersecter
  return [elementRef, entry?.isIntersecting];
}

export default useIntersectionObserver;