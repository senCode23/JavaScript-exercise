// 输入框
class InputBar {
    constructor() {
        this.inputElement = document.querySelector('.input-text');
        this.butBox = document.querySelector('.input-button');
    }

    init() {
        this.inputElement.addEventListener('focus', (e) => {
            this.inputElement.classList.add('input-focus');
            this.butBox.style.opacity = '1';
        });

        this.inputElement.addEventListener('blur', (e) => {
            this.inputElement.classList.remove('input-focus');
            this.butBox.style.opacity = '0';

        });
    }
}

const inputBar = new InputBar();    // 创建实例
inputBar.init();

