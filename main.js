import './style.css';
import * as THREE from 'three';

//导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//导入环境贴图
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';



// 中央UI窗口点击事件处理
document.addEventListener('DOMContentLoaded', () => {
  const centerWindow = document.getElementById('center-ui-window');
  const textContent = document.getElementById('text-content');
  const typedTextElement = document.getElementById('typed-text');
  
  if (centerWindow && textContent && typedTextElement) {
    // 三段话的内容
    const texts = [
      'In the year 2124, cognitive proxy has taken place. Human brains now operate primarily as high-efficiency storage systems. All episodic memory processes have been outsourced to neural-external service providers.',
      'Mnemosyne™ is a proxy in long-term, non-biological memory retention. By storing memories in externally linked, unlimited-capacity engram drives, users are no longer burdened by emotional interference. Storage is guaranteed.\n\nYou\'re now authorized for monitoring host Yue9107\'s memory lattice. Loading real-time memory units...',
      'hello world;'
    ];
    
    // 场景样式配置
    const sceneStyles = [
      { // 第一段：绿色科技风格
        background: 'linear-gradient(45deg, #0a0a0a, #1a1a1a, #0a0a0a)',
        borderColor: '#00ff00',
        textColor: '#00ff00',
        fontSize: '100px',
        boxShadow: '0 0 30px rgba(0, 255, 0, 0.8), 0 0 60px rgba(0, 255, 0, 0.6), 0 0 90px rgba(0, 255, 0, 0.4), 0 0 120px rgba(0, 255, 0, 0.2), 0 0 150px rgba(0, 255, 0, 0.1), inset 0 0 30px rgba(0, 255, 0, 0.3)'
      },
      { // 第二段及以后：磨砂玻璃效果背景，粉色字体
        background: 'rgba(255, 255, 255, 0.8)',
        borderColor: '#ff69b4',
        textColor: '#ff24A4',
        fontSize: '24px',
        boxShadow: '0 0 30px rgba(255, 105, 180, 0.8), 0 0 60px rgba(255, 105, 180, 0.6), 0 0 90px rgba(255, 105, 180, 0.4), 0 0 120px rgba(255, 105, 180, 0.2), 0 0 150px rgba(255, 105, 180, 0.1), inset 0 0 30px rgba(255, 105, 180, 0.3)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }
    ];
    
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isTyping = false;
    let typingInterval;
    
    // 应用场景样式的函数
    function applySceneStyle(textIndex) {
      // 根据文本索引选择样式：第一段用绿色科技风格，其他都用粉色风格
      const styleIndex = textIndex === 0 ? 0 : 1;
      const style = sceneStyles[styleIndex];
      if (!style) return;
      
      // 应用窗口样式
      centerWindow.style.background = style.background;
      centerWindow.style.borderColor = style.borderColor;
      centerWindow.style.boxShadow = style.boxShadow;
      
      // 应用磨砂玻璃效果（如果存在）
      if (style.backdropFilter) {
        centerWindow.style.backdropFilter = style.backdropFilter;
        centerWindow.style.webkitBackdropFilter = style.WebkitBackdropFilter;
      } else {
        // 清除磨砂玻璃效果
        centerWindow.style.backdropFilter = 'none';
        centerWindow.style.webkitBackdropFilter = 'none';
      }
      
      // 根据场景切换动画和背景效果
      if (textIndex === 0) {
        // 第一段：绿色主题，显示黑色背景和绿色texture
        centerWindow.style.animation = 'glitchBackground 0.5s infinite, neonGlow 2s ease-in-out infinite alternate';
        
        // 创建黑色背景和绿色texture
        createGreenMosaicBackground();
      } else {
        // 第二段及以后：粉色主题，移除黑色背景和绿色texture
        centerWindow.style.animation = 'neonGlowPink 2s ease-in-out infinite alternate';
        
        // 移除黑色背景和绿色texture
        removeGreenMosaicBackground();
      }
      
      // 应用文字样式
      const textLine = document.querySelector('.text-line');
      if (textLine) {
        textLine.style.color = style.textColor;
        textLine.style.fontSize = style.fontSize;
        if (style.fontWeight) {
          textLine.style.fontWeight = style.fontWeight;
        }
        textLine.style.textShadow = `0 0 10px ${style.textColor}, 0 0 20px ${style.textColor}, 0 0 30px ${style.textColor}, 0 0 40px ${style.textColor}`;
      }
      
      // 应用光标样式
      const cursor = document.querySelector('.cursor');
      if (cursor) {
        cursor.style.color = style.textColor;
        cursor.style.textShadow = `0 0 10px ${style.textColor}, 0 0 20px ${style.textColor}, 0 0 30px ${style.textColor}`;
      }
    }
    
    // 创建黑色背景和绿色细纹texture
    function createGreenMosaicBackground() {
      // 检查是否已存在
      if (document.getElementById('green-mosaic-bg')) return;
      
      const greenMosaicBg = document.createElement('div');
      greenMosaicBg.id = 'green-mosaic-bg';
      greenMosaicBg.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -3;
        pointer-events: none;
        background: #000000;
        opacity: 1;
        transition: opacity 0.5s ease;
      `;
      
      // 创建绿色细纹texture
      const greenTexture = document.createElement('div');
      greenTexture.id = 'green-texture';
      greenTexture.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -2;
        pointer-events: none;
        background: 
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(0, 255, 0, 0.1) 1px,
            rgba(0, 255, 0, 0.1) 2px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 1px,
            rgba(0, 255, 0, 0.08) 1px,
            rgba(0, 255, 0, 0.08) 2px
          );
        opacity: 0.6;
        transition: opacity 0.5s ease;
        animation: textureBreath 3s ease-in-out infinite;
      `;
      
      // 创建扫描线效果
      const scanLine = document.createElement('div');
      scanLine.id = 'scan-line';
      scanLine.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(0, 255, 0, 0.8), transparent);
        z-index: -1;
        pointer-events: none;
        animation: scanLine 4s linear infinite;
      `;
      
      greenTexture.appendChild(scanLine);
      
      // 添加到中央UI窗口
      centerWindow.appendChild(greenMosaicBg);
      centerWindow.appendChild(greenTexture);
      
      // 初始化texture范围
      updateGreenTextureRange();
    }
    
    // 更新绿色texture范围的函数
    function updateGreenTextureRange() {
      // 只在第一段话时更新texture
      if (currentTextIndex !== 0) return;
      
      const greenTexture = document.getElementById('green-texture');
      if (!greenTexture) return;
      
      const centerWindow = document.getElementById('center-ui-window');
      if (!centerWindow) return;
      
      // 获取当前滚动位置和内容高度
      const scrollTop = centerWindow.scrollTop;
      const scrollHeight = centerWindow.scrollHeight;
      const clientHeight = centerWindow.clientHeight;
      
      // 计算可见内容的范围
      const visibleStart = scrollTop;
      const visibleEnd = scrollTop + clientHeight;
      
      // 获取文字内容元素
      const textLine = document.querySelector('.text-line');
      let textBounds = { top: 0, bottom: clientHeight };
      
      if (textLine) {
        const textRect = textLine.getBoundingClientRect();
        const windowRect = centerWindow.getBoundingClientRect();
        textBounds = {
          top: textRect.top - windowRect.top + scrollTop,
          bottom: textRect.bottom - windowRect.top + scrollTop
        };
      }
      
      // 计算texture应该覆盖的范围（基于文字内容和可见区域）
      const contentStart = Math.max(0, textBounds.top - 100);
      const contentEnd = Math.min(scrollHeight, textBounds.bottom + 100);
      const textureStart = Math.max(0, Math.min(visibleStart - 150, contentStart));
      const textureEnd = Math.min(scrollHeight, Math.max(visibleEnd + 150, contentEnd));
      const textureHeight = textureEnd - textureStart;
      
      // 更新texture的位置和高度，添加平滑过渡
      greenTexture.style.transition = 'top 0.3s ease, height 0.3s ease, opacity 0.3s ease';
      greenTexture.style.top = textureStart + 'px';
      greenTexture.style.height = textureHeight + 'px';
      
      // 根据滚动位置调整texture的透明度
      const scrollProgress = scrollTop / Math.max(1, scrollHeight - clientHeight);
      const baseOpacity = 0.6;
      const dynamicOpacity = baseOpacity + (scrollProgress * 0.3); // 滚动时稍微增加透明度
      greenTexture.style.opacity = Math.min(0.9, Math.max(0.3, dynamicOpacity));
      
      // 根据滚动位置调整texture的密度和颜色强度
      const density = 1 + (scrollProgress * 0.8); // 滚动时增加密度
      const lineSpacing = Math.max(1, 3 / density);
      const colorIntensity = 0.1 + (scrollProgress * 0.15); // 滚动时增加颜色强度
      
      // 添加动态颜色变化
      const hueShift = scrollProgress * 30; // 滚动时颜色稍微偏移
      
      greenTexture.style.background = `
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent ${lineSpacing}px,
          rgba(0, 255, 0, ${colorIntensity}) ${lineSpacing}px,
          rgba(0, 255, 0, ${colorIntensity}) ${lineSpacing * 2}px
        ),
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent ${lineSpacing}px,
          rgba(0, 255, 0, ${colorIntensity * 0.8}) ${lineSpacing}px,
          rgba(0, 255, 0, ${colorIntensity * 0.8}) ${lineSpacing * 2}px
        )
      `;
      
      // 添加动态滤镜效果
      greenTexture.style.filter = `
        hue-rotate(${hueShift}deg)
        brightness(${1 + scrollProgress * 0.2})
        contrast(${1 + scrollProgress * 0.1})
      `;
      
      // 添加轻微的缩放效果
      const scale = 1 + (scrollProgress * 0.05);
      greenTexture.style.transform = `scale(${scale})`;
      
      // 添加动态扫描线效果
      const scanLineOffset = (Date.now() * 0.1) % (textureHeight + 100);
      greenTexture.style.setProperty('--scan-line-offset', `${scanLineOffset}px`);
      
      // 添加CSS自定义属性用于动画
      greenTexture.style.setProperty('--scroll-progress', scrollProgress);
      greenTexture.style.setProperty('--texture-height', `${textureHeight}px`);
      
      // 调试信息（可选，开发时使用）
      if (window.DEBUG_TEXTURE) {
        console.log('Texture Update:', {
          scrollTop,
          scrollHeight,
          clientHeight,
          textureStart,
          textureEnd,
          textureHeight,
          scrollProgress,
          opacity: greenTexture.style.opacity
        });
      }
    }
    
    // 移除黑色背景和绿色texture
    function removeGreenMosaicBackground() {
      const greenMosaicBg = document.getElementById('green-mosaic-bg');
      const greenTexture = document.getElementById('green-texture');
      
      if (greenMosaicBg) {
        greenMosaicBg.style.opacity = '0';
        setTimeout(() => {
          if (greenMosaicBg.parentNode) {
            greenMosaicBg.parentNode.removeChild(greenMosaicBg);
          }
        }, 500);
      }
      
      if (greenTexture) {
        greenTexture.style.opacity = '0';
        setTimeout(() => {
          if (greenTexture.parentNode) {
            greenTexture.parentNode.removeChild(greenTexture);
          }
        }, 500);
      }
    }
    
    // 过渡效果函数
    function startTransitionEffect(callback) {
      // 创建过渡遮罩层
      const transitionOverlay = document.createElement('div');
      transitionOverlay.id = 'transition-overlay';
      transitionOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 10001;
        pointer-events: none;
        background: transparent;
        transition: opacity 0.5s ease;
      `;
      
      // 创建白色背景层
      const whiteBackground = document.createElement('div');
      whiteBackground.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
        opacity: 0;
        transition: opacity 0.5s ease;
        z-index: 1;
      `;
      
             // 创建马赛克效果容器
       const mosaicContainer = document.createElement('div');
       mosaicContainer.style.cssText = `
         position: absolute;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
         display: grid;
         grid-template-columns: repeat(25, 1fr);
         grid-template-rows: repeat(25, 1fr);
         gap: 2px;
         opacity: 0;
         transition: opacity 0.5s ease;
       `;
      
             // 赛博朋克颜色数组 - 最高饱和度和亮度
       const cyberColors = [
         '#00ff00', '#ff0080', '#00ffff', '#ff00ff', '#ffff00', '#ff0000',
         '#00ff80', '#ff0080', '#0080ff', '#ff4000', '#40ff00', '#ff00ff'
       ];
      
             // 生成马赛克方块
       const tiles = [];
       for (let i = 0; i < 625; i++) {
        const tile = document.createElement('div');
        const randomColor = cyberColors[Math.floor(Math.random() * cyberColors.length)];
                 tile.style.cssText = `
           background: ${randomColor};
           opacity: 0;
           transition: all 0.1s ease;
           animation: cyberGlitch 0.05s infinite alternate;
           box-shadow: 0 0 15px ${randomColor}, 0 0 25px ${randomColor};
           position: relative;
           overflow: hidden;
           filter: saturate(300%) brightness(200%) contrast(150%);
         `;
        
                 // 添加内部故障效果
         const glitchInner = document.createElement('div');
         glitchInner.style.cssText = `
           position: absolute;
           top: 0;
           left: 0;
           width: 100%;
           height: 100%;
           background: ${randomColor};
           opacity: 0;
           animation: innerGlitch 0.1s infinite;
           filter: saturate(300%) brightness(200%) contrast(150%);
         `;
         
         // 添加额外的故障层
         const glitchExtra = document.createElement('div');
         glitchExtra.style.cssText = `
           position: absolute;
           top: 0;
           left: 0;
           width: 100%;
           height: 100%;
           background: ${randomColor};
           opacity: 0;
           animation: extraGlitch 0.08s infinite;
           filter: saturate(300%) brightness(200%) contrast(200%);
         `;
         
         tile.appendChild(glitchInner);
         tile.appendChild(glitchExtra);
        
        mosaicContainer.appendChild(tile);
        tiles.push(tile);
      }
      
      transitionOverlay.appendChild(whiteBackground);
      transitionOverlay.appendChild(mosaicContainer);
      document.body.appendChild(transitionOverlay);
      
      // 开始过渡动画
      let phase = 0;
      const totalDuration = 3000; // 3秒
      const startTime = Date.now();
      let colorChangeInterval;
      let glitchInterval;
      
      function animateTransition() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / totalDuration;
        
        if (progress < 1) {
          // 第一阶段：显示马赛克效果（0-0.3秒）
          if (phase === 0 && progress > 0.05) {
            phase = 1;
            mosaicContainer.style.opacity = '1';
            
                         // 波浪式显示马赛克方块
             tiles.forEach((tile, index) => {
               const row = Math.floor(index / 25);
               const col = index % 25;
               const delay = (row + col) * 8 + Math.random() * 150;
               setTimeout(() => {
                 tile.style.opacity = '1';
               }, delay);
             });
          }
          
          // 第二阶段：赛博朋克动态效果（0.3-0.7秒）
          if (phase === 1 && progress > 0.3) {
            phase = 2;
            
                         // 颜色变换效果
             colorChangeInterval = setInterval(() => {
               tiles.forEach(tile => {
                 if (Math.random() > 0.5) {
                   const newColor = cyberColors[Math.floor(Math.random() * cyberColors.length)];
                   tile.style.background = newColor;
                   tile.style.boxShadow = `0 0 15px ${newColor}, 0 0 25px ${newColor}`;
                   tile.querySelectorAll('div').forEach(div => {
                     div.style.background = newColor;
                   });
                 }
               });
             }, 120);
            
                         // 增强故障闪烁效果
             glitchInterval = setInterval(() => {
               const randomTiles = tiles.filter(() => Math.random() > 0.6);
               randomTiles.forEach(tile => {
                 const scale = 0.8 + Math.random() * 0.4;
                 const rotate = (Math.random() - 0.5) * 12;
                 const translateX = (Math.random() - 0.5) * 3;
                 const translateY = (Math.random() - 0.5) * 3;
                 
                 tile.style.transform = `scale(${scale}) rotate(${rotate}deg) translate(${translateX}px, ${translateY}px)`;
                 tile.style.opacity = Math.random() > 0.5 ? '1' : '0.3';
                 tile.style.filter = `saturate(${200 + Math.random() * 150}%) brightness(${150 + Math.random() * 100}%) contrast(${150 + Math.random() * 100}%)`;
               });
             }, 60);
             
             // 添加额外的故障效果
             setInterval(() => {
               const randomTiles = tiles.filter(() => Math.random() > 0.85);
               randomTiles.forEach(tile => {
                 tile.style.animation = 'none';
                 setTimeout(() => {
                   tile.style.animation = 'cyberGlitch 0.05s infinite alternate';
                 }, 15);
               });
             }, 150);
          }
          
          // 第三阶段：渐渐变白并显示白色背景（0.7-0.9秒）
          if (phase === 2 && progress > 0.7) {
            phase = 3;
            
            // 清除之前的动画
            if (colorChangeInterval) clearInterval(colorChangeInterval);
            if (glitchInterval) clearInterval(glitchInterval);
            
            // 开始显示白色背景
            whiteBackground.style.opacity = '0.3';
            
            // 渐渐变白效果
            tiles.forEach((tile, index) => {
              const delay = index * 2;
              setTimeout(() => {
                tile.style.background = '#ffffff';
                tile.style.boxShadow = '0 0 10px #ffffff';
                tile.style.transform = 'scale(1) rotate(0deg)';
                tile.querySelector('div').style.background = '#ffffff';
              }, delay);
            });
          }
          
          // 第四阶段：完全显示白色背景并淡出马赛克（0.9-1.0秒）
          if (phase === 3 && progress > 0.9) {
            phase = 4;
            // 完全显示白色背景
            whiteBackground.style.opacity = '1';
            // 淡出马赛克效果
            mosaicContainer.style.opacity = '0';
            mosaicContainer.style.transform = 'scale(1.1)';
          }
          
          requestAnimationFrame(animateTransition);
        } else {
          // 过渡完成
          if (colorChangeInterval) clearInterval(colorChangeInterval);
          if (glitchInterval) clearInterval(glitchInterval);
          
          // 保持白色背景显示，直接调用回调
          setTimeout(() => {
            document.body.removeChild(transitionOverlay);
            // 确保在过渡完成后移除绿色texture
            removeGreenMosaicBackground();
            callback();
          }, 100);
        }
      }
      
      // 开始动画
      animateTransition();
    }
    
    // 打字机效果函数
    function typeText(text, callback) {
      if (isTyping) return;
      
      isTyping = true;
      currentCharIndex = 0;
      typedTextElement.textContent = '';
      
      // 应用当前场景的样式
      applySceneStyle(currentTextIndex);
      
      // 确保窗口滚动到中间位置，让文字从中间开始显示
      centerWindow.scrollTop = 0;
      
      // 根据段落设置不同的打字速度
      let typingSpeed;
      if (currentTextIndex === 0) {
        typingSpeed = 30; // 第一段：30ms
      } else {
        typingSpeed = 2; // 其他段落：50ms
      }
      
      typingInterval = setInterval(() => {
        if (currentCharIndex < text.length) {
          const currentChar = text[currentCharIndex];
          // 将换行符转换为HTML的br标签
          if (currentChar === '\n') {
            typedTextElement.innerHTML += '<br>';
          } else {
            typedTextElement.innerHTML += currentChar;
          }
          // 更新data-text属性以支持故障效果
          typedTextElement.setAttribute('data-text', typedTextElement.textContent);
          currentCharIndex++;
          
          // 只有当内容超出页面时才滚动
          setTimeout(() => {
            const scrollHeight = centerWindow.scrollHeight;
            const clientHeight = centerWindow.clientHeight;
            if (scrollHeight > clientHeight) {
              // 只有当内容高度超过容器高度时才滚动
              centerWindow.scrollTop = scrollHeight - clientHeight + 50;
            }
            // 如果内容没有超出，不进行任何滚动操作，保持当前居中位置
            
            // 只在第一段话时更新绿色texture范围
            if (currentTextIndex === 0) {
              updateGreenTextureRange();
            }
          }, 50);
        } else {
          clearInterval(typingInterval);
          isTyping = false;
          if (callback) callback();
        }
      }, typingSpeed); // 使用动态打字速度
    }
    
    // 开始显示第一段话
    typeText(texts[0]);
    
    // 立即创建黑色背景和绿色texture（只在第一段话时）
    createGreenMosaicBackground();
    
    // 初始化texture范围（只在第一段话时）
    setTimeout(() => {
      if (currentTextIndex === 0) {
        updateGreenTextureRange();
      }
    }, 100);
    
    // 防抖函数
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
    
    // 使用requestAnimationFrame优化texture更新
    let textureUpdateRequested = false;
    
    function requestTextureUpdate() {
      if (!textureUpdateRequested) {
        textureUpdateRequested = true;
        requestAnimationFrame(() => {
          updateGreenTextureRange();
          textureUpdateRequested = false;
        });
      }
    }
    
    // 添加滚动事件监听器（优化版本）
    centerWindow.addEventListener('scroll', () => {
      // 只在第一段话时更新texture
      if (currentTextIndex === 0) {
        requestTextureUpdate();
      }
    });
    
    centerWindow.addEventListener('click', (e) => {
      // 阻止事件冒泡，确保不会触发后面的元素
      e.stopPropagation();
      e.preventDefault();
      
      if (isTyping) {
        // 如果正在打字，立即完成当前文字
        clearInterval(typingInterval);
        const completedText = texts[currentTextIndex].replace(/\n/g, '<br>');
        typedTextElement.innerHTML = completedText;
        typedTextElement.setAttribute('data-text', texts[currentTextIndex]);
        isTyping = false;
        // 只有当内容超出页面时才滚动
        setTimeout(() => {
          const scrollHeight = centerWindow.scrollHeight;
          const clientHeight = centerWindow.clientHeight;
          if (scrollHeight > clientHeight) {
            // 只有当内容高度超过容器高度时才滚动
            centerWindow.scrollTop = scrollHeight - clientHeight + 50;
          }
          // 如果内容没有超出，不进行任何滚动操作，保持当前居中位置
          
          // 只在第一段话时更新绿色texture范围
          if (currentTextIndex === 0) {
            updateGreenTextureRange();
          }
        }, 50);
              } else {
          // 如果已经完成打字，进入下一段
          if (currentTextIndex < texts.length - 1) {
            // 如果是第一段到第二段的过渡，添加特殊效果
            if (currentTextIndex === 0) {
              startTransitionEffect(() => {
                currentTextIndex++;
                // 确保移除绿色texture
                removeGreenMosaicBackground();
                typeText(texts[currentTextIndex]);
              });
            } else {
              currentTextIndex++;
              typeText(texts[currentTextIndex]);
            }
          } else {
            // 最后一段话，窗口消失
            centerWindow.classList.add('hidden');
            setTimeout(() => {
              centerWindow.remove();
            }, 300);
          }
        }
    });
    
    // 阻止窗口内的所有点击事件冒泡
    centerWindow.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
    
    centerWindow.addEventListener('mouseup', (e) => {
      e.stopPropagation();
    });
  }
});

// 顶部UI文本轮换功能
document.addEventListener('DOMContentLoaded', () => {
  const uiTextElement = document.getElementById('ui-text');
  
  if (uiTextElement) {
    const uiTexts = [
      'navigate with mouse and WASD',
      'Upon enrollment, Mnemosyne™ intercepts hippocampal encoding memory impression signals and stores them to archival containers.',
      'you have entered the n0.19344 hosts\' memory disk',
      'impression formed...',
      'processing storage of episodic medium...',
      'episodic medium retrieval system active',
      'click on memory disks to recall impression...'
    ];
    
    let currentUiTextIndex = 0;
    let currentCharIndex = 0;
    let isTyping = false;
    let typingInterval;
    
    // 打字机效果函数
    function typeUiText(text) {
      if (isTyping) return;
      
      isTyping = true;
      currentCharIndex = 0;
      uiTextElement.textContent = '';
      
      typingInterval = setInterval(() => {
        if (currentCharIndex < text.length) {
          uiTextElement.textContent += text[currentCharIndex];
          currentCharIndex++;
        } else {
          clearInterval(typingInterval);
          isTyping = false;
          
          // 当前文本完成后，等待一段时间再开始下一段
          setTimeout(() => {
            currentUiTextIndex = (currentUiTextIndex + 1) % uiTexts.length;
            typeUiText(uiTexts[currentUiTextIndex]);
          }, 3000); // 等待3秒后开始下一段
        }
      }, 50); // 每50ms打一个字
    }
    
    // 开始显示第一句话
    typeUiText(uiTexts[0]);
  }
});

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // 白色背景

// 添加雾效 - 越远越透明
scene.fog = new THREE.Fog(0xffffff, 5, 20); // 颜色，近距离，远距离

// 创建相机
const camera = new THREE.PerspectiveCamera(
  60, // 视角 
  window.innerWidth / window.innerHeight, // 宽高比
  0.05, // 近截面
  300 // 远截面
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// 修改鼠标样式
document.body.style.cursor = 'none'; // 隐藏默认鼠标

// 创建自定义鼠标
const customCursor = document.createElement('div');
customCursor.style.cssText = `
  position: fixed;
  width: 20px;
  height: 20px;
  background: #0232e0;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease;
  border: 5px solid #000000;
`;
document.body.appendChild(customCursor);

// 监听鼠标移动
document.addEventListener('mousemove', (e) => {
  customCursor.style.left = e.clientX + 'px';
  customCursor.style.top = e.clientY + 'px';
});

// 鼠标悬停时改变样式
document.addEventListener('mouseenter', () => {
  customCursor.style.display = 'block';
});

document.addEventListener('mouseleave', () => {
  customCursor.style.display = 'none';
});

// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 10);
scene.add(ambientLight);







// 生成随机直线的函数
function generateRandomLines(count = 1000) {
  const lines = [];
  const lineLength = 40; // 直线长度，足够长以覆盖视野
  
  for (let i = 0; i < count; i++) {
    // 随机生成直线的起点
    const startZ = (Math.random() - 0.5) * 20;
    const startX = (Math.random() - 0.5) * 20;
    
    // 随机生成方向角度 (0 到 2π)
    const angle = Math.random() * Math.PI * 2;
    
    // 计算终点
    const endZ = startZ + Math.cos(angle) * lineLength;
    const endX = startX + Math.sin(angle) * lineLength;
    
    // 创建直线几何体
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      startX, 0, startZ,
      endX, 0, endZ
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    // 创建线条材质
    const material = new THREE.LineBasicMaterial({ 
      color: new THREE.Color().setHSL(Math.random(), 1, 0.6), // 随机颜色，高饱和度
      transparent: true,
      opacity: 1,
      fog: true, // 启用雾效
    });
    
    // 创建线条
    const line = new THREE.Line(geometry, material);
    lines.push(line);
  }
  
  return lines;
}

// 生成直线
const randomLines = generateRandomLines(2000); // 生成2000条直线
randomLines.forEach(line => scene.add(line));

// 为每条直线添加移动小球体的函数
function addMovingSpheresToLines(lines) {
  const spheres = [];
  const spheresPerLine = 3; // 每条线上的小球数量
  
  lines.forEach((line, lineIndex) => {
    // 获取直线的起点和终点
    const pos = line.geometry.attributes.position.array;
    const startX = pos[0], startZ = pos[2];
    const endX = pos[3], endZ = pos[5];
    
    // 计算直线方向向量
    const directionX = endX - startX;
    const directionZ = endZ - startZ;
    const lineLength = Math.sqrt(directionX * directionX + directionZ * directionZ);
    
    // 归一化方向向量
    const normalizedDirX = directionX / lineLength;
    const normalizedDirZ = directionZ / lineLength;
    
    // 在每条线上均匀分布小球
    for (let i = 0; i < spheresPerLine; i++) {
      // 计算小球在直线上的初始位置（均匀分布）
      const t = (i + 1) / (spheresPerLine + 1); // 0到1之间的均匀分布
      const sphereX = startX + t * directionX;
      const sphereZ = startZ + t * directionZ;
      
      // 创建小球几何体
      const sphereGeometry = new THREE.SphereGeometry(0.02, 2, 2);
      const sphereMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
        transparent: true,
        opacity: 1,
        fog: true // 启用雾效
      });
      
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(sphereX, 0.1, sphereZ); // 稍微抬高一点避免与直线重叠
      
      // 添加移动相关的属性
      sphere.userData = {
        lineIndex: lineIndex,
        startX: startX,
        startZ: startZ,
        endX: endX,
        endZ: endZ,
        directionX: normalizedDirX,
        directionZ: normalizedDirZ,
        lineLength: lineLength,
        speed: Math.random() * 0.002, // 随机速度
        currentPosition: t,
        movingForward: Math.random() > 0.5 // 随机移动方向
      };
      
      scene.add(sphere);
      spheres.push(sphere);
    }
  });
  
  return spheres;
}

// 添加移动小球体
const movingSpheres = addMovingSpheresToLines(randomLines);

function findIntersections(lines) {
  const intersections = [];
  
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const line1 = lines[i];
      const line2 = lines[j];
      const pos1 = line1.geometry.attributes.position.array;
      const pos2 = line2.geometry.attributes.position.array;
      
      const x1 = pos1[0], y1 = pos1[1], z1 = pos1[2];
      const x2 = pos1[3], y2 = pos1[4], z2 = pos1[5];
      const x3 = pos2[0], y3 = pos2[1], z3 = pos2[2];
      const x4 = pos2[3], y4 = pos2[4], z4 = pos2[5];
      
      const denominator = (x1 - x2) * (z3 - z4) - (z1 - z2) * (x3 - x4);
      
      if (Math.abs(denominator) > 0.001) { 
        const t = ((x1 - x3) * (z3 - z4) - (z1 - z3) * (x3 - x4)) / denominator;
        const u = -((x1 - x2) * (z1 - z3) - (z1 - z2) * (x1 - x3)) / denominator;
        
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
          const intersectionX = x1 + t * (x2 - x1);
          const intersectionZ = z1 + t * (z2 - z1);
          
          intersections.push({
            x: intersectionX,
            z: intersectionZ,
            y: 0
          });
        }
      }
    }
  }
  
  return intersections;
}

// 计算所有交叉点

const intersections = findIntersections(randomLines);
console.log(`找到 ${intersections.length} 个交叉点`);

// 设置相机位置 - 从近平面地向下15度微微俯视
const distance = 1/17;
const angle = Math.PI / 3; // 15度 = π/12弧度
camera.position.set(-5, distance * Math.sin(angle)-0.003, distance * Math.cos(angle));
camera.lookAt(0, 0, 0);

// 添加轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 键盘控制参数
const moveSpeed = 0.06; // 移动速度
const moveState = { w: false, a: false, s: false, d: false };

// 监听键盘按下
window.addEventListener('keydown', (e) => {
  if (e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd') {
    moveState[e.key] = true;
  }
});

// 监听键盘松开
window.addEventListener('keyup', (e) => {
  if (e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd') {
    moveState[e.key] = false;
  }
});






// 渲染
function animate() {
  requestAnimationFrame(animate);
  
  // 更新小球移动
  movingSpheres.forEach(sphere => {
    const userData = sphere.userData;
    
    if (userData.movingForward) {
      userData.currentPosition += userData.speed;
      if (userData.currentPosition >= 1) {
        userData.currentPosition = 1;
        userData.movingForward = false; // 改变方向
      }
    } else {
      userData.currentPosition -= userData.speed;
      if (userData.currentPosition <= 0) {
        userData.currentPosition = 0;
        userData.movingForward = true; // 改变方向
      }
    }
    
    // 更新小球位置
    const newX = userData.startX + userData.currentPosition * (userData.endX - userData.startX);
    const newZ = userData.startZ + userData.currentPosition * (userData.endZ - userData.startZ);
    sphere.position.set(newX, 0.1, newZ);
  });
  
  // WASD 平面移动
  let forward = 0, right = 0;
  if (moveState.w) forward += 1;
  if (moveState.s) forward -= 1;
  if (moveState.d) right += 1;
  if (moveState.a) right -= 1;

  if (forward !== 0 || right !== 0) {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();

    const rightVec = new THREE.Vector3();
    rightVec.crossVectors(dir, camera.up).normalize();

    // 计算移动向量
    const moveVec = new THREE.Vector3();
    moveVec.addScaledVector(dir, moveSpeed * forward);
    moveVec.addScaledVector(rightVec, moveSpeed * right);

    // camera 和 controls.target 一起移动
    camera.position.add(moveVec);
    controls.target.add(moveVec);

    camera.updateMatrixWorld();
  }
  
  controls.update();
  renderer.render(scene, camera);
}

animate();

// 响应窗口大小变化
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});







const generatedModels = [];

//实例化gltf加载器
const gltfLoader = new GLTFLoader();

// 创建纹理加载器
const textureLoader = new THREE.TextureLoader();

// 预加载三个图片纹理
const imageTextures = [
  textureLoader.load('/media/1.jpg'),
  textureLoader.load('/media/2.jpg'),
  textureLoader.load('/media/3.jpg'),
  textureLoader.load('/media/4.jpg'),
  textureLoader.load('/media/5.jpg'),
  textureLoader.load('/media/6.jpg'),
  textureLoader.load('/media/7.jpg'),
  textureLoader.load('/media/8.jpg'),
  textureLoader.load('/media/9.jpg'),
  textureLoader.load('/media/10.jpg'),
  textureLoader.load('/media/11.jpg'),
  textureLoader.load('/media/12.jpg'),
  textureLoader.load('/media/13.jpg'),
  textureLoader.load('/media/14.jpg'),
  textureLoader.load('/media/15.jpg'),
  textureLoader.load('/media/16.jpg'),
  textureLoader.load('/media/17.jpg'),
  textureLoader.load('/media/18.jpg'),
  textureLoader.load('/media/19.jpg'),
  textureLoader.load('/media/20.jpg'),
  textureLoader.load('/media/21.jpg'),
  textureLoader.load('/media/22.jpg'),
  textureLoader.load('/media/23.jpg'),
  textureLoader.load('/media/24.jpg'),
  textureLoader.load('/media/25.jpg'),
  textureLoader.load('/media/26.jpg'),
  textureLoader.load('/media/27.jpg'),
  textureLoader.load('/media/28.jpg'),
  textureLoader.load('/media/29.jpg'),
  textureLoader.load('/media/30.jpg'),
  textureLoader.load('/media/31.jpg'),
  textureLoader.load('/media/32.jpg'),
  textureLoader.load('/media/33.jpg'),
  textureLoader.load('/media/34.jpg'),
  textureLoader.load('/media/35.jpg'),
  textureLoader.load('/media/36.jpg'),
  textureLoader.load('/media/37.jpg'),
  textureLoader.load('/media/38.jpg'),
  textureLoader.load('/media/39.jpg'),
  textureLoader.load('/media/40.jpg'),
  textureLoader.load('/media/41.jpg'),
  textureLoader.load('/media/42.jpg'),
  textureLoader.load('/media/43.jpg'),
  textureLoader.load('/media/44.jpg'),
  textureLoader.load('/media/45.jpg'),
  textureLoader.load('/media/46.jpg'),
  textureLoader.load('/media/47.jpg'),
  textureLoader.load('/media/48.jpg'),
  textureLoader.load('/media/49.jpg'),
  textureLoader.load('/media/50.jpg'),
];

// 1. 在图片加载数组后面加
const memoryDescriptions = [
  'chendgu hotpot, study room, KTV OST',
  '2am at dorm, crashing ib art ddl, overwhelmed',
  'reunion with costa rica friend, christmas break was cold, missed bella',
  'room in new house',
  'online summer program on zoom at 3am',
  'uno game with friends on last IB art class of DP1',
  'walking my dog with anya and oliver',
  'cat in community center!',
  'i love zhajiang mian',
  'surfing trip to Hainan',
  'final exam cramming with anna',
  'watergun warrr',
  'trip to hometown shanxi with family',
  'latenight beach',
  'gemini meteor shower shooting overnight with dad',
  'winter school court chillin', 
  'yes i brought my dog to the mall',
  'dorm window view',
  'september with friends',
  'dad wore my haloween costume. ratatouille.',
  'the tea was so hot',
  'car window view',
  'childhood pic with dad in old house',
  'childhood manifesto ritual',
  'i cut my hair.',
  'brunch w domi at baker&spice',
  'comfort fooding with friends',
  'biking trip',
  'grabbing korean food',
  'showering in shuiguotangquan w tina and sissi',
  'photo takin gon school court',
  'rock paper scissors (splits ver.)',
  'weiqi w jocelyn',
  'sakura!',
  'chinese new year dorm deco #aesthetics',
  'the night before SAT',
  'with my dog',
  'disco pic',
  'unconsciously taken random pic',
  'in the mall',
  'amplifier studio group pic after 48hr film marathon!',
  'on the westcoast with mom',
  'CMU card games with shizeng and pierre',
  'my first game dev team!',
  'pittsburgh sunset view',
  'i love this. comfort food again.',
  'flight to detroit.',
  'DaLi trip!',
  'spring has come.',
  'hainan gang'
];

// 在交叉点上生成模型的函数
function generateModelsAtIntersections(intersections) {
  const generationProbability = 0.001; // 生成container模型的概率
  
  intersections.forEach(intersection => {
    if (Math.random() < generationProbability) {
      // 随机选择一张图片纹理
      const randomTexture = imageTextures[Math.floor(Math.random() * imageTextures.length)];
      
      // 创建平面几何体
      const planeGeometry = new THREE.PlaneGeometry(0.5, 0.5); // 0.5x0.5的平面
      
      // 创建材质并应用纹理，设置为双面显示
      const planeMaterial = new THREE.MeshBasicMaterial({ 
        map: randomTexture,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide, // 双面渲染
        fog: true // 启用雾效
      });
      
      // 创建平面网格
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      
      // 设置位置到交叉点，与container模型相同位置
      plane.position.set(intersection.x, intersection.y + 0.07, intersection.z);
      
      // 随机旋转（与container模型相同的旋转角度）
      const randomRotation = Math.random() * Math.PI * 2;
      plane.rotation.y = randomRotation + Math.PI/2;
      
      // 生成等比缩放
      const baseScale = Math.random() * 0.1 + 0.05; // 0.05到0.15之间的基础缩放
      const imageScale = baseScale * 10; // 图片缩放为基础缩放的30%
      const containerScale = baseScale; // container缩放为基础缩放
      
      plane.scale.set(imageScale, imageScale, imageScale);
      
      // 给平面添加自定义属性以便识别
      plane.userData.isGeneratedModel = true;
      plane.userData.isImagePlane = true;
      
      // scene.add(plane); // 不再添加平面照片到场景
      
      //加载gltf模型
      gltfLoader.load('public/model/container.glb', //小心报错：要在public文件夹下
        (gltf)=>{
          console.log(gltf);
          // 设置模型位置到交叉点
          gltf.scene.position.set(intersection.x, intersection.y+0.07, intersection.z);
          // 使用相同的随机旋转角度
          gltf.scene.rotation.y = randomRotation;
          // 使用等比缩放
          gltf.scene.scale.set(containerScale, containerScale, containerScale);

          // 给container模型应用玻璃材质和轮廓线
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              // 玻璃材质
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                metalness: 0,
                roughness: 0,
                transmission: 1,
                thickness: 0.2,
                ior: 1.5,
                transparent: true,
                opacity: 1,
                side: THREE.DoubleSide,
                clearcoat: 1,
                clearcoatRoughness: 0,
                envMapIntensity: 1.5,
                // 关键：贴图
                map: randomTexture // 这里用randomTexture
              });
              
              // // 添加黑色轮廓线
              // const edges = new THREE.EdgesGeometry(child.geometry);
              // const lineMaterial = new THREE.LineBasicMaterial({ 
              //   color: 0x000000,
              //   linewidth: 2
              // });
              // const wireframe = new THREE.LineSegments(edges, lineMaterial);
              // child.add(wireframe);
            }
          });

          // 给模型添加自定义属性以便识别
          gltf.scene.userData.isGeneratedModel = true;
          gltf.scene.userData.isContainerModel = true;
          
          // 绑定container和对应的图片
          gltf.scene.userData.pairedImage = plane;
          plane.userData.pairedContainer = gltf.scene;

          scene.add(gltf.scene);
          generatedModels.push(gltf.scene);

          // 显示右侧缩略图弹窗
          showRightThumbnailPopup(randomTexture);
        }
      );
    }
  });
}

// 在文件顶部或合适位置添加全局容器变量
let rightThumbnailContainer = null;

function showRightThumbnailPopup(texture) {
  // 第一次调用时创建右侧总容器
  if (!rightThumbnailContainer) {
    rightThumbnailContainer = document.createElement('div');
    rightThumbnailContainer.id = 'right-thumbnail-container'; // 添加ID以便隐藏滚动条
    rightThumbnailContainer.style.cssText = `
      position: fixed;
      right: 20px;
      top: 0px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      pointer-events: none;
      max-height: 100vh;
      overflow-y: auto;
      background: none;
      scrollbar-width: none;
      -ms-overflow-style: none;
    `;
    
    // 添加CSS样式来隐藏Webkit滚动条
    const style = document.createElement('style');
    style.textContent = `
      #right-thumbnail-container::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    // 添加顶部标题
    const title = document.createElement('div');
    title.textContent = 'processingnewmemorysaved...';
    title.style.cssText = `
      position: sticky;
      top: 0;
      width: 100%;
      background: rgba(255,255,255,0.95);
      font-size: 18px;
      font-weight: bold;
      color: #7c2ae8;
      text-align: right;
      letter-spacing: 2px;
      padding: 6px 8px 4px 8px;
      z-index: 1;
      border-radius: 8px 8px 0 0;
      pointer-events: none;
    `;
    rightThumbnailContainer.appendChild(title);
    document.body.appendChild(rightThumbnailContainer);
  }

  // 创建单个弹窗
  const popup = document.createElement('div');
  popup.style.cssText = `
    width: 180px;
    padding: 5px 10px 3px 10px;
    margin-bottom: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: auto;
    transition: all 0.3s;
  `;

  // 缩略图
  const img = document.createElement('img');
  img.src = texture.image.src;
  
  // 随机高饱和颜色
  const randomHue = Math.random() * 360; // 随机色相
  
  img.style.cssText = `
    width: 150px; 
    height: 150px; 
    object-fit: contain; 
    border-radius: 5px;
    filter: hue-rotate(${randomHue}deg) saturate(200%) contrast(200%) brightness(1.3) drop-shadow(0 0 10px rgba(0,0,0,0.3));
  `;
  popup.appendChild(img);

  // 信息
  const info = document.createElement('div');
  info.style.cssText = 'margin-top: 4px; font-size: 12px; color: #333; text-align: right; width: 100%; word-break: break-all; line-height: 1.2;';
  let sizeStr = '未知';
  if (texture.image && texture.image.width && texture.image.height) {
    sizeStr = `${texture.image.width} x ${texture.image.height}`;
  }
  const imgIndex = imageTextures.findIndex(tex => tex === texture);
  const memoryStr = memoryDescriptions[imgIndex] || '';
  info.innerHTML = `
    <p style="margin: 0 0 2px 0;">SaveTime: ${new Date().toLocaleString()}</p>
    <p style="margin: 0 0 2px 0;">Scene: ${sizeStr}</p>
    <p style="margin: 0 0 2px 0;">Memory: ${memoryStr}</p>
  `;
  popup.appendChild(info);

  // 添加到右侧容器（新弹窗在下方）
  rightThumbnailContainer.appendChild(popup);

  // 保证最新弹窗可见（滚动到底部）
  rightThumbnailContainer.scrollTop = rightThumbnailContainer.scrollHeight;
}

