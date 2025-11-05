<script>
        document.addEventListener('DOMContentLoaded', function() {
            const slider = document.querySelector('.slider');
            const slides = document.querySelectorAll('.slide');
            const dots = document.querySelectorAll('.pagination-dot');
            const prevBtn = document.querySelector('.slider-nav-btn.prev');
            const nextBtn = document.querySelector('.slider-nav-btn.next');
            
            let currentSlide = 0;
            const slideCount = slides.length;
        
            function goToSlide(index) {
                if (index < 0) {
                    index = slideCount - 1;
                } else if (index >= slideCount) {
                    index = 0;
                }
                
                slider.style.transform = `translateX(-${index * 100}%)`;
                
                dots.forEach(dot => dot.classList.remove('active'));
                dots[index].classList.add('active');
                
                currentSlide = index;
            }
            
            prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
            nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
            
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => goToSlide(index));
            });
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    goToSlide(currentSlide - 1);
                } else if (e.key === 'ArrowRight') {
                    goToSlide(currentSlide + 1);
                }
            });
        });
</script>

<template>
<div class="slider-container">
        <div class="slider">
            <div class="slide">
                <h1 class="slide-title">ШИРОКИЙ АССОРТИМЕНТ ОДЕЖДЫ</h1>
                <p class="slide-subtitle">Одежда от известных брендов у нас в каталоге. Только качественные вещи.</p>
                <a href="#" class="btn-catalog">ПЕРЕЙТИ В КАТАЛОГ</a>
            </div>
            <div class="slide">
                <h1 class="slide-title">СТИЛЬ И КАЧЕСТВО</h1>
                <p class="slide-subtitle">Современные тенденции моды и проверенные временем классические модели.</p>
                <a href="#" class="btn-catalog">СМОТРЕТЬ КОЛЛЕКЦИЮ</a>
            </div>
            <div class="slide">
                <h1 class="slide-title">СКИДКИ ДО 50%</h1>
                <p class="slide-subtitle">Специальные предложения на новую коллекцию. Успейте приобрести по выгодной цене!</p>
                <a href="#" class="btn-catalog">ПОСМОТРЕТЬ АКЦИИ</a>
            </div>
        </div>
        
        <!-- Кнопки навигации снизу слева -->
        <div class="slider-nav">
            <div class="slider-nav-btn prev">
                <p><</p>
            </div>
            <div class="slider-nav-btn next">
                <p>></p>
            </div>
        </div>
        
        <!-- Вертикальная пагинация справа по центру -->
        <div class="vertical-pagination">
            <div class="pagination-dot active"></div>
            <div class="pagination-dot"></div>
            <div class="pagination-dot"></div>
        </div>
    </div>
</template>

<style scoped>        
        .slider-container {
            position: relative;
            width: 100%;
            max-width: 1200px;
            margin: 40px auto;
            overflow: hidden;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        
        .slider {
            display: flex;
            transition: transform 0.6s ease-in-out;
            height: 550px;
        }
        
        .slide {
            min-width: 100%;
            padding: 60px;
            display: flex;
            background: linear-gradient(135deg, rgba(26, 26, 28, 0.2) 0%, rgba(18, 18, 20, 0.2) 100%);
            flex-direction: column;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        .slide::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('../src/assets/img/slide_white_shirt.png') center/cover no-repeat;
            opacity: 0.6;
            z-index: -1;
        }
        
        .slide:nth-child(2)::before {
            background: url('../src/assets/img/slide_yellow_shirt.png') center/cover no-repeat;
        }
        
        .slide:nth-child(3)::before {
            background: url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3') center/cover no-repeat;
        }
        
        .slide-title {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 10px;
            color: #171819;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            letter-spacing: 2px;
            line-height: 1.2;
        }
        
        .slide-subtitle {
            font-size: 1.4rem;
            margin-bottom: 40px;
            color: #171819;
            max-width: 600px;
            line-height: 1.6;
        }
        
        .btn-catalog {
            display: inline-block;
            background: #121214;
            color: white;
            padding: 16px 40px;
            font-size: 1.1rem;
            font-weight: 600;
            text-decoration: none;
            border-radius: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            width: fit-content;
        }
        
        .btn-catalog:hover {
            transform: translateY(-3px);
            background-color: #00BDFF;
        }
        
        .slider-nav {
            position: absolute;
            bottom: 30px;
            left: 30px;
            display: flex;
            gap: 15px;
            z-index: 10;
        }

        .slider-nav p{
            color: #171819;
            font-size: 28px;
        }
        
        .slider-nav-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.4);
        }
        
        .slider-nav-btn:hover {
            background-color: rgba(73, 208, 255, 0.2);
            transform: translateY(-3px);
        }
        
        .slider-nav-btn i {
            font-size: 20px;
            color: #fff;
        }
        
        /* Вертикальная пагинация (справа по центру) */
        .vertical-pagination {
            position: absolute;
            top: 50%;
            right: 30px;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 15px;
            z-index: 10;
        }
        
        .pagination-dot {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.4);
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .pagination-dot.active {
            background-color: #49D0FF;
            transform: scale(1.3);
        }
        
        .pagination-dot::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 1px solid transparent;
            transition: all 0.3s ease;
        }

        .pagination-dot:hover {
            background-color: #49D0FF;
            opacity: 0.4;
            transition: all 0.3s ease;
        }
        
        .pagination-dot:hover::after {
            border-color: rgba(255, 255, 255, 0.3);
        }
        
        .pagination-dot.active::after {
            border-color: #49D0FF;
        }
</style>