const moveHandler = document.querySelector('.moveBar');
const container = document.querySelector('.container');
const addBar = document.querySelector('.add-unit');
const blockContainer = document.querySelector('.container-body');

let movable = false;
let startX = 0;
let startY = 0;
let currentX = 0;  // 当前累计的X偏移
let currentY = 0; 

const handleContainerMove = (event) => {
    if (movable) {
        // 计算本次移动的偏移量
        const moveX = event.clientX - startX;
        const moveY = event.clientY - startY;
        
        // 更新当前位置（累计偏移）
        currentX += moveX;
        currentY += moveY;
        
        // console.log(currentX,currentY);
        
        container.style.transform = `translate(${currentX}px, ${currentY}px)`;
        
        // 重置起始点，为下一次移动做准备
        startX = event.clientX;
        startY = event.clientY;
    }
}

const handleBlockClick = (e) => {
    if (e.currentTarget === e.target){
        blocks.forEach(block => {
            block.classList.remove('selected-unit');
        });
    }
}

// 事件委托，给父元素绑定事件，处理子元素的点击事件
blockContainer.addEventListener('mouseover',(e) => {
    const bar = e.target.closest('.one-unit');
    if(!bar) return;
    bar.style.transform = `translate(0px, -10px)`;

})
blockContainer.addEventListener('mouseout', (e) => {
    const bar = e.target.closest('.one-unit');
    if (!bar) return; 
    bar.style.transform = `translate(0px, 0px)`;
});

// 一次性绑定到父元素
blockContainer.addEventListener('click', (e) => {
    const target = e.target;
    const bar = target.closest('.one-unit');
    if (!bar || bar.classList.contains('add-unit')) return;
    
    const allBars = document.querySelectorAll('.one-unit:not(.add-unit)');
    allBars.forEach(block => {
        block.classList.remove('selected-unit');
    });
    bar.classList.add('selected-unit');

    bar.addEventListener('mousedown',(e) => {
        if(!e) return;
        e.target.style.transform = `translate(0px, -2px)`;
    })
    bar.addEventListener('mouseup',(e) => {
        if(!e) return;
        e.target.style.transform = `translate(0px, -10px)`;
    })
});

addBar.addEventListener('click', (e) => {
    const bars = document.querySelectorAll('.one-unit:not(.add-unit)');
    all = document.querySelectorAll('.one-unit:not(.add-unit)')
    if (bars.length > 0) {
        const lastBar = bars[bars.length - 1];
        const newBar = lastBar.cloneNode(true);
        newBar.classList.remove('selected-unit');
        newBar.id = '';
        e.currentTarget.parentNode.insertBefore(newBar, e.currentTarget);
    }
});

moveHandler.addEventListener('mousedown', (event) => {
    movable = true;
    startX = event.clientX;
    startY = event.clientY;
    event.preventDefault();
});

moveHandler.addEventListener('mouseup', (event) => {
    movable = false;
});


let blockMovable = false;
let currentDraggingBlock = null;
let blockStartPos = {x: 0, y: 0 };
let blockCurPos = {x: 0, y: 0 };
let blockGap = 16;
let targetIndex = 0;
let currentIndex = 0;
let blockWidth = 0;
let moveStep = 0;
let all = document.querySelectorAll('.one-unit:not(.add-unit)');

const handleBlocksMove = (e) => {
    if (blockMovable && currentDraggingBlock) {
        const movX = e.clientX - blockStartPos.x; 
        const movY = e.clientY - blockStartPos.y;

        blockCurPos.x += movX;
        blockCurPos.y += movY;

        // 只更新视觉位置，不进行DOM重排
        currentDraggingBlock.style.transform = `translate(${blockCurPos.x}px, ${blockCurPos.y}px)`;

        blockStartPos.x = e.clientX;
        blockStartPos.y = e.clientY;
    }
};

const handleMouseUp = () => {
    if (blockMovable && currentDraggingBlock) {
        moveStep = parseInt(blockCurPos.x / blockWidth);
        targetIndex = currentIndex + moveStep;
        
        // 限制索引范围
        targetIndex = Math.max(0, Math.min(targetIndex, all.length - 1));
        
        if (targetIndex !== currentIndex) {
            const targetElement = all[targetIndex];
            
            if (moveStep > 0) {
                if (targetElement.nextElementSibling) {
                    currentDraggingBlock.parentNode.insertBefore(
                        currentDraggingBlock, 
                        targetElement.nextElementSibling
                    );
                } else {
                    currentDraggingBlock.parentNode.appendChild(currentDraggingBlock);
                }
            } else {
                currentDraggingBlock.parentNode.insertBefore(currentDraggingBlock, targetElement);
            }
            
            all = document.querySelectorAll('.one-unit:not(.add-unit)');
            currentIndex = targetIndex;
        }
        
        // 重置transform
        currentDraggingBlock.style.transform = 'translate(0px, 0px)';
        blockCurPos.x = 0;
        blockCurPos.y = 0;
        
        // 恢复样式
        currentDraggingBlock.style.transition = 'transform 0.2s ease';
        currentDraggingBlock.style.zIndex = '1';
        
        blockMovable = false;
        currentDraggingBlock = null;
    }
};

// 子元素移动
blockContainer.addEventListener('mousedown', (e) => {
    if(e.target?.matches('.one-unit:not(.add-unit)')){
        blockMovable = true;
        currentDraggingBlock = e.target;
        blockWidth = currentDraggingBlock.getBoundingClientRect().width;

        // 查找当前索引
        all.forEach((item, index) => {
            if (item === currentDraggingBlock) {
                currentIndex = index;
                targetIndex = index;
            }
        });

        // 重置位置
        blockCurPos.x = 0;
        blockCurPos.y = 0;
        
        blockStartPos.x = e.clientX;
        blockStartPos.y = e.clientY;
        
        e.preventDefault();
        currentDraggingBlock.style.transition = 'none';
        currentDraggingBlock.style.zIndex = '10';
    }
});

document.addEventListener('mousemove', handleBlocksMove);

document.addEventListener('mousemove', handleContainerMove);
document.addEventListener('mouseup', () => {
    movable = false;
    handleMouseUp();
});