// 存储已生成的窗口位置，用于避免重叠
const existingWindows = [];


function isPositionOverlapping(x, y, width, height, minDistance = 50) {
  for (const existing of existingWindows) {
    const distanceX = Math.abs(x - existing.x);
    const distanceY = Math.abs(y - existing.y);
    if (distanceX < (width + existing.width) / 2 + minDistance && 
        distanceY < (height + existing.height) / 2 + minDistance) {
      return true;
    }
  }
  return false;
}

function generateRandomPosition(windowWidth, windowHeight) {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  const leftTopExclusionWidth = 250;
  const leftTopExclusionHeight = 200;
  const centerBuffer = 100;
  
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    let x, y;
    if (Math.random() < 0.7) {
      x = Math.random() * (screenWidth - windowWidth);
      y = Math.random() * (screenHeight - windowHeight);
      if (x < leftTopExclusionWidth && y < leftTopExclusionHeight) {
        attempts++;
        continue;
      }
    } else {
      x = Math.random() * (screenWidth - windowWidth);
      y = Math.random() * (screenHeight - windowHeight);
      if (x < leftTopExclusionWidth && y < leftTopExclusionHeight) {
        attempts++;
        continue;
      }
    }
    const centerX = screenWidth / 2;
    if (Math.abs(x - centerX) < centerBuffer) {
      attempts++;
      continue;
    }
    if (!isPositionOverlapping(x, y, windowWidth, windowHeight)) {
      return { x, y };
    }
    attempts++;
  }
  
  // 如果尝试次数过多，返回一个随机位置（仍然避开左上角）
  return {
    x: leftTopExclusionWidth + Math.random() * (screenWidth - windowWidth - leftTopExclusionWidth),
    y: leftTopExclusionHeight + Math.random() * (screenHeight - windowHeight - leftTopExclusionHeight)
  };
}

