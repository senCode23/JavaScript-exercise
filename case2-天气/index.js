const barContainer = document.querySelector('.nav-bar');

const handleBgMove = (bar) => {
    const bg = document.querySelector('.title-bg');
    bg.style.transform = `translate(${bar.offsetLeft+20}px,${bar.offsetTop+10}px)`;
}   

const handleImgChange = (bar,bars) => {
    const imgs = document.querySelectorAll('.img-box');
    imgs.forEach(img=>img.classList.remove('img-selected'));
    let index = [...bars].indexOf(bar);
    imgs[index].classList.add('img-selected');
}

barContainer.addEventListener('click',(event)=>{
    const bar = event.target.closest('.title');
    const bars = barContainer.querySelectorAll('.title')
    bars.forEach(bar=>bar.classList.remove('title-selected'));
    if(!bar) return;
    bar.classList.add('title-selected');
    handleBgMove(bar);
    handleImgChange(bar,bars);
})

