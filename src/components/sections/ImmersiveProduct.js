'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import BaseImage from '@/components/common/BaseImage';
import {useCart} from '@/context/CartContext';
import {products} from '@/data/products';

const wrap = (value) => (value + products.length) % products.length;
const getOffset = (index, active) => {
  let offset = index - active;
  if (offset > products.length / 2) offset -= products.length;
  if (offset < -products.length / 2) offset += products.length;
  return offset;
};

export default function ImmersiveProduct() {
  const {addToCart} = useCart();
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [quantities, setQuantities] = useState(() => Object.fromEntries(products.map((product) => [product.id, 1])));
  const [added, setAdded] = useState(false);
  const [autoplayReset, setAutoplayReset] = useState(0);
  const dragStart = useRef(null);
  const dragMoved = useRef(false);
  const wheelLock = useRef(false);
  const stageRef = useRef(null);
  const move = useCallback((direction) => {
    setExpanded(false);
    setActive((current) => wrap(current + direction));
  }, []);

  const manualMove = useCallback((direction) => {
    move(direction);
    setAutoplayReset((value) => value + 1);
  }, [move]);

  useEffect(() => {
    if (expanded) return undefined;
    let autoplay;
    const resumeDelay = autoplayReset === 0 ? 2600 : 1500;
    const resume = window.setTimeout(() => {
      move(1);
      autoplay = window.setInterval(() => move(1), 2600);
    }, resumeDelay);
    return () => {
      window.clearTimeout(resume);
      window.clearInterval(autoplay);
    };
  }, [autoplayReset, expanded, move]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const lockPageScroll = (event) => {
      event.preventDefault();
      if (wheelLock.current || Math.abs(event.deltaY) < 8) return;
      wheelLock.current = true;
      manualMove(event.deltaY > 0 ? 1 : -1);
      window.setTimeout(() => { wheelLock.current = false; }, 330);
    };
    stage.addEventListener('wheel', lockPageScroll, {passive: false});
    return () => stage.removeEventListener('wheel', lockPageScroll);
  }, [manualMove]);

  const handlePointerDown = (event) => {
    if (event.target.closest('.immersive-product__purchase, .immersive-product__reveal-facts, .immersive-product__arrow')) return;
    dragStart.current = event.clientX;
    dragMoved.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event) => {
    if (dragStart.current === null) return;
    const distance = event.clientX - dragStart.current;
    if (Math.abs(distance) > 38) {
      dragMoved.current = true;
      manualMove(distance < 0 ? 1 : -1);
    }
    dragStart.current = null;
  };

  const cancelDrag = () => {
    dragStart.current = null;
    dragMoved.current = false;
  };

  const current = products[active];
  const quantity = quantities[current.id] || 1;
  const changeQuantity = (difference) => {
    setQuantities((values) => ({
      ...values,
      [current.id]: Math.min(current.stock || 99, Math.max(1, (values[current.id] || 1) + difference)),
    }));
  };
  const addCurrentToCart = () => {
    const color = current.availableColors?.[0];
    addToCart({
      id: current.id,
      name: current.name,
      price: current.price,
      color: color?.name || 'Default',
      size: current.availableSizes?.[0] || 'One Size',
      quantity,
      image: color?.image || current.images?.[0],
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section className="immersive-product" aria-labelledby="immersive-title" style={{'--product-accent': current.availableColors?.[0]?.hex || '#b8ff00'}}>
      <div className="immersive-product__copy">
        <p>КОЛЛЕКЦИЯ · {String(active + 1).padStart(2, '0')} / {products.length}</p>
        <h2 id="immersive-title">ВЫБЕРИТЕ<br />СВОЙ ОБРАЗ</h2>
        <span>Прокрутите колесо или потяните витрину в сторону</span>
      </div>

      <div ref={stageRef} className="immersive-product__stage" data-expanded={expanded} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={cancelDrag}>
        <div className="immersive-product__orbit" />
        {expanded && (
          <div className="immersive-product__reveal" key={`reveal-${current.id}`}>
            <div className="immersive-product__reveal-copy">
              <p>LUCHIK.CO / LOOK {String(current.id).padStart(2, '0')}</p>
              <h3>{current.name}</h3>
              <p>{current.description}</p>
              <div className="immersive-product__purchase">
                <div className="immersive-product__quantity" aria-label="Количество товара">
                  <button type="button" onClick={() => changeQuantity(-1)} aria-label="Уменьшить количество">−</button>
                  <strong>{quantity}</strong>
                  <button type="button" onClick={() => changeQuantity(1)} aria-label="Увеличить количество">+</button>
                </div>
                <button className="immersive-product__add" type="button" onClick={addCurrentToCart} disabled={current.stock <= 0}>
                  {current.stock <= 0 ? 'НЕТ В НАЛИЧИИ' : added ? 'ДОБАВЛЕНО ✓' : 'ДОБАВИТЬ В КОРЗИНУ'}
                </button>
              </div>
            </div>
            <div className="immersive-product__reveal-facts">
              <div><span>ЦЕНА</span><strong>${current.price}</strong></div>
              <div><span>РЕЙТИНГ</span><strong>★ {current.rating}</strong></div>
              <div><span>НАЛИЧИЕ</span><strong>{current.stock} ШТ.</strong></div>
              <button type="button" onClick={() => setExpanded(false)}>ВЕРНУТЬСЯ К КАРУСЕЛИ</button>
            </div>
          </div>
        )}
        {products.map((product, index) => {
          const offset = getOffset(index, active);
          const depth = Math.abs(offset);
          return (
            <button key={product.id} type="button" className="immersive-product__view" data-active={offset === 0} style={{'--slot': offset, '--depth': depth, visibility: depth <= 3 ? 'visible' : 'hidden'}} onClick={() => {
              if (dragMoved.current) {
                dragMoved.current = false;
                return;
              }
              if (offset === 0) setExpanded(true);
              else {
                setActive(index);
                setExpanded(false);
                setAutoplayReset((value) => value + 1);
              }
            }} aria-label={offset === 0 ? `Раскрыть ${product.name}` : `Выбрать ${product.name}`}>
              <BaseImage src={`/images/products/carousel/product-${product.id}-cutout.png`} alt={`${product.name} на модели`} fill sizes="(max-width: 768px) 62vw, 28vw" priority={index < 4} />
              <span>{product.name}</span>
            </button>
          );
        })}
        <button className="immersive-product__arrow immersive-product__arrow--left" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => manualMove(-1)} aria-label="Предыдущий товар">←</button>
        <button className="immersive-product__arrow immersive-product__arrow--right" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => manualMove(1)} aria-label="Следующий товар">→</button>
      </div>

      {!expanded && <div className="immersive-product__footer" key={current.id}>
        <div className="immersive-product__summary">
          <p>LUCHIK.CO / LOOK {String(current.id).padStart(2, '0')}</p>
          <h3>{current.name}</h3>
          <p className="immersive-product__summary-description">{current.description}</p>
        </div>
        <div className="immersive-product__facts">
          <div><span>ЦЕНА</span><strong>${current.price}</strong></div>
          <div><span>РЕЙТИНГ</span><strong>★ {current.rating} / 5</strong></div>
          <div><span>НАЛИЧИЕ</span><strong>{current.stock > 0 ? `${current.stock} ШТ.` : 'НЕТ'}</strong></div>
          <p>Цвета, размеры и покупка доступны в карточках каталога ниже.</p>
        </div>
      </div>}
    </section>
  );
}