// 创建2D UI影像小窗口！！！
function createImageWindow(texture, imageScale, pairedImage) {
  // 生成唯一的窗口ID
  const windowId = 'popup-window-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  
  // 根据图片scale计算窗口大小，保持等比
  const baseSize = 120; // 基础大小，从200减小到120
  const scaleFactor = Math.max(imageScale.x, imageScale.y, imageScale.z);
  const windowSize = Math.max(100, Math.min(250, baseSize * scaleFactor * 8)); // 限制在100-250之间，从150-400减小
  
  // 计算图片的宽高比
  let aspectRatio = 1; // 默认正方形
  if (texture && texture.image) {
    aspectRatio = texture.image.width / texture.image.height;
  }
  
  // 根据宽高比调整窗口尺寸
  let windowWidth, windowHeight;
  if (aspectRatio > 1) {
    // 横向图片
    windowWidth = windowSize;
    windowHeight = windowSize / aspectRatio + 70; // 为标题栏和状态栏留出空间
  } else {
    // 纵向图片或正方形
    windowHeight = windowSize + 70; // 为标题栏和状态栏留出空间
    windowWidth = windowSize * aspectRatio;
  }
  
  // 生成随机位置
  const position = generateRandomPosition(windowWidth, windowHeight);
  
  // 生成随机高饱和高亮度颜色
  const randomHue = Math.floor(Math.random() * 360);
  const borderColor = `hsl(${randomHue}, 100%, 60%)`;
  const shadowColor = `hsl(${randomHue}, 100%, 70%)`;
  
  // 创建窗口容器
  const windowContainer = document.createElement('div');
  windowContainer.id = windowId;
  windowContainer.style.cssText = `
    position: fixed !important;
    top: ${position.y}px !important;
    left: ${position.x}px !important;
    width: ${windowWidth}px !important;
    height: ${windowHeight}px !important;
    background: white !important;
    border: 1px solid ${borderColor} !important;
    border-radius: 0px !important;
    box-shadow: 0 10px 30px ${shadowColor} !important;
    z-index: 1000 !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
    transition: all 0.1s ease !important;
  `;
  
  // 创建标题栏
  const titleBar = document.createElement('div');
  titleBar.style.cssText = `
    background: ${borderColor} !important;
    color: white !important;
    padding: 6px 8px !important;
    font-family: 'MS Sans Serif', 'Microsoft Sans Serif', sans-serif !important;
    font-size: 12px !important;
    font-weight: bold !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    cursor: move !important;
    transition: all 0.1s ease !important;
    border-bottom: 2px outset ${borderColor} !important;
    text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5) !important;
    letter-spacing: 0.5px !important;
  `;
  titleBar.innerHTML = `
    <span>memory - ${windowId}</span>
    <button id="close-window" style="
      background: ${borderColor} !important;
      border: 2px outset ${borderColor} !important;
      color: white !important;
      cursor: pointer !important;
      font-size: 14px !important;
      font-weight: bold !important;
      width: 20px !important;
      height: 20px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-family: 'MS Sans Serif', 'Microsoft Sans Serif', sans-serif !important;
      text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5) !important;
      box-shadow: 
        inset 1px 1px 0px rgba(255, 255, 255, 0.5),
        inset -1px -1px 0px rgba(0, 0, 0, 0.3) !important;
      transition: all 0.1s ease !important;
    ">×</button>
  `;
  
  // 创建图片容器
  const imageContainer = document.createElement('div');
  imageContainer.style.cssText = `
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #c0c0c0;
    transition: all 0.1s ease;
    border: 1px inset #808080;
    padding: 4px;
  `;
  
  // 创建图片元素
  const img = document.createElement('img');
  img.style.cssText = `
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border: 2px outset #808080;
    transition: all 0.1s ease;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  `;
  
  // 将Three.js纹理转换为图片源
  if (texture && texture.image) {
    img.src = texture.image.src;
  }
  
  // 创建状态栏
  const statusBar = document.createElement('div');
  statusBar.style.cssText = `
    background: #c0c0c0;
    border-top: 2px outset #808080;
    padding: 2px 6px;
    font-size: 10px;
    color: #000;
    font-family: 'MS Sans Serif', 'Microsoft Sans Serif', sans-serif;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 16px;
  `;
  statusBar.innerHTML = `
    <span>Ready</span>
    <span>${new Date().toLocaleTimeString()}</span>
  `;
  
  // 组装窗口
  imageContainer.appendChild(img);
  windowContainer.appendChild(titleBar);
  windowContainer.appendChild(imageContainer);
  windowContainer.appendChild(statusBar);
  document.body.appendChild(windowContainer);
  
  // 记录窗口位置
  existingWindows.push({
    x: position.x,
    y: position.y,
    width: windowWidth,
    height: windowHeight,
    id: windowId
  });
  
  // 故障效果变量
  let glitchStartTime = Date.now();
  let glitchInterval;
  let glitchLevel = 0;
  const maxGlitchLevel = 100;
  

  function applyGlitchEffect() {
    const elapsedTime = Date.now() - glitchStartTime;
    const timeProgress = Math.min(elapsedTime / 30000, 1);
    glitchLevel = Math.floor(timeProgress * maxGlitchLevel);
    
    if (glitchLevel > 0) {
      const shakeIntensity = glitchLevel * 0.3;
      const shakeX = (Math.random() - 0.5) * shakeIntensity;
      const shakeY = (Math.random() - 0.5) * shakeIntensity;
      
      const currentLeft = parseFloat(windowContainer.style.left) || 0;
      const currentTop = parseFloat(windowContainer.style.top) || 0;
      
      const newLeft = Math.max(0, Math.min(window.innerWidth - windowWidth, currentLeft + shakeX));
      const newTop = Math.max(0, Math.min(window.innerHeight - windowHeight, currentTop + shakeY));
      
      windowContainer.style.left = newLeft + 'px';
      windowContainer.style.top = newTop + 'px';
      windowContainer.style.transform = 'none';
      
      const colorOffset = glitchLevel * 0.3;
      const redOffset = (Math.random() - 0.5) * colorOffset;
      const greenOffset = (Math.random() - 0.5) * colorOffset;
      const blueOffset = (Math.random() - 0.5) * colorOffset;
      
      windowContainer.style.filter = `
        drop-shadow(${redOffset}px 0 0 rgba(255,0,0,0.5))
        drop-shadow(${greenOffset}px 0 0 rgba(0,255,0,0.5))
        drop-shadow(${blueOffset}px 0 0 rgba(0,0,255,0.5))
        hue-rotate(${glitchLevel * 2}deg)
        contrast(${100 + glitchLevel * 0.5}%)
        brightness(${100 + glitchLevel * 0.3}%)
      `;
      
      const distortion = glitchLevel * 0.05; 
      const skewX = (Math.random() - 0.5) * distortion;
      const skewY = (Math.random() - 0.5) * distortion;
      const scaleX = 1 + (Math.random() - 0.5) * distortion * 0.2;
      const scaleY = 1 + (Math.random() - 0.5) * distortion * 0.2;
      const waveDistortion = Math.sin(Date.now() * 0.01) * glitchLevel * 0.1;
      
      img.style.transform = `
        skew(${skewX}rad, ${skewY}rad)
        scale(${scaleX}, ${scaleY})
        translate(${(Math.random() - 0.5) * glitchLevel * 0.5}px, ${(Math.random() - 0.5) * glitchLevel * 0.5}px)
        perspective(100px) rotateX(${waveDistortion}deg) rotateY(${waveDistortion}deg)
      `;
      
      const invertAmount = glitchLevel * 0.01; 
      img.style.filter = `invert(${invertAmount}) hue-rotate(${glitchLevel * 3}deg)`;
      if (Math.random() < glitchLevel * 0.01) {
        windowContainer.style.opacity = Math.random() * 0.5 + 0.5;
      } else {
        windowContainer.style.opacity = 1;
      }
      if (Math.random() < glitchLevel * 0.03) {
        const glitchHue = Math.floor(Math.random() * 360);
        const glitchColor = `hsl(${glitchHue}, 100%, 60%)`;
        windowContainer.style.boxShadow = `0 10px 30px ${glitchColor}`;
      } else {
        windowContainer.style.boxShadow = `0 10px 30px ${shadowColor}`;
      }
      if (Math.random() < glitchLevel * 0.02) {
        const glitchHue = Math.floor(Math.random() * 360);
        const glitchColor = `hsl(${glitchHue}, 100%, 60%)`;
        windowContainer.style.border = `${Math.random() * 3 + 1}px solid ${glitchColor}`;
      } else {
        windowContainer.style.border = `1px solid ${borderColor}`;
      }
      if (Math.random() < glitchLevel * 0.015) {
        const glitchHue = Math.floor(Math.random() * 360);
        const glitchColor = `hsl(${glitchHue}, 100%, 70%)`;
        const glitchTextColor = `hsl(${glitchHue}, 100%, 30%)`;
        titleBar.style.background = glitchColor;
        titleBar.style.color = glitchTextColor;
      } else {
        titleBar.style.background = borderColor;
        titleBar.style.color = 'white';
      }
      if (Math.random() < glitchLevel * 0.005) {
        const offsetX = (Math.random() - 0.5) * glitchLevel * 1; 
        const offsetY = (Math.random() - 0.5) * glitchLevel * 1;
        
        const currentLeft = parseFloat(windowContainer.style.left) || 0;
        const currentTop = parseFloat(windowContainer.style.top) || 0;
        
        const newLeft = Math.max(0, Math.min(window.innerWidth - windowWidth, currentLeft + offsetX));
        const newTop = Math.max(0, Math.min(window.innerHeight - windowHeight, currentTop + offsetY));
        
        windowContainer.style.left = newLeft + 'px';
        windowContainer.style.top = newTop + 'px';
      }
      
      if (pairedImage && pairedImage.material && !pairedImage.userData.hasExploded) {
        const invertProgress = glitchLevel / maxGlitchLevel;
        pairedImage.material.color.setRGB(
          1 - invertProgress,
          1 - invertProgress,
          1 - invertProgress
        );
      }
    }
    
    // 如果故障等级达到最大，增加更严重的效果
    if (glitchLevel >= maxGlitchLevel) {
      // 随机旋转 - 限制旋转角度
      if (Math.random() < 0.1) {
        const rotation = (Math.random() - 0.5) * 5; // 减小旋转角度从10度到5度
        windowContainer.style.transform = `rotate(${rotation}deg)`;
      }
      
      // 随机缩放 - 限制缩放范围
      if (Math.random() < 0.05) {
        const scale = 0.9 + Math.random() * 0.2; // 缩小缩放范围从0.8-1.2到0.9-1.1
        windowContainer.style.transform = `scale(${scale})`;
      }
      
      // 检查是否达到爆炸条件
      if (glitchLevel >= maxGlitchLevel) { // 2%概率触发爆炸
        triggerExplosion();
      }
    }
  }
  
  // 爆炸效果函数
  function triggerExplosion() {
    clearInterval(glitchInterval); // 停止故障效果
    
    // 创建爆炸粒子
    const particleCount = 50;
    const particles = [];
    
    // 获取窗口中心位置
    const rect = windowContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // 创建爆炸粒子
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        width: 100px;
        height: 100px;
        background: ${['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'][Math.floor(Math.random() * 7)]};
        border-radius: 20%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
      `;
      
      document.body.appendChild(particle);
      particles.push(particle);
    }
    
    // 爆炸动画
    let explosionTime = 0;
    const explosionDuration = 700; // 1秒爆炸动画
    
    function animateExplosion() {
      explosionTime += 30; // 约60fps
      const progress = explosionTime / explosionDuration;
      
      if (progress < 1) {
        particles.forEach((particle, index) => {
          // 计算粒子运动轨迹
          const angle = (index / particleCount) * Math.PI * 2;
          const distance = progress * 2000; // 最大距离200px
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          
          // 添加重力效果
          const gravity = progress * progress * 80;
          const finalY = y + gravity;
          
          // 添加旋转和缩放
          const rotation = progress * 360;
          const scale = 1 - progress;
          
          particle.style.left = x + 'px';
          particle.style.top = finalY + 'px';
          particle.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`;
          particle.style.opacity = 1 - progress;
        });
        
        requestAnimationFrame(animateExplosion);
      } else {
        // 清理粒子
        particles.forEach(particle => particle.remove());
        
        // 移除窗口
        windowContainer.remove();
        
        // 从记录中移除
        const index = existingWindows.findIndex(w => w.id === windowId);
        if (index > -1) {
          existingWindows.splice(index, 1);
        }
        
        // 爆炸后，对应的pairedImage永久保持反色状态
        if (pairedImage && pairedImage.material) {
          // 标记已爆炸
          pairedImage.userData.hasExploded = true;
          // 获取原始颜色
          let origColor = new THREE.Color(pairedImage._originalColor);
          // 反色
          let invR = 1 - origColor.r;
          let invG = 1 - origColor.g;
          let invB = 1 - origColor.b;
          pairedImage.material.color.setRGB(invR, invG, invB);
        }
        
        // 隐藏retrieve图片
        hideRetrieveImage();
      }
    }
    
    // 开始爆炸动画
    animateExplosion();
  }
  
    // 启动故障效果
  glitchInterval = setInterval(applyGlitchEffect, 50); // 每50ms更新一次故障效果
  
  // 添加关闭按钮的点击效果
  const closeButton = document.getElementById('close-window');
  
  closeButton.addEventListener('mousedown', () => {
    closeButton.style.border = '2px inset ' + borderColor;
    closeButton.style.boxShadow = 'inset 2px 2px 0px rgba(0, 0, 0, 0.3)';
  });
  
  closeButton.addEventListener('mouseup', () => {
    closeButton.style.border = '2px outset ' + borderColor;
    closeButton.style.boxShadow = 'inset 1px 1px 0px rgba(255, 255, 255, 0.5), inset -1px -1px 0px rgba(0, 0, 0, 0.3)';
  });
  
  // 添加关闭功能
  closeButton.addEventListener('click', () => {
    clearInterval(glitchInterval); // 清除故障效果
    windowContainer.remove();
    // 从记录中移除
    const index = existingWindows.findIndex(w => w.id === windowId);
    if (index > -1) {
      existingWindows.splice(index, 1);
    }
    // 手动关闭时，对应的pairedImage也永久保持反色状态
    if (pairedImage && pairedImage.material) {
      pairedImage.userData.hasExploded = true;
      // 获取原始颜色
      let origColor = new THREE.Color(pairedImage._originalColor);
      // 反色
      let invR = 1 - origColor.r;
      let invG = 1 - origColor.g;
      let invB = 1 - origColor.b;
      pairedImage.material.color.setRGB(invR, invG, invB);
    }
    
    // 隐藏retrieve图片
    hideRetrieveImage();
  });
  
  // 添加拖拽功能
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  
  titleBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = windowContainer.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;
      windowContainer.style.left = x + 'px';
      windowContainer.style.top = y + 'px';
      
      // 更新记录的位置
      const windowRecord = existingWindows.find(w => w.id === windowId);
      if (windowRecord) {
        windowRecord.x = x;
        windowRecord.y = y;
      }
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

// 在交叉点上生成模型
generateModelsAtIntersections(intersections);

// 实时在camera附近生成模型的函数
function generateModelsNearCamera() {
  // 获取camera位置
  const cameraPos = camera.position;
  
  // 在camera附近随机位置生成
  const offsetX = Math.random() * 10; // ±5范围
  const offsetZ = Math.random() * 10; // ±5范围
  
  const newPosition = {
    x: cameraPos.x + offsetX,
    z: cameraPos.z + offsetZ,
    y: 0
  };
  
  // 随机选择一张图片纹理
  const randomTexture = imageTextures[Math.floor(Math.random() * imageTextures.length)];
  
  // 随机旋转
  const randomRotation = Math.random() * Math.PI * 2;
  
  // 生成等比缩放
  const baseScale = Math.random() * 0.1 + 0.05;
  const containerScale = baseScale;
  
  // 创建一个虚拟的plane对象用于pairedImage（不添加到场景）
  const plane = {
    material: { map: randomTexture },
    userData: { isImagePlane: true }
  };
  
  // 加载container模型
  gltfLoader.load('/model/container.glb', (gltf) => {
    gltf.scene.position.set(newPosition.x, newPosition.y + 0.07, newPosition.z);
    gltf.scene.rotation.y = randomRotation;
    gltf.scene.scale.set(containerScale, containerScale, containerScale);

    // 应用玻璃材质
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        const glassMaterial = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          metalness: 0,
          roughness: 0,
          transmission: 1,
          thickness: 0.2,
          ior: 1.5,
          transparent: true,
          opacity: 1,
          side: THREE.DoubleSide,
          clearcoat: 1,
          clearcoatRoughness: 0,
          envMapIntensity: 1.5,
          // 关键：贴图
          map: randomTexture // 这里用randomTexture
        });
        child.material = glassMaterial;
      }
    });

    gltf.scene.userData.isGeneratedModel = true;
    gltf.scene.userData.isContainerModel = true;
    
    // 绑定container和对应的图片
    gltf.scene.userData.pairedImage = plane;
    plane.userData.pairedContainer = gltf.scene;

    scene.add(gltf.scene);
    generatedModels.push(gltf.scene);
    // 添加蓝色闪烁效果
    flashContainer(gltf.scene);
    // 新增：右侧弹窗缩略图
    showRightThumbnailPopup(randomTexture);
    
    // 触发encode图片闪烁效果
    flashEncodeImage();
  });
}

// 启动定时生成
function startCameraGeneration() {
  const generateNext = () => {
    generateModelsNearCamera();
    // 2-5秒随机间隔
    const nextInterval = Math.random() * 10000 + 4000; //4-14秒随机间隔
    setTimeout(generateNext, nextInterval);
  };
  generateNext();
}

// 添加container闪烁效果函数
function flashContainer(container) {
  let flashCount = 0;
  const maxFlashes = 2; // 闪烁两次
  const flashDuration = 200; // 每次闪烁200ms
  const flashInterval = 300; // 闪烁间隔300ms
  
  const flash = () => {
    if (flashCount >= maxFlashes) return;
    
    // 保存原始颜色
    const originalColors = [];
    container.traverse((child) => {
      if (child.isMesh && child.material) {
        originalColors.push({
          mesh: child,
          color: child.material.color.getHex(),
          opacity: child.material.opacity
        });
        // 设置为高饱和蓝色
        child.material.color.set(0x0000ff); // 高饱和蓝色
        child.material.opacity = 0.8;
      }
    });
    
    // 闪烁后恢复原始颜色
    setTimeout(() => {
      originalColors.forEach(item => {
        item.mesh.material.color.setHex(item.color);
        item.mesh.material.opacity = item.opacity;
      });
      
      flashCount++;
      if (flashCount < maxFlashes) {
        setTimeout(flash, flashInterval);
      }
    }, flashDuration);
  };
  
  // 开始闪烁
  flash();
}

// 开始生成
startCameraGeneration();

// 创建encode图片
let encodeImage = null;

function createEncodeImage() {
  // 检查是否已存在
  if (encodeImage) return;
  
  // 获取brainthumbnail容器
  const brainContainer = document.getElementById('ui-rectangle');
  if (!brainContainer) return;
  
  // 创建encode图片
  encodeImage = document.createElement('img');
  encodeImage.id = 'encode-image';
  encodeImage.src = '/media/encode.png';
  encodeImage.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1002;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  `;
  
  // 添加到brainthumbnail容器中
  brainContainer.appendChild(encodeImage);
}

// 创建destroy图片
let destroyImage = null;

function createDestroyImage() {
  // 检查是否已存在
  if (destroyImage) return;
  
  // 获取brainthumbnail容器
  const brainContainer = document.getElementById('ui-rectangle');
  if (!brainContainer) return;
  
  // 创建destroy图片
  destroyImage = document.createElement('img');
  destroyImage.id = 'destroy-image';
  destroyImage.src = '/media/destroy.png';
  destroyImage.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1004;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  `;
  
  // 添加到brainthumbnail容器中
  brainContainer.appendChild(destroyImage);
  
  // 开始逐渐显示动画（15分钟）
  startDestroyAnimation();
}

// destroy图片逐渐显示动画
function startDestroyAnimation() {
  if (!destroyImage) return;
  
  const totalDuration = 5 * 60 * 1000; // 15分钟转换为毫秒
  const updateInterval = 1000; // 每秒更新一次
  let elapsedTime = 0;
  
  const animation = setInterval(() => {
    elapsedTime += updateInterval;
    const progress = Math.min(elapsedTime / totalDuration, 1);
    
    // 计算opacity从0到1
    const opacity = progress;
    destroyImage.style.opacity = opacity.toString();
    
    // 动画完成
    if (progress >= 1) {
      clearInterval(animation);
    }
  }, updateInterval);
}

// 创建retrieve图片
let retrieveImage = null;

function createRetrieveImage() {
  // 检查是否已存在
  if (retrieveImage) return;
  
  // 获取brainthumbnail容器
  const brainContainer = document.getElementById('ui-rectangle');
  if (!brainContainer) return;
  
  // 创建retrieve图片
  retrieveImage = document.createElement('img');
  retrieveImage.id = 'retrieve-image';
  retrieveImage.src = '/media/retrieve.png';
  retrieveImage.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1003;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
    filter: hue-rotate(0deg);
  `;
  
  // 添加到brainthumbnail容器中
  brainContainer.appendChild(retrieveImage);
}

// encode图片闪烁函数
function flashEncodeImage() {
  // 确保图片已创建
  if (!encodeImage) {
    createEncodeImage();
  }
  
  if (!encodeImage) return;
  
  let flashCount = 0;
  const maxFlashes = 2; // 闪烁2次
  const flashDuration = 200; // 每次闪烁200ms
  const flashInterval = 300; // 闪烁间隔300ms
  
  const flash = () => {
    if (flashCount >= maxFlashes) {
      // 闪烁完成后隐藏
      encodeImage.style.opacity = '0';
      return;
    }
    
    // 显示图片
    encodeImage.style.opacity = '1';
    
    // 闪烁后隐藏
    setTimeout(() => {
      encodeImage.style.opacity = '0';
      
      flashCount++;
      if (flashCount < maxFlashes) {
        setTimeout(flash, flashInterval);
      }
    }, flashDuration);
  };
  
  // 开始闪烁
  flash();
}

// retrieve图片显示和颜色变化函数
function showRetrieveImage() {
  // 确保图片已创建
  if (!retrieveImage) {
    createRetrieveImage();
  }
  
  if (!retrieveImage) return;
  
  // 显示retrieve图片
  retrieveImage.style.opacity = '1';
  retrieveImage.style.filter = 'hue-rotate(0deg)';
  
  // 开始颜色变化动画（从绿色到紫色）
  let colorProgress = 0;
  const colorChangeDuration = 30000; // 30秒内完成颜色变化
  const colorInterval = 100; // 每100ms更新一次颜色
  
  const colorChange = setInterval(() => {
    colorProgress += colorInterval / colorChangeDuration;
    
    if (colorProgress >= 1) {
      colorProgress = 1;
      clearInterval(colorChange);
    }
    
    // 使用hue-rotate从绿色(120deg)渐变到紫色(300deg)
    const hueRotation = 120 + (300 - 120) * colorProgress;
    retrieveImage.style.filter = `hue-rotate(${hueRotation}deg)`;
  }, colorInterval);
  
  // 保存interval引用，以便在爆炸时清除
  retrieveImage.colorChangeInterval = colorChange;
}

// 隐藏retrieve图片函数
function hideRetrieveImage() {
  if (retrieveImage) {
    // 清除颜色变化动画
    if (retrieveImage.colorChangeInterval) {
      clearInterval(retrieveImage.colorChangeInterval);
      retrieveImage.colorChangeInterval = null;
    }
    
    // 隐藏图片
    retrieveImage.style.opacity = '0';
  }
}

// 页面加载时创建encode图片、retrieve图片和destroy图片
document.addEventListener('DOMContentLoaded', () => {
  createEncodeImage();
  createRetrieveImage();
  createDestroyImage();
  
  // 创建新的打字效果div
  createTypingDiv();
  
  // 创建左边竖着的长方形
  createLeftRectangle();
});

// let rgbeLoader = new RGBELoader(); 环境贴图给gltf贴图的





//创建射线
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  //console.log(event.clientX,event.clientY);
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(generatedModels);

  if (intersects.length > 0) {
    // 获取第一个被点击的模型
    var clickedModel = intersects[0].object;
    intersects[0].object._isSelect = false;
    // 确保点击的是我们生成的模型
    while (clickedModel && !clickedModel.userData.isGeneratedModel) {
      clickedModel = clickedModel.parent;
    }
    
    if (clickedModel) {
      
      intersects[0].object._isSelect = true;
      intersects[0].object._originalColor = intersects[0].object.material.color.getHex();
      intersects[0].object.material.color.set(0x00ff00);
      console.log('模型被点击了!', clickedModel);

      // 显示retrieve图片
      showRetrieveImage();

             const pairedImage = clickedModel.userData.pairedImage;
       if (pairedImage) {
         // 检查是否是虚拟的pairedImage（camera附近生成的）
         if (pairedImage.material && pairedImage.material.map) {
           // 为虚拟对象添加scale属性
           if (!pairedImage.scale) {
             pairedImage.scale = { x: 1, y: 1, z: 1 };
           }
           
           // 创建2D UI窗口显示图片，传递图片的scale信息
           createImageWindow(pairedImage.material.map, pairedImage.scale, pairedImage);
         }
       }
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // 创建audio元素
  const audio = document.createElement('audio');
  audio.src = '/music/underwater-white-noise-46423.mp3'; // 替换为你的音乐文件名
  audio.loop = true;            // 循环播放
  audio.autoplay = true;        // 自动播放
  audio.volume = 0.2;           // 音量（0~1，可调整）

  // 兼容部分浏览器的自动播放策略
  audio.addEventListener('canplay', () => {
    audio.play();
  });

  document.body.appendChild(audio);
});

// 创建新的打字效果div
function createTypingDiv() {
  // 创建容器div
  const typingContainer = document.createElement('div');
  typingContainer.id = 'typing-container';
  typingContainer.style.cssText = `
    position: fixed;
    bottom: 40px;
    left: 80px;
    width: 60px;
    height: 630px;
    background-color: transparent;
    border: none;
    opacity: 0.3;
    z-index: 9999;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    color:rgb(84, 0, 66);
    font-family: 'Courier New', monospace;
    font-size: 11px;
    font-weight: bold;
    text-align: left;
    overflow: visible;
    writing-mode: vertical-rl;
    text-orientation: mixed;
  `;
  
  // 创建文本元素
  const typingText = document.createElement('div');
  typingText.id = 'typing-text';
  typingText.style.cssText = `
    width: 100%;
    height: auto;
    min-height: 100%;
    padding: 10px;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.1;
    overflow: visible;
  `;
  
  typingContainer.appendChild(typingText);
  document.body.appendChild(typingContainer);
  
  // 7段话的内容
  const typingTexts = [
    'Neuroplasticity refers to the brain\'s ability to reorganize its structure and function in response to experience, learning, or injury. This phenomenon underscores the dynamic nature of neural networks, contrasting with earlier views of the brain as a static organ. Research by Merzenich et al. (1984) demonstrated cortical remapping in primates following digit amputation, where adjacent brain regions assumed control of lost functions. Similarly, Maguire et al. (2000) found hippocampal expansion in London taxi drivers, correlating with spatial navigation expertise. Such studies highlight neuroplasticity\'s role in both recovery and skill acquisition, emphasizing its implications for rehabilitation and cognitive training.',
    'Localization of function posits that specific cognitive processes are mediated by distinct brain regions. Broca (1861) and Wernicke (1874) pioneered this concept, linking expressive aphasia to the left frontal lobe and receptive aphasia to the left temporal lobe, respectively. Modern neuroimaging, such as PET scans by Petersen et al. (1988), further localized language comprehension to Wernicke’s area and speech production to Broca’s area. However, contemporary research acknowledges that while functions are localized, they operate within distributed networks, integrating both specialized and collaborative neural mechanisms.',
    'neural pattern recognition active...',
    'memory consolidation in progress...',
    'synaptic connections established...',
    'retrieval protocols loaded...',
    'system ready for memory access...'
  ];
  
  let currentTextIndex = 0;
  let currentCharIndex = 0;
  let isTyping = false;
  let typingInterval;
  
  // 打字机效果函数
  function typeText(text) {
    if (isTyping) return;
    
    isTyping = true;
    currentCharIndex = 0;
    typingText.textContent = '';
    
    typingInterval = setInterval(() => {
      if (currentCharIndex < text.length) {
        typingText.textContent += text[currentCharIndex];
        currentCharIndex++;
      } else {
        clearInterval(typingInterval);
        isTyping = false;
        
        // 当前文本完成后，等待一段时间再开始下一段
        setTimeout(() => {
          currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
          typeText(typingTexts[currentTextIndex]);
        }, 2000); // 等待2秒后开始下一段
      }
    }, 50); // 每50ms打一个字
  }
  
  // 开始显示第一段话
  typeText(typingTexts[0]);
}

// 创建左边竖着的长方形
function createLeftRectangle() {
  // 创建长方形div
  const leftRectangle = document.createElement('div');
  leftRectangle.id = 'left-rectangle';
  leftRectangle.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    width: 150px;
    height: 100vh;
    background-color: rgba(236, 236, 236, 0.3);
    border: none;
    z-index: 0;
    pointer-events: none;
  `;
  
  // 添加到页面
  document.body.appendChild(leftRectangle);
}